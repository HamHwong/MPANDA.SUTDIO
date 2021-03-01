/*
 * @Author: your name
 * @Date: 2020-12-14 13:53:40
 * @LastEditTime: 2021-03-01 14:28:09
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

var cors = require('koa2-cors');

const bodyParser = require('koa-bodyparser');
const koaBody = require('koa-body');

const {
  port,
  static
} = config

app.use(async (ctx, next) => {
  // console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
  await next();
});
// 文件上传，注意书写的位置很重要，否则无法上传
app.use(koaBody({
  multipart: true
}));
// 解析请求体
app.use(bodyParser()); 
// Mount MiddleWare
middleware(app)
// Mount Utils
utils(app)
// CORS
app.use(cors());
// Setup Main App
app
  .use(router.routes())
  .use(static)
  .listen(port,function () {
    console.log('listen at http://localhost:' + port);
  });

module.exports = app