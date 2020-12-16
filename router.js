
var Router = require('koa-router'); 
var routers = require("./api/index")
var mainRouter = new Router({prefix:'/api'}); 

routers.forEach(router => { 
  mainRouter
    .use('/v1',router.routes())
})
mainRouter.use('/',ctx=>{
  ctx.body="API CONNECTED.";
})
module.exports = mainRouter