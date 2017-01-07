var express = require('express');
var router = express.Router();

var funcRouter = require('./func/funcRoutes');
var menuRouter = require('./menu/menuRoutes');
var roleRouter = require('./role/roleRoutes');
var userRouter = require('./user/userRoutes');

//only function router
//sysmanage/function
router.use('/func',funcRouter);

//menu router
//sysmanage/menu
router.use('/menu',menuRouter);

//role router
//sysmanage/role
router.use('/role',roleRouter);

//user router
//sysmanage/user
router.use('/user',userRouter);



