let router = require('koa-router')()
const User = require('../../model/User')
var response = require('../../model/Response')
let { AuthService } = require('../../services/auth')
const https = require('https')
var crypto = require('crypto')
var sha1 = require('sha1')
var querystring = require('querystring')
const request = require('koa/lib/request')

const APPID = 'wx1945f85c362dd76f'
const SECRET = '2e16a7fd4243d23f59fe223b7f8f18c0'

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
  switch (checkAgent(ctx.request.header['user-agent'])) {
    case 'wx':
      console.log('微信登录')
      WXOAuth()
      break
    case 'wxwork':
      console.log('企业微信登录')
      break
    default:
      console.log('其他登录')
      break
  }
})
function WXOAuth() {
  const REDIRECT_URI = encodeURIComponent(
    'https://api.mpanda.studio/api/v1/oauth2/wechat/getUserInfo'
  )
  const SCOPE = 'snsapi_userinfo'
  const STATE = ''
  const path = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${APPID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${SCOPE}&state=${STATE}#wechat_redirect`
  ctx.response.redirect(path)
}
router.get('/oauth2/wechat/check', async (ctx, next) => {
  const {
    signature = '',
    echostr = '',
    timestamp = '',
    nonce = '',
  } = ctx.request.query
  ctx.sendPlainText(sign(signature, nonce, timestamp, echostr))
  //ctx.res.end()
})
function checkAgent(ua = '') {
  let ua = ua.toLowerCase()
  if (
    ua.match(/MicroMessenger/i) == 'micromessenger' &&
    ua.match(/wxwork/i) == 'wxwork'
  ) {
    return 'wxwork'
  } else if (ua.match(/micromessenger/i) == 'micromessenger') {
    return 'wx'
  }
}
router.get('/oauth2/wechat/getUserInfo', async (ctx, next) => {
  const { code: CODE = '', state = '' } = ctx.request.query
  const path = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${APPID}&secret=${SECRET}&code=${CODE}&grant_type=authorization_code`
  if (CODE) {
    const data = await get(path)
    console.log('DATA', data)
    const { openid: OPENID = '', access_token: ACCESS_TOKEN = '' } = data
    if (OPENID && ACCESS_TOKEN) {
      const userAPI = `https://api.weixin.qq.com/sns/userinfo?access_token=${ACCESS_TOKEN}&openid=${OPENID}&lang=zh_CN`
      const userData = await get(userAPI)
      ctx.send(userData)
    } else {
      var msg = new response().GetError(data.errmsg, data.errcode)
      ctx.send(msg)
    }
  } else {
    ctx.send('Get No Code!')
  }
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
  console.log(sha, signature, echostr)
  var result = ''
  if (sha == signature) {
    result = echostr + ''
  } else {
    result = 'err'
  }
  return result
}
async function get(path) {
  return new Promise((resolve, rej) => {
    https
      .get(path, (res) => {
        var rawData = ''
        res.setEncoding('utf8')
        res.on('data', (d) => {
          rawData += d
        })
        res.on('end', () => {
          try {
            const parsedData = JSON.parse(rawData)
            resolve(parsedData)
          } catch (e) {
            console.error(e.message)
            rej(e.message)
          }
        })
      })
      .end()
  })
}
module.exports = router
