const CryptoJS = require('crypto-js')
function Encode(message,aseKey='4c25fa5a') { 
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
module.exports = {
  Encode,
  Decode,
}
