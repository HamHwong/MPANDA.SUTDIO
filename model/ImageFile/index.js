/*
 * @Author: your name
 * @Date: 2020-12-22 16:08:59
 * @LastEditTime: 2021-05-06 16:13:17
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /MPANDA.SUTDIO/model/ImageFile.js
 */
const files = require('../File')
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