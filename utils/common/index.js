/*
 * @Author: your name
 * @Date: 2021-05-04 20:18:35
 * @LastEditTime: 2021-05-04 20:19:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \MPANDA.SUTDIO\utils\common\index.js
 */
function isNull(data) {
  return data == '' || data == undefined || data == null 
}
function strToBase64(str){
  return atob(encodeURI(str));
}
function base64ToStr(str){
  return btoa(encodeURI(str));
}
module.exports ={
  isNull,
  strToBase64,
  base64ToStr
}