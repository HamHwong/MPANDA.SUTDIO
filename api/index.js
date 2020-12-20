/*
 * @Author: your name
 * @Date: 2020-12-07 10:55:23
 * @LastEditTime: 2020-12-09 13:25:15
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /MPANDA.SUTDIO/api/index.js
 */
let router = require('koa-Router')()
var response = require('../model/response.model')

router.get('/a',async (ctx,next)=>{   
  // await ctx.utils.db.Insert('mpanda',{c:100,id:1111});
  var result = await ctx.utils.db.Query('mpanda',{c:100}); 
  console.log(result)
// ctx.send()
  ctx.send(new response());
})
router.post('/imageUpload',async (ctx,next)=>{
  var file = ctx.request.body.files.file[0];
  var tmpath= file['path'];
  console.log(tmpath)
  ctx.send(new response());
})

module.exports = [
  router
]