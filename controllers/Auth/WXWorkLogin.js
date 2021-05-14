class WXWorkLogin {
  constructor() {}
  static OAuth() {
    //企业的CorpID
    const CORPID = ''
    //授权后重定向的回调链接地址，请使用urlencode对链接进行处理
    const REDIRECT_URI = ''
    //应用授权作用域。
    const SCOPE = 'snsapi_privateinfo'
    //企业应用的id
    const AGENTID = ''
    //额外参数
    const STATE = ''
    var path = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${CORPID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${SCOPE}&agentid=${AGENTID}&state=${STATE}#wechat_redirect`
  }
}
module.exports = WXWorkLogin