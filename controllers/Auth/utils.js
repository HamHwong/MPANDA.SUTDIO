const https = require('https')
const crypto = require('crypto')
var sha1 = require('sha1')  
const { _decode } = require('../../utils/crypto')
const db = require('../../utils/mongodb')
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
  callback_wx(signature="", nonce="", timestamp="", echostr="", secret="") {
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
    // console.log(sha, signature, echostr)
    var result = ''
    if (sha == signature) {
      result = echostr + ''
    } else {
      result = 'err'
    }
    return result
  }, 
  callback_wxwork(msg_signature="",nonce="",timestamp="",echostr="",encodingAesKey="",token="") {  
    // 将 token/timestamp/nonce 三个参数进行字典序排序 
    const tmpArr = [token, timestamp, nonce, decodeURIComponent(echostr).trim()]
    
    const md5sum = crypto.createHash('sha1');
    md5sum.update(tmpArr.sort().join(''));
    const tmpStr = md5sum.digest('hex');

    // 验证排序并加密后的字符串与 signature 是否相等
    if (tmpStr === msg_signature) { 
      // 原样返回echostr参数内容
      const result = _decode(encodingAesKey,echostr) 
      return result
    } else { 
      return 'err'
    }
  },
  AGENT: {
    WX: 'wx',
    WXWORK: 'wxwork',
    OTHER: 'other',
  },
}
