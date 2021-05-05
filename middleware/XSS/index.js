/*
 * @Author: your name
 * @Date: 2021-05-04 19:54:02
 * @LastEditTime: 2021-05-04 21:46:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \MPANDA.SUTDIO\middleware\XSS\index.js
 */
const xss = require('xss')
exports.XSS=async (ctx, next) =>{
  // console.log('======================================================')
  if (ctx.request.body) {
    for (var sign in ctx.request.body) {
      // 判断当前是否有值并且判断是否为参数string类型，以免破坏参数类型
      if (ctx.request.body[sign] && typeof ctx.request.body[sign] == 'string') {
        ctx.request.body[sign] = xss(ctx.request.body[sign]) 
      }
    }
  }
  if (ctx.query) {
    for (var sign in ctx.query) {
      // 判断当前是否有值并且判断是否为参数string类型，以免破坏参数类型
      if (ctx.query[sign] && typeof ctx.query[sign] == 'string') {
        ctx.query[sign] = xss(ctx.query[sign])
      }
    }
  }
  await next()
}
