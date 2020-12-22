/*
 * @Author: your name
 * @Date: 2020-12-22 16:12:48
 * @LastEditTime: 2020-12-22 16:59:07
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /MPANDA.SUTDIO/model/files.records.model.js
 */
module.exports= class file{
    constructor({fileId,fileName,suffix,path}) {
        this.fileId = fileId
        this.fileName = fileName
        this.suffix = suffix
        this.path = path 
    }
}