let router = require('koa-router')()
const User = require('../../model/User')
var response = require('../../model/Response')
let { AuthService } = require('../../services/auth')
const { checkAgent, get,callback_wx, callback_wxwork, AGENT } = require('./utils')
const WXLogin = require('./WXLogin')
const WXWorkLogin = require('./WXWorkLogin')
const { isNull } = require('../../utils/common')
const db = require('../../utils/mongodb')
// const APPID = 'wx1945f85c362dd76f'
// const SECRET = '2e16a7fd4243d23f59fe223b7f8f18c0'
const Service = new AuthService();
router.post('/auth/login', async (ctx, next) => {
  var user = User.Convert(ctx.request.body)
  var loginUser = await Service.login(user.account, user.password)
  var result = null
  if (loginUser) {
    result = new response(loginUser)
  } else {
    throw new Error('账号或密码输入错误!')
  }
  ctx.send(result)
})
router.post('/auth/changePassword', async (ctx, next) => {
  var user = User.Convert(ctx.request.body)
  var { newPassword='', repeatNewPassword='' } = ctx.request.body
  console.log('ctx.request.body',newPassword)
  if (isNull(newPassword)) {
    throw new Error('请输入新密码!')
  }
  if (newPassword !== repeatNewPassword) {
    throw new Error('两次输入的新密码不一致!')
  }  
  try{
    var result = await Service.changePassword(user.account,newPassword)
    ctx.send(new response(result))
  }catch(err){ 
    ctx.send(new response().GetError(err.message))
  } 
})

router.get('/oauth2/wechat/oauth2', async (ctx, next) => {
  var agent = ''
  switch (checkAgent(ctx.request.header['user-agent'])) {
    case AGENT.WX:
      agent = '微信登录'
      WXLogin.WXOAuth(ctx)
      break
    case AGENT.WXWORK:
      WXWorkLogin.OAuth(ctx)
      agent = '企业微信登录'
      break
    default:
      // 转到登录页面
      agent = '其他登录'
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
  var settings = await db.Query('Settings', { key: 'wxwork_auth' }) 
  var wxsetting = {}
  if (settings.length > 0) {
    wxsetting = settings[0]
  } else {
    throw new Error('未找到配置项')
  }
  const {  token = 'mpandastudio' } = wxsetting
  var result = await callback_wx(signature, nonce, timestamp, echostr,token)
  ctx.sendPlainText(result)
})
router.get('/oauth2/wxwork/check', async (ctx, next) => { 
  const {
    msg_signature = '', 
    echostr = '',
    timestamp = '',
    nonce = '',
  } = ctx.request.query 
  var settings = await db.Query('Settings', { key: 'wxwork_auth' }) 
  var wxworksetting = {}
  if (settings.length > 0) {
    wxworksetting = settings[0]
  } else {
    throw new Error('未找到配置项')
  }
  const { corpId, token = 'mpandastudio', encodingAesKey } = wxworksetting
  var result = await callback_wxwork(msg_signature, nonce, timestamp,echostr,encodingAesKey,token) 
  ctx.sendPlainText(result)
})
router.get('/oauth2/wechat/getUserInfo', async (ctx, next) => {
  ctx.send(await WXLogin.GetUserInfo(ctx))
})

module.exports = router
