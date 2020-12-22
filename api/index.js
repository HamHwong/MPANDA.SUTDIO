/*
 * @Author: your name
 * @Date: 2020-12-21 00:23:45
 * @LastEditTime: 2020-12-22 17:26:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /MPANDA.SUTDIO/api/index.js
 */
let {
  UploadImage,
  ReadImage
} = require('../controls/homepage')
let router = require('koa-router')()
var response = require('../model/response.model')
router.get('/a', async (ctx, next) => {
  var result = await ctx.utils.db.Query('mpanda', {
    c: 100
  }); 
  ctx.send(new response(result));
})
router.post('/image/upload', async (ctx, next) => {
  var formdata = ctx.request.files;
  ctx.send(new response(await UploadImage(formdata.file, ctx)));
})
router.get('/image/:id', async (ctx, next) => {  
  ctx.send(new response(await ReadImage(ctx.params.id)))
})

module.exports = [
  router
]