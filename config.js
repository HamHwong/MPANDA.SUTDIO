/*
 * @Author: your name
 * @Date: 2020-12-07 10:55:23
 * @LastEditTime: 2020-12-09 13:07:09
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
var port = '12345';
// MongoDB Settings
var mongoDB = {
  host:'45.77.185.26',
  port:8111,
  username:'admin',
  password:'hh0504hH!'
}
module.exports = { 
  port,
  static,
  mongoDB
}; 