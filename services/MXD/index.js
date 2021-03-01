/*
 * @Author: your name
 * @Date: 2020-12-21 13:27:17
 * @LastEditTime: 2021-02-04 16:55:59
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /MPANDA.SUTDIO/business/homepage/index.js
 */ 
const db = require('../../utils/mongodb')
const fileUtils = require('../../utils/files')
const Bagpipe = require('bagpipe') 
const MIME = require('mime') 
const {BinarizationImage } = require('../Images')
const {mongoDB:{MXD:MXDConfig}} = require('../../config')
async function QueryImage(formdata) {
    let fileRecord = await BinarizationImage(formdata.file)
    let QueryPixels = fileRecord.pixels
    console.log('查询', fileRecord)
    console.log('查询像素', fileRecord.pixels)
    let result = await db.Query(MXDConfig.ImageCollection, {
        $and: [{
                'pixels': {
                    $gte: QueryPixels-150,
                }
            },
            {
                'pixels': {
                    $lte: QueryPixels+150
                }
            }
        ]
    })
    return result
}
/**
 * 初始化目录下所有XML文件，并格式化，写入数据库
 */
async function InitAllStringXML(stringWZPath) { 
    let filesPathArr = await fileUtils.findAllXMLFileUnderFolder(stringWZPath)
    let arr = await new Promise((res, rej) => {
        let promiseArr = []
        filesPathArr.map(async fileName => {
            promiseArr.push(fileUtils.ReadAndFormatXML(stringWZPath + fileName))
        })
        Promise.all(promiseArr).then(AllPromise => {
            res(AllPromise.reduce((pre, next) => {
                return pre.concat(next)
            }, []))
        })
    })
    db.Insert('ItemsString', arr)
}
/**
 * 批量初始化目录下的所有图片，并写入数据库
 */
async function InitAllImage(path,pathIncludingString) {
    let arr = []
    var bagpipe = new Bagpipe(100);
    fileUtils.readAllChildrenFiles(path, arr, pathIncludingString)
    var count = arr.length
    async function BIA(path, callback) {
        let ImgPath = path
        let pathArr = ImgPath.split('/')
        var extension = MIME.getExtension(MIME.getType(ImgPath))
        let name = pathArr[pathArr.length - 1].split('.')[0] + (extension?'.'+extension:'')
        // console.log('name:'+name)
        let result = await BinarizationImage({
            path: ImgPath,
            name: name,
            suffix: '.'+extension
        })
        if(result.width>5 && result.height>5){
            result.path = ImgPath
            result.fileName = name
            delete result.base64
            await db.Insert(MXDConfig.ImageCollection, result)
            console.log('导入图片像素为：'+result.pixels+',宽:'+result.width+',高'+result.height)
            callback(result) 
        }else{ 
            // console.log('图片像素过小,并非装备，遗弃！')
            callback()
        }
    }
    for (var index = 0; index < count; index++) {
        bagpipe.push(BIA, arr[index], (item) => { 
            // console.log(item+'已导入！')
        })
    }
    bagpipe.on('full', function (length) {
        console.warn('队列拥堵，目前队列长度为:' + length);
    });
    console.log('总共导入：'+arr.length+'个文件！')
}
module.exports = { 
    // 以图查图
    QueryImage,
    // 初始化XML文件
    InitAllStringXML,
    // 初始化所有图片
    InitAllImage
}