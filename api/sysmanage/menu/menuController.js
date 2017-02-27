var menuModel = require('./menuModel.js');
var async = require('async')
var mongoose = require('mongoose')

/**
 * menuController.js
 *
 * @description :: Server-side logic for managing menus.
 */
module.exports = {

    /**
     * 查看所有菜单列表
     */
    list: function (req, res) {
        console.log(req.query)
        var pageItems = Number(req.query.pageItems) ;
        var currentPage =Number(req.query.currentPage);

        async.series([
            function (callback) {
                //获取总条数
                menuModel.count({}, function (err, count) {
                    if (err) console.log(err);
                    callback(null, count);
                })
            },
            function (callback) {
                menuModel
                    .find()
                    .populate('funcList')
                    .skip((currentPage - 1) * pageItems)
                    .limit(pageItems)
                    .exec(function (err, menus) {
                        if (err) console.log(err);

                        callback(null, menus);
                    })
            }

        ], function (err, results) {
          //  callback2(null, results[0], results[1]);
          var menuResult ={
              count:results[0],
              menus:results[1]
          }
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting menu.',
                    error: err
                })
            }
            return res.json(menuResult);
        })
    },

    /**
     * 查询单个菜单,populate funcList
     */
    show: function (req, res) {
        var id = req.params.id;
        menuModel
            .findOne({ _id: id })
            .populate("funcList")
            .exec(function (err, menuResult) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting menu.',
                        error: err
                    });
                }

                if (!menu) {
                    return res.status(404).json({
                        message: 'No such menu'
                    });
                }

                return res.json(menu);

            })
    },

    /**
     * 创建菜单
     */
    create: function (req, res) {

        var menuInstance = req.body;
        var funcListTemp = [];

        for (var i = 0; i < menuInstance.funcSelection.length; i++) {
            funcListTemp.push(menuInstance.funcSelection[i]._id)
        }

        var menu = new menuModel({
            menuNum:menuInstance.menuNum,
            menuName: menuInstance.menuName,
            funcList: funcListTemp//这是func的objectId的array
        });
        console.log(JSON.stringify(funcListTemp))

        menu.save(function (err, menu) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating menu',
                    error: err
                });
            }
            return res.status(201).json(menu);
        });
    },

    /**
     * 更新菜单
     */
    update: function (req, res) {
        var id = req.params.id;
         
         var funcselection = req.body.funcSelection;
         var funclist =[];
         for(var i=0;i<funcselection.length;i++){
             funclist.push(funcselection[i]._id);
         }


        menuModel.findOne({ _id: id }, function (err, menu) {
            if (err) {
                console.log(err)
                return res.status(500).json({
                    message: 'Error when getting menu',
                    error: err
                });
            }
            if (!menu) {
                return res.status(404).json({
                    message: 'No such menu'
                });
            }
            
             menu.menuNum = req.body.menuNum ?req.body.menuNum:menu.menuNum;
             menu.menuName = req.body.menuName ? req.body.menuName : menu.menuName;
             menu.funcList = funclist ? funclist : menu.funcList;
            

            menu.save(function (err, menu) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating menu.',
                        error: err
                    });
                }

                return res.json(menu);
            });
        });
    },

    /**
     * 删除菜单
     */
    remove: function (req, res) {
        var id = req.params.id;
        menuModel.findByIdAndRemove(id, function (err, menu) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the menu.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    }
};
