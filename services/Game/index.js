/*
 * @Author: your name
 * @Date: 2021-04-13 14:55:49
 * @LastEditTime: 2021-04-13 17:07:41
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
        // generateFileTree(rawMeta.split('/'), result, "data:"+MIME.getType(path)+";base64,"+data) 
        var rawArr = rawMeta.split('/')
        var ID = rawArr.splice(0, rawArr.length - 1).join('.')
        // console.log(rawMeta)
        // result[ID] = ID
        if(!result[ID]) result[ID] = []
        // if (!result[ID].Sprints) result[ID].Sprints = []
        result[ID].push("data:" + MIME.getType(path) + ";base64," + data)
      })
      return result
    })
    Promise.all(proms).then(() => {
      res(result)
    })
  })
}

//  function generateFileTree(Arr, Node, Base64) {
//    if (Arr.length <= 1) { 
//     Node.base64 = Base64 
//    } else {
//      var currentPath = Arr.shift()
//      if (!Node[currentPath]) Node[currentPath] = {}
//      generateFileTree(Arr, Node[currentPath], Base64)
//    }
//  }
module.exports = {
  init
}