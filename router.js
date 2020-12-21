/*
 * @Author: your name
 * @Date: 2020-12-14 13:53:40
 * @LastEditTime: 2020-12-21 13:07:26
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /MPANDA.SUTDIO/router.js
 */

var Router = require('koa-router'); 
var routers = require("./api/index")
var mainRouter = new Router(
  {prefix:'/api'}
); 

routers.forEach(async router => { 
  mainRouter
    .use('/v1',router.routes())
})

mainRouter
  .post('/auth',async ctx=>{
    const {username} =  ctx.request.body
    ctx.body = username
  })
mainRouter
  .get('',ctx=>{
    ctx.body="API CONNECTED.";
})
module.exports = mainRouter