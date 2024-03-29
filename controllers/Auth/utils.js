var sha1 = require('sha1')
module.exports = {
  checkAgent(ua = '') {
    ua = ua.toLowerCase()
    if (
      ua.match(/MicroMessenger/i) == 'micromessenger' &&
      ua.match(/wxwork/i) == 'wxwork'
    ) {
      return 'wxwork'
    } else if (ua.match(/micromessenger/i) == 'micromessenger') {
      return 'wx'
    }
  },
  callback_wx(
    signature = '',
    nonce = '',
    timestamp = '',
    echostr = '',
    secret = ''
  ) {
    var signature = signature //微信加密签名
    var nonce = nonce //随机数
    var timestamp = timestamp //时间戳
    var echostr = echostr //随机字符串
    secret = secret
    /*
        1）将secret、timestamp、nonce三个参数进行字典序排序
        2）将三个参数字符串拼接成一个字符串进行sha1加密
        3）开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
    */
    var str = [secret, timestamp, nonce].sort().join('')
    var sha = sha1(str)
    var result = ''
    if (sha == signature) {
      result = echostr + ''
    } else {
      result = 'err'
    }
    return result
  },
  AGENT: {
    WX: 'wx',
    WXWORK: 'wxwork',
    OTHER: 'other',
  },
}
