const https = require('https')
var sha1 = require('sha1')
const { strToBase64 } = require('../../utils/common')
const { Encode } = require('../../utils/crypto')
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
  validation_wx(signature, nonce, timestamp, echostr, secret) {
    var signature = signature //微信加密签名
    var nonce = nonce //随机数
    var timestamp = timestamp //时间戳
    var echostr = echostr //随机字符串
    secret = secret || 'mpandastudio'
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
  async validation_wxwork(msg_signature, nonce, timestamp,echostr) {
    //https://api.mpanda.studio/api/v1/oauth2/wechat_work/check 

    var settings = await db.Query('Settings', { key: 'wxwork_auth' })
    var wxworksetting = {}
    if (settings.length > 0) {
      wxworksetting = settings[0]
    } else {
      throw new Error('未找到配置项')
    }

    const { corpId, token='mpandastudio', encodingAesKey } = wxworksetting
    console.log(corpId, token, encodingAesKey )
    var msg_signature = msg_signature //微信加密签名
    var nonce = nonce //随机数
    var timestamp = timestamp //时间戳 
    var msg_encrypt = echostr
    
    var str = [token, timestamp, nonce, msg_encrypt].sort().join('')
    strToBase64(Encode(str))
    var sha = sha1(str)
    console.log('wxwork', sha, msg_signature)
    var msg_encrypt = ''
    if (sha == msg_signature) {
      msg_encrypt = echostr + ''
    } else {
      msg_encrypt = 'err'
    }
    return `<xml>
<Encrypt><![CDATA[${msg_encrypt}]]></Encrypt>
<MsgSignature><![CDATA[${msg_signature}]]></MsgSignature>
<TimeStamp>${timestamp}</TimeStamp>
<Nonce><![CDATA[${nonce}]]></Nonce></xml>`
  },
  AGENT: {
    WX: 'wx',
    WXWORK: 'wxwork',
    OTHER: 'other',
  },
}
