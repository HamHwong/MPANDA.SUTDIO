/*
 * @Author: your name
 * @Date: 2020-12-07 10:55:23
 * @LastEditTime: 2021-05-05 15:51:14
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /MPANDA.SUTDIO/config.js
 */
const static_ = require('koa-static')
const path = require('path')
const static = static_(
  path.join(__dirname, './static')
)
// Server Port Settings
var port = 8100;
var wssPort = 8110;
// MongoDB Settings
var mongoDB = {
  host:'45.77.185.26',
  // host:'localhost',
  dbName:'Mpanda_Studio',
  port:27017,
  username:'admin',
  password:'hh0504hH!',
  MXD:{
    StringCollection:'ItemStrings',
    ImageCollection:'Attachments'
  }
}
module.exports = { 
  port,
  wssPort,
  static,
  mongoDB
}; 