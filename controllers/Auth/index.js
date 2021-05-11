let router = require('koa-router')()
const User = require('../../model/User')
var response = require('../../model/Response')
let { AuthService } = require('../../services/auth')
var crypto = require('crypto')
var sha1 = require('sha1')
var querystring = require('querystring')
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
  //ctx.send(new response(`result`) )
  const APPID = 'wx1945f85c362dd76f'
  const REDIRECT_URI = 'mpanda.studio'
  const path = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${APPID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=SCOPE&state=STATE#wechat_redirect`
  ctx.response.redirect(path)
})
router.get('/oauth2/wechat/check', async (ctx, next) => { 
  const {
    signature = '',
    echostr = '',
    timestamp = '',
    nonce = '',
  } = ctx.request.query 
  ctx.send(sign(signature,
    nonce,
    timestamp,
    echostr
    ) )
})
function sign(signature, nonce, timestamp, echostr) {
  var signature = signature //微信加密签名
  var nonce = nonce //随机数
  var timestamp = timestamp //时间戳
  var echostr = echostr //随机字符串
  var token = 'mpandastudio'
  /*
    1）将token、timestamp、nonce三个参数进行字典序排序
        2）将三个参数字符串拼接成一个字符串进行sha1加密
        3）开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
    */
  var str = [token, timestamp, nonce].sort().join('')
  var sha = sha1(str)
  console.log(sha,signature,echostr)
  if (sha == signature) {
    return echostr
  } else {
    return 'err'
  }
}
module.exports = router
