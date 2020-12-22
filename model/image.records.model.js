/*
 * @Author: your name
 * @Date: 2020-12-22 16:08:59
 * @LastEditTime: 2020-12-22 16:59:37
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /MPANDA.SUTDIO/model/image.records.model.js
 */
const files = require('./files.records.model')
module.exports= class image extends files{
    constructor({width,height,fileId,suffix,path}){
        super({fileId,suffix,path})
        this.width = width
        this.height = height
    } 
    scale(rate){
        this.width*=rate
        this.height*=rate
    }
}