/*
 * @Author: your name
 * @Date: 2020-12-21 00:23:45
 * @LastEditTime: 2021-05-06 15:59:50
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /MPANDA.SUTDIO/api/index.js
 */ 
const ImageAPIRouter = require('./Images')
const MXDAPIRouter = require('./MXD')
const DMS = require('./DMS')
const Vendor = require('./Vendor')
const Game = require('./Game')
const Article = require('./articles')
const Catrgory = require('./articles/Category')
const Auth = require('./Auth')
const WXWork = require('./WXWork')

module.exports = [
  MXDAPIRouter,
  ImageAPIRouter,
  DMS,
  Vendor,
  Game,
  Article,
  Catrgory,
  Auth,
  WXWork
]