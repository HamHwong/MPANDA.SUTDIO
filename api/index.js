/*
 * @Author: your name
 * @Date: 2020-12-07 10:55:23
 * @LastEditTime: 2020-12-21 13:15:59
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /MPANDA.SUTDIO/api/index.js
 */
let router = require('koa-router')()
var response = require('../model/response.model')
router.get('/a',async (ctx,next)=>{   
  // await ctx.utils.db.Insert('mpanda',{c:100,id:1111});
  var result = await ctx.utils.db.Query('mpanda',{c:100}); 
  console.log(result)
// ctx.send()
  ctx.send(new response());
})
router.post('/imageUpload',async (ctx,next)=>{
  console.log('aaa')
  var formdata = ctx.request.files;
  // var tmpath= file['path'];
  console.log(formdata.file.name)
  ctx.send(new response());
})

module.exports = [
  router
]