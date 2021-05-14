let router = require('koa-router')()
const User = require('../../model/User')
var response = require('../../model/Response')
let { AuthService } = require('../../services/auth')
const { checkAgent, get, sign ,AGENT} = require('./utils')
const WXLogin = require('./WXLogin') 
const WXWorkLogin = require('./WXWorkLogin')
// const APPID = 'wx1945f85c362dd76f'
// const SECRET = '2e16a7fd4243d23f59fe223b7f8f18c0' 

router.post('/auth/login', async (ctx, next) => {
  var user = User.Convert(ctx.request.body)
  var loginUser = await AuthService.login(user.account, user.password)
  var result = null
  if (loginUser) {
    result = new response(loginUser)
  } else {
    throw new Error('验证失败')
  }
  ctx.send(result)
})
router.get('/oauth2/wechat/oauth2', async (ctx, next) => {
  var agent = ''
  switch (checkAgent(ctx.request.header['user-agent'])) {
    case AGENT.WX:
      agent ='微信登录'
      WXLogin.WXOAuth(ctx)
      break
    case AGENT.WXWORK:
      WXWorkLogin.OAuth(ctx)
      agent ='企业微信登录'
      break
    default:
      // 转到登录页面
      agent='其他登录'
      break
  }
  ctx.send(agent)
})
/** 
 * 校验接口配置信息
**/
router.get('/oauth2/wechat/check', async (ctx, next) => {
  const {
    signature = '',
    echostr = '',
    timestamp = '',
    nonce = '',
  } = ctx.request.query
  ctx.sendPlainText(sign(signature, nonce, timestamp, echostr))
})

router.get('/oauth2/wechat/getUserInfo', async (ctx, next) => {
  ctx.send(await WXLogin.GetUserInfo(ctx))
})

module.exports = router
