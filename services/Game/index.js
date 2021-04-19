/*
 * @Author: your name
 * @Date: 2021-04-13 14:55:49
 * @LastEditTime: 2021-04-19 16:37:33
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /MPANDA.SUTDIO/services/Game/index.js
 */
const path = require('path')
const MIME = require('mime')
const {
  readAllChildrenFiles,
  readFilesASBase64
} = require("../../utils/files");

async function init() {
  return new Promise(async (res, rej) => {
    var assetPath = path.join(__dirname, '../../assets/')
    var arr = []
    readAllChildrenFiles(assetPath, arr, '.png')
    var result = {}
    var proms = arr.map(async function (path) {
      var rawMeta = path.replace(assetPath, '');
      await readFilesASBase64(path).then(data => { 
        var rawArr = rawMeta.split('/')
        var ID = rawArr.splice(0, rawArr.length - 1).join('.') 
        if(!result[ID]) result[ID] = [] 
        result[ID].push("data:" + MIME.getType(path) + ";base64," + data)
      })
      return result
    })
    Promise.all(proms).then(() => {
      res(result)
    })
  })
} 
module.exports = {
  init
}