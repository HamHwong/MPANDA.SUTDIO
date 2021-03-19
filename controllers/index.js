/*
 * @Author: your name
 * @Date: 2020-12-21 00:23:45
 * @LastEditTime: 2021-03-19 11:24:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /MPANDA.SUTDIO/api/index.js
 */ 
var ImageAPIRouter = require('./Images')
var MXDAPIRouter = require('./MXD')
var DMS = require('./DMS')
var Vendor = require('./Vendor')

module.exports = [
  MXDAPIRouter,
  ImageAPIRouter,
  DMS,
  Vendor
]