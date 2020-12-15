
var Router = require('koa-router'); 
var routers = require("./api/index")
var mainRouter = new Router(); 

routers.forEach(router => { 
  mainRouter
    .use('/api',router.routes())
})
mainRouter.use('/',ctx=>{
  ctx.body="API CONNECTED.";
})
module.exports = mainRouter