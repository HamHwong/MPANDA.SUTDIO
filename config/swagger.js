const router = require('koa-router')(); // 引入路由函数
const path = require('path');
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  swaggerDefinition: {
    info: {
      description:
        'This is a sample server Koa2 server.  You can find out more about     Swagger at [http://swagger.io](http://swagger.io) or on [irc.freenode.net, #swagger](http://swagger.io/irc/).      For this sample, you can use the api key `special-key` to test the authorization     filters.',
      version: '1.0.0',
      title: 'Koa2_server Swagger',
      // 开源协议
      license: {
        name: 'Apache 2.0',
        url: 'http://www.apache.org/licenses/LICENSE-2.0.html'
      }
    },
    host: 'localhost:8100',
    basePath: '/', // Base path (optional), host/basePath
    schemes: ['http', 'https'],
  },
  // 写有注解的router的存放地址(当你新增swagger时文档里没显示出来的话那么就是这边地址没有加进去)
  apis: [
    path.join(__dirname, '../controllers/**/**.js'),
    path.join(__dirname, '../model/**/**.js')
],
};
const swaggerSpec = swaggerJSDoc(options);
// 通过路由获取生成的注解文件
router.get('/swagger.json', async ctx => {
  ctx.set('Content-Type', 'application/json');
  ctx.body = swaggerSpec;
});

module.exports = router;
// 将页面暴露出去
