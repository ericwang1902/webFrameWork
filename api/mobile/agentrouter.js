var express = require('express');
var router = express.Router();

var wechatutil = require('../common/wechatutil');
var config = require('../frameConfig/frameConfig');
var wechatapi = require('../common/wechatapi');

var orderModel = require("../sysmanage/order/orderModel");
var ficorderModel = require('../sysmanage/ficorder/ficorderModel');
var shoporderModel = require('../sysmanage/shoporder/shoporderModel');
var fansModel = require('../sysmanage/fans/fansModel');
var courierModel = require('../sysmanage/courier/courierModel');

var async = require('async');
var moment = require('moment');


router.get('/', function (req, res, next) {
    var url = wechatutil.getwechatauthurl('aft.robustudio.com', '/mobile/agent/agentindex');
    console.log("url~~~~~~~~~~" + url)
    res.redirect(url);
});


router.get('/agentindex', wechatutil.getopenid, function (req, res, next) {
    var openid = req.session.openid;

    res.redirect(config.mobileAgent + "?openid=" + openid);
});

//移动端一键分发订单
router.post('/mdeliver', function (req, res, next) {
    var regionid = req.body.regionid;
    console.log("regionid:" + regionid);
    /*根据regionid查找user order
    1.先计算该区域的ordercount；
    2.如果改区域的ordercount>0，取出这些客户订单形成数组，做下发处理；
    3.下发处理步骤一：生成ficorder；
    4.下发处理步骤二：创建商户订单，关联ficorder，通知商户；
    5.下发处理步骤三：为客户订单的ficorder字段关联，通知客户
    */
    async.waterfall([
        //查询订单
        function (callback) {
            orderModel.find({ region: regionid,ficorder: { $exists: false } })
                .exec(function (err, orders) {
                    if (err) {
                        console.log(err);
                        callback(new Error("查询订单出错"))
                    }
                    if (orders.length > 0) {
                        callback(null, orders);
                    } else {
                        callback(new Error("该地区无订单"))
                    }
                })
        },
        //创建ficorder
        function (custorders, callback) {
            var ficorder = new ficorderModel({
                ficordernum: 'F' + moment().format('YYYYMMDDHHmmssSSS'),
                ficorderstate: 1,
                region: regionid
            });

            ficorder.save(function (err, ficorder) {
                if (err) {
                    console.log(err);
                    callback(new Error("创建ficorder出错"))
                }
                console.log("ficorder:"+JSON.stringify(ficorder));
                //根据orgion 查找courier
                courierModel.findOne({ region: regionid })
                    .populate({
                        path: 'district',
                        model: 'district'
                    })
                    .populate({
                        path: 'region',
                        model: 'region'
                    })
                    .populate({
                        path: 'courieruser',
                        model: 'user'
                    })
                    .exec(function (err, courier) {
                        if (err) {
                            console.log(err);
                            callback(new Error("该区域无配送员"))
                        }
                        var openid = courier.courieruser.openid;

                        //发送新订单提醒给配送员
                        wechatapi.sendMsgToCourier(openid, ficorder, () => {
                            callback(null, custorders, ficorder);
                        });
                    })
            });
        },
        //根据用户订单创建商户订单
        function (custorders, ficorder, callback) {
            console.log("custorders:"+JSON.stringify(custorders));
            console.log("ficorder:"+JSON.stringify(ficorder));
            //1.按商品拆分订单,按照供应商汇总
            var goodslist = [];
            for (var i = 0; i < custorders.length; i++) {
                for (var j = 0; j < custorders[i].suitelist.length; j++) {

                    var count = custorders[i].suitelist[j].count;//套餐数量（也就是该套餐下的商品的数量)
                    var suite = custorders[i].suitelist[j].suite;
                    console.log(suite)

                    for (var k = 0; k < suite.goodslist.length; k++) {
                        var supplierid = suite.goodslist[k].supplier._id;
                        var district = suite.goodslist[k].supplier.district
                        var goods = suite.goodslist[k];
                        var goodscount = count;

                        var goodsitem = {
                            supplier: supplierid,
                            district: district,
                            goods: goods,
                            goodscount: goodscount
                        }
                        goodslist.push(goodsitem);
                    }
                }
            }
            console.log("goodslist:"+JSON.stringify(goodslist));
            //2.根据goodslist中的goods数据，按照supplierid来分组,按照goods汇总数据，构成shoporder
            var shopgoodslist = [];
            for (var i = 0; i < goodslist.length; i++) {
                //如果没有在shopgoodslist中，就要加上count
                if (!shopgoodslist.find(d => d.goods._id == goodslist[i].goods._id)) {
                    shopgoodslist.push(goodslist[i]);
                } else {
                    var index = shopgoodslist.indexOf(shopgoodslist.find(d => d.goods._id == goodslist[i].goods._id));
                    shopgoodslist[index].goodscount += goodslist[i].goodscount;
                }
            }
             console.log("shopgoodslist:"+JSON.stringify(shopgoodslist));

            //3.按供应商汇总goods
            var shoporderlist = [];
            for (var i = 0; i < shopgoodslist.length; i++) {
                if (!shoporderlist.find(d => d.supplier == shopgoodslist[i].supplier)) {
                    shoporderlist.push({
                        supplier: shopgoodslist[i].supplier,
                        district: shopgoodslist[i].district,
                        ficorder: ficorder._id,
                        goodslist: [
                            {
                                goods: shopgoodslist[i].goods,
                                goodscount: shopgoodslist[i].goodscount
                            }
                        ]
                    })
                } else {
                    var index = shoporderlist.indexOf(shoporderlist.find(d => d.supplier == shopgoodslist[i].supplier));
                    shoporderlist[index].goodslist.push({
                        goods: shopgoodslist[i].goods,
                        goodscount: shopgoodslist[i].goodscount
                    })
                }
            }
            console.log("shoporderlist:"+JSON.stringify(shoporderlist));
            //4.批量创建商铺订单
            createShopOrder(shoporderlist, function () {
                callback(null, custorders, ficorder);
            });
        },
        //更新客户订单
        function(custorders,ficorder,callback){
            updateorder(custorders,ficorder,function(){
                callback(null,custorders,ficorder);
            })
        }
    ], function (err, result) {
        if (err) console.log(err.message);

        return res.json({deresult:true});
    })

})


var createShopOrder = function (shoporderlist, callback2) {
    console.log(JSON.stringify(shoporderlist));
    async.each(shoporderlist, function (shoporder, callback) {
        var amount = 0;
        for (var i = 0; i < shoporder.goodslist.length; i++) {
            amount += shoporder.goodslist[i].goods.goodsbuyprice * shoporder.goodslist[i].goodscount;
        }

        var shoporder = new shoporderModel(
            {
                ordernum: 'S' + moment().format('YYYYMMDDHHmmssSSS'),
                goodslist: shoporder.goodslist,
                orderamount: amount,
                district: shoporder.district,
                ordertime: moment(),//订单生成时间
                preparetime: '',
                finishtime: '',
                picktime: '',
                receivetime: '',
                ficorder: shoporder.ficorder,
                supplier: shoporder.supplier
            }
        );

        shoporder.save(function (err, result) {
            if (err) {
                console.log(err);
                callback(err);
            }
            //查询result的通知
            shoporderModel.findOne({ _id: result._id })
                .populate({
                    path: 'district',
                    model: 'district'
                })
                .populate({
                    path: 'ficorder',
                    model: 'ficorder'
                })
                .populate({
                    path: 'supplier',
                    model: 'supplier',
                    populate: {
                        path: 'supplieruser',
                        model: 'user',
                    }
                })
                .exec(function (err, shoporderres) {
                    if (err) {
                        console.log(err);
                        callback(err);
                    }
                    console.log("----------------------------------")
                    console.log(JSON.stringify(shoporderres))
                    //发送订单通知
                    wechatapi
                        .sendNewOrderTemplateMsg(shoporderres.supplier.supplieruser.openid,
                        shoporderres,
                        function () {
                            callback();
                        });
                })
        })

    }, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("shoporder都存储了！");
            callback2()
        }
    })
}


var updateorder=function(orderlist,ficorder,callback2){

    async.each(orderlist, function (order, callback) {
            orderModel.findOne({ _id: order._id })
                .exec(function (err, orderresult) {
                    if (err) {
                        console.log(err);
                        callback(err);
                    }
                    orderresult.ficorder = ficorder._id;
                    orderresult.save(function (err, result) {
                        if (err) {
                            console.log(err);
                            callback(err);
                        }

                        fansModel.findById({ _id: result.fanid })
                            .exec(function (err, fans) {
                                if (err) {
                                    console.log(err)
                                }

                                //发送订单通知
                                wechatapi
                                    .sendOrderStateTemplateMsg(fans.fanopenid,
                                    result,
                                    function () {
                                        callback();
                                    });

                            })
                    })
                })

        }, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("order都更新了");
               callback2();
            }
        })
}

module.exports = router;