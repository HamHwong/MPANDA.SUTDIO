/*
 * @Author: your name
 * @Date: 2021-04-25 22:38:09
 * @LastEditTime: 2021-05-05 14:53:45
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \MPANDA.SUTDIO\controllers\articles\index.js
 */

let router = require('koa-router')()
var response = require('../../model/response.model')
const Service = require('../../services/articles')
var { plainToClass } = require('class-transformer')
const { Article } = require('../../model/Articles/article')
const { isNull } = require('../../utils/common')
var service = new Service.Article()
router.post('/article/create', async (ctx, next) => {
  var article = plainToClass(Article, ctx.request.body)
  ctx.send(
    new response(
      await service.Create(article, (article) => {
        if (isNull(article.title)) {
          throw new Error('不允许发空标题！')
        }
        if (isNull(article.content)) {
          throw new Error('不允许发空内容！')
        }
      })
    )
  )
})
router.post('/article/update/:id', async (ctx, next) => {
  var { id } = ctx.params

  var article = plainToClass(Article, ctx.request.body)
  ctx.send(new response(await service.Update(id, article)))
})
router.get('/article/search/:keywords', async (ctx, next) => {
  var { keywords } = ctx.params
  ctx.send(new response(await service.Query(keywords)))
})
router.get('/article/get/:id', async (ctx, next) => {
  var { id } = ctx.params
  ctx.send(new response(await service.Get(id)))
})
router.post('/article/list/:cateId?', async (ctx, next) => {
  var params = ctx.request.body
  var start = params.start
  var count = params.count
  var conditions = {}
  var order = params.order
  console.log(ctx.request.body)
  if (ctx.params.cateId) conditions.cateId = ctx.params.cateId
  // if (order) conditions.order = order
  ctx.send(new response(await service.List(conditions, start, count,order)))
})
router.post('/article/delete/:id', async (ctx, next) => {
  var { id } = ctx.params
  ctx.send(new response(await service.Delete(id)))
})
module.exports = router
