/*
 * @Author: your name
 * @Date: 2020-12-21 00:23:45
 * @LastEditTime: 2021-04-25 22:47:48
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /MPANDA.SUTDIO/api/index.js
 */ 
var ImageAPIRouter = require('./Images')
var MXDAPIRouter = require('./MXD')
var DMS = require('./DMS')
var Vendor = require('./Vendor')
var Game = require('./Game')
var Article = require('./articles')

module.exports = [
  MXDAPIRouter,
  ImageAPIRouter,
  DMS,
  Vendor,
  Game,
  Article
]