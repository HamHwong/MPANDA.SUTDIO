let router = require('koa-router')()
var response = require('../../model/Response')
const { Tasks: TaskService } = require('../../services/tasks')
const TaskModel  = require('../../model/Task')
const { Articles: ArticleService } = require('../../services/articles')
const service = new TaskService()
const articleService = new ArticleService()
/**
 * @swagger
 * /api/v1/tasks/list:
 *   get:
 *     summary: 获取任务列表
 *     description: 获取任务列表
 *     tags:
 *       - Tasks
 *     parameters:
 *       - name: start
 *         in: query
 *         required: true  
 *         type: number
 *         description: 开始List Index
 *       - name: count
 *         in: query
 *         required: true  
 *         type: number
 *         description: 获取数量
 *     responses:
 *       200:
 *         description:
 */
router.get('/tasks/list', async (ctx, next) => {
  var params = ctx.request.body
  var start = params.start
  var count = params.count
  ctx.send(
    new response(
      await service.List({}, start, count, { status: 1, createDate: -1 })
    )
  )
})
router.post('/tasks/complete', async (ctx, next) => {
  try {
    var params = ctx.request.body
    var _id = params._id
    await service.completeTask(_id)
    await articleService.updateTaskInArticle(TaskModel.Convert(await service.Get(_id)))
    ctx.send(new response())
  } catch (e) {
    ctx.send(new response(e.stack))
  }
})
router.post('/tasks/uncomplete', async (ctx, next) => {
  try {
    var params = ctx.request.body
    var _id = params._id
    await service.unCompleteTask(_id)
    await articleService.updateTaskInArticle(TaskModel.Convert(await service.Get(_id)))
    ctx.send(new response())
  } catch (e) {
    ctx.send(new response(e.stack))
  }
})
module.exports = router
