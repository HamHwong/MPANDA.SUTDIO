const https = require('https')
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
  async get(path) {
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
  },
  sign(signature, nonce, timestamp, echostr) {
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
  },
  AGENT:{
    WX:'wx',
    WXWORK:'wxwork',
    OTHER:'other'
  }
}
