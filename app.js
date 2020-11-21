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
  .use(router.routes())
  .use(static)
  .listen(port, function () {
    console.log('listen at http://localhost:' + port);
  });

module.exports = app