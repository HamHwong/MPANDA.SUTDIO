const CryptoJS = require('crypto-js')
const crypto = require('crypto')
function Encode(message, aseKey = '4c25fa5a') {
  return CryptoJS.AES.encrypt(message, CryptoJS.enc.Utf8.parse(aseKey), {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  }).toString()
}
function Decode(ASEString, aseKey) {
  return CryptoJS.AES.decrypt(ASEString, CryptoJS.enc.Utf8.parse(aseKey), {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  }).toString(CryptoJS.enc.Utf8)
}
function _decode(ASEString, data) {
  let aesKey = Buffer.from(ASEString + '=', 'base64')
  let aesCipher = crypto.createDecipheriv(
    'aes-256-cbc',
    aesKey,
    aesKey.slice(0, 16)
  )
  aesCipher.setAutoPadding(false)
  let decipheredBuff = Buffer.concat([
    aesCipher.update(data, 'base64'),
    aesCipher.final(),
  ])
  decipheredBuff = PKCS7Decoder(decipheredBuff)
  let len_netOrder_corpid = decipheredBuff.slice(16)
  let msg_len = len_netOrder_corpid.slice(0, 4).readUInt32BE(0)
  const result = len_netOrder_corpid.slice(4, msg_len + 4).toString()
  return result // 返回一个解密后的明文-
}
function PKCS7Decoder(buff) {
  var pad = buff[buff.length - 1]
  if (pad < 1 || pad > 32) {
    pad = 0
  }
  return buff.slice(0, buff.length - pad)
}
module.exports = {
  Encode,
  Decode, 
  _decode
}
