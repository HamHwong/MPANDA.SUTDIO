/*
 * @Author: your name
 * @Date: 2020-12-21 00:23:45
 * @LastEditTime: 2021-02-03 13:53:25
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /MPANDA.SUTDIO/api/index.js
 */
let { 
  QueryImage,
  InitAllStringXML, 
  InitAllImage
} = require('../../services/MXD')
let {
  UploadImage 
} = require('../../services/Images')
let router = require('koa-router')()
var response = require('../../model/Response') 
//上传图到MXD专用目录
router.post('/MapleStory/image/upload', async (ctx, next) => {
  var path = '/Upload_Files/MXD/'
  var formdata = ctx.request.files;
  var fileId = await UploadImage(formdata.file, path);
  ctx.send(new response(fileId));
})
// 以图查图
router.post('/MapleStory/image/search',async(ctx,next)=>{
  var formdata = ctx.request.files;
  let results = await QueryImage(formdata)
  ctx.send(new response(results));
})
//导入目录下所有XML，并写入数据库
router.post('/MapleStory/importAllXML',async(ctx,next)=>{ 
  var path = 'C:/Users/Administrator/Desktop/export/String.wz/'
  ctx.send(new response(await InitAllStringXML(path)));
})
// 导入目录（含子目录）下所有图片，并写入数据库
router.post('/MapleStory/imageBatchImport',async(ctx,next)=>{ 
  var path ='C:/Users/Administrator/Desktop/export/Item.wz/'
  var pathIncludingString = '.icon.'
  // var pathIncludingString = '04310001.info.icon.png'
  ctx.send(new response(await InitAllImage(path,pathIncludingString)));
})

module.exports = router