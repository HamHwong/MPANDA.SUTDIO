const static_ = require('koa-static')
const path = require('path')
const static = static_(
  path.join(__dirname, './static')
)
// Port Settings
var port = '12345';
module.exports = { 
  port,static
}; 