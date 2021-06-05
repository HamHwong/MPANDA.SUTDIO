const crypto = require('crypto') 
const { _decode } = require('../../utils/crypto') 
module.exports = { 
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
}
