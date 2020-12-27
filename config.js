/*
 * @Author: your name
 * @Date: 2020-12-07 10:55:23
 * @LastEditTime: 2020-12-15 15:35:04
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
var port = '8100';
// MongoDB Settings
var mongoDB = {
  // host:'45.77.185.26',
  host:'localhost',
  port:8111,
  username:'admin',
  password:'hh0504hH!'
}
module.exports = { 
  port,
  static,
  mongoDB
}; 