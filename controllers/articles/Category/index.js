let router = require('koa-router')()
const response = require('../../../model/Response')
const Service = require('../../../services/category')
const Model = require('../../../model/Category')
const { isNull } = require('../../../utils/common')
const service = new Service.Category()
router.get('/category/list', async (ctx, next) => {
  ctx.send(new response(await service.List()))
})
router.post('/category/create', async (ctx, next) => {
  var params = ctx.request.body 
  var category = Model.Convert({ cate_name: params.cate_name }) 
  ctx.send(
    new response(
      await service.Create(category, (instance) => {
        if (isNull(instance.cate_name)) throw new Error('类别名不能为空!')
        return true
      })
    )
  )
})
module.exports = router
