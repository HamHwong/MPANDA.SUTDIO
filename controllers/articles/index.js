let router = require('koa-router')()
var response = require('../../model/Response')
const Service = require('../../services/articles')
const CateService = require('../../services/category')
const Article = require('../../model/Articles/article')
const { isNull } = require('../../utils/common')
var service = new Service.Article()
var cateService = new CateService.Category()
router.post('/article/create', async (ctx, next) => {
  var article = Article.Convert(ctx.request.body) 
  if (
    !!article.cate &
    !!article.cate.cate_name &
    !!article.cate._id &
    (article.cate._id === '_CREATE_CATEGORY_')
  ) {
    if (!await cateService.Exist({ cate_name: article.cate.cate_name })) {
      article.cate._id = await cateService.Create({
        cate_name: article.cate.cate_name,
      })
      console.log('_CREATE_CATEGORY_',article)
    }else{
      var result = await cateService.Query({ cate_name: article.cate.cate_name })[0]
      // if(results.length>0){
        // var result = results[0]
        article.cate._id = result._id
        article.cate.cate_name = result.cate_name
      // }
    }
  }
  ctx.send(
    new response(
      await service.Create(article, (article) => {
        if (isNull(article.title)) {
          throw new Error('不允许发空标题！')
        }
        if (isNull(article.content)) {
          throw new Error('不允许发空内容！')
        }
        return true
      })
    )
  )
})
router.post('/article/update/:id', async (ctx, next) => {
  var { id } = ctx.params

  var article = Article.Convert(ctx.request.body)
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
  if (ctx.params.cateId) conditions.cateId = ctx.params.cateId 
  ctx.send(new response(await service.List(conditions, start, count, order)))
})
router.post('/article/delete/:id', async (ctx, next) => {
  var { id } = ctx.params
  ctx.send(new response(await service.Delete(id)))
})

module.exports = router
