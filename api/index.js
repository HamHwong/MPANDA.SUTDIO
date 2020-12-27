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
  ReadImage,
  ReadImageByID,
  BinarizationImage,
  QueryImage,
  // InitAllStringXML,
  ReadBinarizationImageById,
  InitAllImage
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
  ctx.send(new response(await UploadImage(formdata.file)));
})
router.get('/image/:id', async (ctx, next) => {   
  ctx.send(new response(await ReadImageByID(ctx.params.id)))
  // ctx.send(new response(await ReadBinarizationImageById(ctx.params.id)))
})
router.post('/MapleStory/image/upload', async (ctx, next) => {
  var path = '/Upload_Files/MXD/'
  var formdata = ctx.request.files;
  var fileId = await UploadImage(formdata.file, path);
  ctx.send(new response(fileId));
})
router.post('/MapleStory/image/search',async(ctx,next)=>{
  var formdata = ctx.request.files;
  let results = await QueryImage(formdata)
  ctx.send(new response(results));
})
// router.post('/MapleStory/import',async(ctx,next)=>{ 
//   ctx.send(new response(await InitAllStringXML()));
// })
router.post('/MapleStory/imageBatchimport',async(ctx,next)=>{ 
  ctx.send(new response(await InitAllImage()));
})

module.exports = [
  router
]