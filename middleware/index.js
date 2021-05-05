/*
 * @Author: your name
 * @Date: 2021-05-03 00:41:57
 * @LastEditTime: 2021-05-04 20:06:03
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \MPANDA.SUTDIO\middleware\index.js
 */
const jsonify = require('./jsonify')
const { XSS } = require('../middleware/XSS')
module.exports = (app) => {
  app.use(jsonify()).use(XSS)
}
