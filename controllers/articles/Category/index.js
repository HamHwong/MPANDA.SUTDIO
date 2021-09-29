let router = require('koa-router')()
const response = require('../../../model/Response')
const Service = require('../../../services/category')
const Model = require('../../../model/Category')
const { isNull } = require('../../../utils/common')
const service = new Service.Category()

router.get('/category/list', async (ctx, next) => {
  ctx.send(new response(await service.List()))
})

/**
 * @swagger
 * /api/v1/category/create:
 *   post:
 *     summary: 创建分类
 *     description: 创建分类
 *     tags:
 *       - Category
 *     parameters:
 *       - name: params
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties: 
 *             cate_name:
 *               type: string
 *               description: 分类名
 *           
 *     responses:
 *       200:
 *         description: 成功创建, 返回分类ID
 *       500:
 *         description: 类别名不能为空
 */
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
