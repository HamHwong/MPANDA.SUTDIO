/*
 * @Author: your name
 * @Date: 2021-04-25 22:38:09
 * @LastEditTime: 2021-04-25 22:55:45
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \MPANDA.SUTDIO\controllers\articles\index.js
 */

let router = require('koa-router')()
var response = require('../../model/response.model')
var service = require('../../services/articles')
router.post('/article/create', async (ctx, next) => { 
  ctx.send(new response(await service.Create(ctx.body)));
})
router.post('/article/update/:id', async (ctx, next) => {
  var {
    id
  } = ctx.params
  ctx.send(new response(await service.Update(id)));
})
router.get('/article/search/:keywords', async (ctx, next) => {
  var {
    keywords
  } = ctx.params
  ctx.send(new response(await service.Query(keywords)));
})
router.post('/article/delete/:id', async (ctx, next) => {
  var {
    id
  } = ctx.params
  ctx.send(new response(await service.Delete(id)));
})
module.exports = router