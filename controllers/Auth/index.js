let router = require('koa-router')()
const User = require('../../model/User')
var response = require('../../model/Response')
let { AuthService } = require('../../services/auth')
var crypto = require('crypto')
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
  //signature=6a401ffdd33d2f1ce0bf983b9bae3a4a3fe0e312
  //echostr=7174475387871686655
  //timestamp=1620731823
  //nonce=137469566
  // querystring.parse()
  // console.log(ctx.request.query)
  const { signature='', echostr='', timestamp='', nonce='' } = ctx.request.query
  var token = 'mpandastudio'
  console.log(ctx.request.query)
  var arr = [token,timestamp,nonce].sort()
  console.log(arr)
  var tmpStr = arr.join('')
  var sha1 = crypto.createHash('sha1').update(tmpStr).digest('hex');
  console.log(signature, sha1)
  ctx.send(nonce)
})

module.exports = router
