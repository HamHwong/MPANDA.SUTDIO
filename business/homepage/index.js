/*
 * @Author: your name
 * @Date: 2020-12-21 13:27:17
 * @LastEditTime: 2020-12-21 15:17:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /MPANDA.SUTDIO/business/homepage/index.js
 */
let {
    writeToFile
} = require('../../utils/files')
module.exports = {
    uploadAndDisplayImage: function uploadAndDisplayImage(file) { 
        writeToFile(file, '/Upload_Files/', file.name) 
        return ''
    }
}