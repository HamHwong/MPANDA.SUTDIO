/*
 * @Author: your name
 * @Date: 2020-12-21 00:23:45
 * @LastEditTime: 2020-12-21 13:47:58
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /MPANDA.SUTDIO/api/index.js
 */
let {uploadAndDisplayImage} = require('../business/homepage')
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
  //console.log('aaa')
  var formdata = ctx.request.files;
  // var tmpath= file['path'];
  console.log(formdata.file.name)
  uploadAndDisplayImage(formdata.file)
  ctx.send(new response());
})

module.exports = [
  router
]