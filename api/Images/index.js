/*
 * @Author: your name
 * @Date: 2020-12-21 00:23:45
 * @LastEditTime: 2020-12-24 13:34:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /MPANDA.SUTDIO/api/index.js
 */
let {
  UploadImage, 
  GetImageFileByID,
  BinarizationImage, 
  ReadBinarizationImageById, 
} = require('../../controls/Images')

let router = require('koa-router')()
var response = require('../../model/response.model') 
// 上传图片到固定目录
router.post('/image/upload', async (ctx, next) => {
  var formdata = ctx.request.files;
  ctx.send(new response(await UploadImage(formdata.file)));
}) 
// 通过ID获取该图片
router.get('/image/:id', async (ctx, next) => {   
  ctx.send(new response(await GetImageFileByID(ctx.params.id))) 
})
// 上传图片进行二值化（不保存）
router.post('/image/Binarization', async (ctx, next) => {
  var formdata = ctx.request.files; 
  ctx.send(new response(await BinarizationImage(formdata.file)));
})
// 通过ID获取该图片二值化的图
router.get('/image/Binarization/:id', async (ctx, next) => {   
  ctx.send(new response(await ReadBinarizationImageById(ctx.params.id)))
}) 

module.exports = router