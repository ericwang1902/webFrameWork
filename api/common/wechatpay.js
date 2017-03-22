var request = require('request');

var frameconfig = require('../frameConfig/frameConfig');

//随机字符串生成
function getNonceStr() {
    return Math.random().toString(36).substr(2, 15);
};

//取得timestamp
function getTimeStamp() {
    return parseInt(new Date().getTime() / 1000) + '';
};


//加密签名，申请prepayid的加密函数
function paysignjsapi(appid, attach, body, mch_id, nonce_str, notify_url, openid, out_trade_no, spbill_create_ip, total_fee, trade_type) {
    var ret = {
        appid: appid,
        attach: attach,
        body: body,
        mch_id: mch_id,
        nonce_str: nonce_str,
        notify_url: notify_url,
        openid: openid,
        out_trade_no: out_trade_no,
        spbill_create_ip: spbill_create_ip,
        total_fee: total_fee,
        trade_type: trade_type
    };
    var string = raw1(ret);
   
    var key = 'YkvgfBU1zLRXYyCzJdYn0tdOApIxUL4v';
    string = string + '&key=' + key;
     console.log("加密签名，申请prepayid的加密函数");
    console.log(string);
    var crypto = require('crypto');
    var cryString = crypto.createHash('md5').update(string, 'utf8').digest('hex');
    //对加密后签名转化为大写
    return cryString.toUpperCase();
};

//加密签名，给微信端产生支付的加密函数
function paysignjs(appid,nonceStr,package,signType,timeStamp) {
    var ret = {
        appId: appid,
        nonceStr: nonceStr,
        package:package,
        signType:signType,
        timeStamp:timeStamp
    };
    var string = raw1(ret);
    var key = 'YkvgfBU1zLRXYyCzJdYn0tdOApIxUL4v';
    string = string + '&key='+key;
    console.log(string);
    var crypto = require('crypto');
    var cryString = crypto.createHash('md5').update(string, 'utf8').digest('hex');
    //对加密后签名转化为大写
    return cryString.toUpperCase();
};

//大小写转换，字符串拼接等操作，待确认
function raw1(args) {
  var keys = Object.keys(args);
  keys = keys.sort()
  var newArgs = {};
  keys.forEach(function (key) {
    newArgs[key] = args[key];
  });
  var string = '';
  for (var k in newArgs) {
    string += '&' + k + '=' + newArgs[k];
  }
  string = string.substr(1);
  return string;
};
//解析xml
function getXMLNodeValue(node_name,xml){
    var tmp = xml.split("<"+node_name+">");
    var _tmp = tmp[1].split("</"+node_name+">");
    return _tmp[0];
}

var createPrepay = function (order,openid,callback) {

    var bookingNo = order.ordernum;
    var appid = frameconfig.wechatConfig.appid;
    var attach = "小熊下午茶";
    var mch_id = frameconfig.wechatmchid;
    var nonce_str = getNonceStr();
    var total_fee = order.totalamount;
    var spbill_create_ip = "127.0.0.1";
    var notify_url = frameconfig.wechaturl;
    var openid = openid;
    var body = "小熊下午茶";
    var timeStamp = getTimeStamp();
    var url = "https://api.mch.weixin.qq.com/pay/unifiedorder";

    var formData = "<xml>";
    formData += "<appid>" + appid + "</appid>";  //appid
    formData += "<attach>" + attach + "</attach>"; //附加数据
    formData += "<body>" + body + "</body>";
    formData += "<mch_id>" + mch_id + "</mch_id>";  //商户号
    formData += "<nonce_str>" + nonce_str + "</nonce_str>"; //随机字符串，不长于32位。
    formData += "<notify_url>" + notify_url + "</notify_url>";
    formData += "<openid>" + openid + "</openid>";
    formData += "<out_trade_no>" + bookingNo + "</out_trade_no>";
    formData += "<spbill_create_ip>"+spbill_create_ip+"</spbill_create_ip>";
    formData += "<total_fee>" + total_fee + "</total_fee>";
    formData += "<trade_type>JSAPI</trade_type>";
    formData += "<sign>" + paysignjsapi(appid, attach, body, mch_id, nonce_str, notify_url, openid, bookingNo, spbill_create_ip, total_fee, 'JSAPI') + "</sign>";
    formData += "</xml>";
    console.log(formData);

    request({ url: url, method: 'POST', body: formData }, function (err, response, body) {
        if (!err && response.statusCode == 200) {
            console.log(body);
            var prepay_id = getXMLNodeValue('prepay_id', body.toString("utf-8"));
            var tmp = prepay_id.split('[');
            var tmp1 = tmp[2].split(']');
            //签名
            var _paySignjs = paysignjs(appid, nonce_str, 'prepay_id=' + tmp1[0], 'MD5', timeStamp);
            //res.render('jsapipay', { prepay_id: tmp1[0], _paySignjs: _paySignjs });
            var prepayid = temp1[0];
            var paySign=_paySignjs;
            
            callback(prepayid,paySign);
        }
    });
}

module.exports = {
    createPrepay
}