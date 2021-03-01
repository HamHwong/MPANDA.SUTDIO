/*
 * @Author: your name
 * @Date: 2020-12-21 00:23:45
 * @LastEditTime: 2021-03-01 14:30:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /MPANDA.SUTDIO/api/index.js
 */ 
var ImageAPIRouter = require('./Images')
var MXDAPIRouter = require('./MXD')
var DMS = require('./DMS')

module.exports = [
  MXDAPIRouter,
  ImageAPIRouter,
  DMS
]