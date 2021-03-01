/*
 * @Author: your name
 * @Date: 2020-12-21 13:27:17
 * @LastEditTime: 2021-02-04 16:40:20
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /MPANDA.SUTDIO/business/homepage/index.js
 */ 
const db = require('../../utils/mongodb') 
const imageFile = require('../../model/image.records.model')
const imgUtils = require('../../utils/images')
const fileUtils = require('../../utils/files')
const Bagpipe = require('bagpipe')
const Canvas = require('canvas')
const MIME = require('mime')
const {mongoDB:{MXD:MXDConfig}} = require('../../config')
/**
 * 将上传的文件转换为Base64格式（默认带头）
 *
 * @param {FormData} formatFile
 * @param {Boolean} ifWithHeader
 * @return {imageFile} 
 */
async function ConvertFileToBase64(file,ifWithHeader=true) {
    return new Promise(async (res, rej) => { 
        let result = null  
        result = new imageFile({
            fileId: 'TEMP',
            fileName: file.name,
            suffix: file.name.substring(file.name.indexOf('.') + 1)
        })
        result.base64 = await fileUtils.readFilesASBase64(file.path)
        if(ifWithHeader){
            result = fileUtils.base64ImageFormat(result)
        }
        res(result)
    })
}
/**
 * 根据FileID读取图片
 *
 * @param {String} id
 * @return {imageFile} 
 */
async function GetImageFileByID(id) {
    return new Promise(async (res, rej) => {
        let result = null
        let records = await db.Query(MXDConfig.ImageCollection, {
            fileId: id
        })
        if (records.length > 0) {
            const record = records[0]
            const {
                path
            } = record
            result = new imageFile({
                fileId: record.fileId,
                fileName: record.fileName,
                suffix: record.suffix
            })
            result.base64 = await fileUtils.readFilesASBase64(path)
            result = fileUtils.base64ImageFormat(result)
            res(result)
        } else {
            rej(new Error('没找到记录!'))
        }
    })
}
/**
 * 根据ID读取图片，并将图片转换为二值化图片
 *
 * @param {String} id
 * @return {*} 
 */
async function ReadBinarizationImageById(id) {
    var fileRecord = await GetImageFileByID(id);
    return LoadBinarizationImage(fileRecord)
}
async function LoadBinarizationImage(fileRecord){
    return new Promise(async (res, rej) => { 
        let img = new Canvas.Image()
        var canvas = null
        img.onload = async () => {
            var w = img.width
            var h = img.height
            // 读图
            canvas = Canvas.createCanvas(w, h)
            var ctx = canvas.getContext("2d")
            ctx.drawImage(img, 0, 0)
            let data = ctx.getImageData(0, 0, w, h);
            // 抠图前备份原图
            // var originCanvas = Canvas.createCanvas(w, h)
            // var originCtx = originCanvas.getContext("2d")
            // originCtx.drawImage(img, 0, 0)
            // var originData = originCtx.getImageData(0, 0, w, h);
            // 检测二值化后的平均颜色，如果大于200，就反向图片颜色后再读取
            var BinarizationImageData = imgUtils.Binarization(data);
            const {leftX, rightX, topY, bottomY} = await imgUtils.GetCutInfo(BinarizationImageData,imgUtils.InitBinaryArr(w,h),w,h)
            BinarizationImageData= await imgUtils.CutImage(BinarizationImageData,leftX, rightX, topY, bottomY)
            BinarizationImageData= await imgUtils.ScaleImage(BinarizationImageData,50,50)
            // console.log(BinarizationImageData.data.filter(i=>i))
            w = rightX - leftX
            h = bottomY - topY
            let {
                averageColor,
                pixels
            } = imgUtils.GetImageInfo(BinarizationImageData, BinarizationImageData.width, BinarizationImageData.height); 
            // console.log({leftX, rightX, topY, bottomY},pixels)
            // // 高亮反转
            if (averageColor.r > 200 && averageColor.g > 200 && averageColor.b > 200) {
                ctx.drawImage(img, 0, 0)
                data = ctx.getImageData(0, 0, BinarizationImageData.width, BinarizationImageData.height);
                BinarizationImageData = imgUtils.Binarization(imgUtils.RevertImageColor(data), 255 / 8);
            }
            // 根据二值抠图 
            // var DisplayImageData = imgUtils.CutImageByBinarizationImage(originData, BinarizationImageData) 
            var DisplayImageData = BinarizationImageData
            canvas.width = DisplayImageData.width
            canvas.height = DisplayImageData.height
            // 重绘处理后的图片
            await ctx.putImageData(DisplayImageData, 0, 0);
            // 导出Base64
            var result = new imageFile({
                fileName: 'data.png',
                suffix: 'png',
                width: DisplayImageData.width,
                height: DisplayImageData.height
            })
            result.pixels = pixels;
            result.base64 = canvas.toDataURL('image/png')
            // result.ImageInfo = ImageInfo
            res(result)
        }
        img.onerror = (err) => {
            rej(new Error(err))
        }
        img.src = fileRecord.base64
    })
}
/**
 * 获取二值化图片
 *
 * @param {*} file
 * @return {*} 
 */
async function BinarizationImage(file) {
    var fileRecord = await ConvertFileToBase64(file);
    return LoadBinarizationImage(fileRecord)
}
/**
 * 上传图片到指定位置，并且写入数据库
 *
 * @param {*} file
 * @param {*} path
 * @return {*} 
 */
async function UploadImage(file, path) {
    let fileRecord = await fileUtils.writeToFile(file, path || '/Upload_Files/', file.name)
    await db.Insert(MXDConfig.ImageCollection, fileRecord)
    let fileId = fileRecord.fileId
    fileRecord = await ReadBinarizationImageById(fileRecord.fileId)
    await db.Update(MXDConfig.ImageCollection, {
        'fileId': fileId
    }, {
        $set: {
            'pixels': fileRecord.pixels
        }
    }).catch(e => {
        console.log(e)
    })
    return fileId
}
 
module.exports = {
    // 上传图片
    UploadImage,
    // 获取图片
    ConvertFileToBase64,
    // 通过ID获取图片
    GetImageFileByID,
    // 通过ID获取二值图片
    ReadBinarizationImageById,
    // 上传图片进行二值化
    BinarizationImage, 
}