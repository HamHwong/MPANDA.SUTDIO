let router = require('koa-Router')()
var response = require('../model/response.model')
router.get('/a',(ctx,next)=>{ 
  ctx.send(new response());
})
module.exports = [
  router
]