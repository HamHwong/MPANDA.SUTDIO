const response = require("../../model/Response") 
const { get } = require("../../utils/common")

class WXLogin {
  static APPID = 'wx1945f85c362dd76f'
  static SECRET = '2e16a7fd4243d23f59fe223b7f8f18c0'
  constructor() {
  }
  /**
   * 微信客户端OAuth跳转校验
   *
   * @static
   * @param {*} ctx
   * @memberof WXLogin
   */
  static WXOAuth(ctx) {
    const REDIRECT_URI = encodeURIComponent(
      'https://api.mpanda.studio/api/v1/oauth2/wechat/getUserInfo'
    )
    const SCOPE = 'snsapi_userinfo'
    const STATE = ''
    const path = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${this.APPID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${SCOPE}&state=${STATE}#wechat_redirect`
    ctx.response.redirect(path)
  }
  static async GetUserInfo(ctx){
    const { code: CODE = '', state = '' } = ctx.request.query
    const path = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${this.APPID}&secret=${this.SECRET}&code=${CODE}&grant_type=authorization_code`
    if (CODE) {
      const data = await get(path)
      // console.log('DATA', data)
      const { openid: OPENID = '', access_token: ACCESS_TOKEN = '' } = data
      if (OPENID && ACCESS_TOKEN) {
        const userAPI = `https://api.weixin.qq.com/sns/userinfo?access_token=${ACCESS_TOKEN}&openid=${OPENID}&lang=zh_CN`
        const userData = await get(userAPI)
        return userData
      } else {
        var msg = new response().GetError(data.errmsg, data.errcode)
        return msg
      }
    } else {
      return new response().GetError('Get No Code!', data.errcode)
    }
  }
}
module.exports= WXLogin