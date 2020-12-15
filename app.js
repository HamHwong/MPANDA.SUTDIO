/*
 * @Author: your name
 * @Date: 2020-12-14 13:53:40
 * @LastEditTime: 2020-12-15 16:07:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /MPANDA.SUTDIO/app.js
 */
const Koa = require("koa");
const app = new Koa();
const config = require("./config")
const router = require("./router")
const middleware = require("./middleware");
const utils = require("./utils");
const {
  port,
  static
} = config
// Mount MiddleWare
middleware(app)
// Mount Utils
utils(app)
// Setup Main App
app
  // .use(router.routes())
  .use(static)
  .use(ctx=>{
    ctx.body="test";
  })
  .listen(port,'0.0.0.0', function () {
    console.log('listen at http://localhost:' + port);
  });

module.exports = app