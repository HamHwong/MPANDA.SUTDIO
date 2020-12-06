let router = require('koa-Router')()
var response = require('../model/response.model')
router.get('/a',async (ctx,next)=>{  
  
  await ctx.utils.db.Insert('mpanda',{c:100,id:1111});
  var result = await ctx.utils.db.Query('mpanda',{c:100});
  
  console.log(result)
// ctx.send()
  ctx.send(new response());
})
module.exports = [
  router
]