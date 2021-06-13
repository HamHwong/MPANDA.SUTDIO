let router = require('koa-router')()
var response = require('../../model/Response')
const {Tasks:TaskService} = require('../../services/tasks') 
const service = new TaskService()
router.get('/tasks/list', async (ctx, next) => {
  var params = ctx.request.body
  var start = params.start
  var count = params.count  
  ctx.send(new response(await service.List({}, start, count, {status:1,createDate:-1})))
})
router.post('/tasks/complete', async (ctx, next) => {
  var params = ctx.request.body
  var _id = params._id 
  ctx.send(new response(await service.completeTask(_id)))
})
router.post('/tasks/uncomplete', async (ctx, next) => {
  var params = ctx.request.body
  var _id = params._id 
  ctx.send(new response(await service.unCompleteTask(_id)))
})
module.exports = router
