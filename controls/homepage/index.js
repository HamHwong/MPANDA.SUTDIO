/*
 * @Author: your name
 * @Date: 2020-12-21 13:27:17
 * @LastEditTime: 2020-12-24 14:24:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /MPANDA.SUTDIO/business/homepage/index.js
 */
const db = require('../../utils/mongodb')
const file = require('../../model/file.records.model')
const imageFile = require('../../model/image.records.model')
const imgUtils = require('../../utils/images')
const Canvas = require('canvas')
const {
    writeToFile,
    readFilesASBase64
} = require('../../utils/files')

async function ReadImage(id) { 
    return new Promise(async (res,rej)=>{
        let result = null
        let records = await db.Query('Attachments',{fileId:id})
        if(records.length>0){
            const record = records[0]
            const {path} = record  
            result = new imageFile({
                fileId:record.fileId,
                fileName:record.fileName,
                suffix:record.suffix
            })  
            result.base64 = await readFilesASBase64(path)
            res(result)
        }else{
            rej(new Error('没找到记录!')) 
        }
    }) 
}
module.exports = {
    UploadImage: async function(file,ctx) { 
        let fileRecord = await writeToFile(file, '/Upload_Files/', file.name)
        await db.Insert('Attachments',fileRecord)
        return fileRecord.fileId
    },
    ReadImage,
    ReadBinarizationImage: async function(id){
        return new Promise(async (res,rej)=>{
            console.log('Start Loading')
            var fileRecord = await ReadImage(id); 
            console.log('End Loading') 
            let img = new Canvas.Image()
            var canvas = null
            img.onload=()=>{
                console.log('Drawing')
                var w = img.width
                var h = img.height
                canvas = Canvas.createCanvas(w,h)
                var ctx = canvas.getContext("2d")
                ctx.drawImage(img,0,0)
                let data = canvas.getImageData(0, 0, canvas.width, canvas.height);
                canvas.putImageData(imgUtils.binarization(data),0,0)
                var result = new imageFile({ 
                    fileName:'data.jpg',
                    suffix:'jpg'
                })  
                // result.base64=canvas.toDataURL('image/jpg') 
                res(result)
            }
            img.onerror=(err)=>{ 
                rej(new Error(err))
            }
            img.src = fileRecord.base64
        }) 
    }
}