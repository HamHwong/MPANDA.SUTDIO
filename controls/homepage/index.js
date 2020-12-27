/*
 * @Author: your name
 * @Date: 2020-12-21 13:27:17
 * @LastEditTime: 2020-12-24 14:24:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /MPANDA.SUTDIO/business/homepage/index.js
 */
const fs = require('fs')
const db = require('../../utils/mongodb')
const file = require('../../model/file.records.model')
const imageFile = require('../../model/image.records.model')
const imgUtils = require('../../utils/images')
const fileUtils = require('../../utils/files')
const mathUtils = require('../../utils/math')
const Bagpipe = require('bagpipe') 
const Canvas = require('canvas')
const {
    writeToFile,
    readFilesASBase64
} = require('../../utils/files')
async function ReadImage(formatFile) {
    return new Promise(async (res, rej) => {
        var file = formatFile.file
        let result = null
        result = new imageFile({
            fileId: 'TEMP',
            fileName: file.name,
            suffix: file.name.substring(file.name.indexOf('.') + 1)
        })
        result.base64 = await readFilesASBase64(file.path)
        result = fileUtils.base64ImageFormat(result)
        res(result)
    })
}
async function ReadImageByID(id) {
    return new Promise(async (res, rej) => {
        let result = null
        let records = await db.Query('Attachments', {
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
            result.base64 = await readFilesASBase64(path)
            result = fileUtils.base64ImageFormat(result)
            res(result)
        } else {
            rej(new Error('没找到记录!'))
        }
    })
}
async function ReadBinarizationImageById(id) {
    return new Promise(async (res, rej) => {
        var fileRecord = await ReadImageByID(id);
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
            var originCanvas = Canvas.createCanvas(w, h)
            var originCtx = originCanvas.getContext("2d")
            originCtx.drawImage(img, 0, 0)
            var originData = originCtx.getImageData(0, 0, w, h);
            // 检测二值化后的平均颜色，如果大于200，就反向图片颜色后再读取
            var BinarizationImageData = imgUtils.binarization(data);
            let {
                averageColor,
                pixels
            } = GetImageInfo(BinarizationImageData, w, h);
            // 高亮反转
            if (averageColor.r > 200 && averageColor.g > 200 && averageColor.b > 200) {
                console.log('高亮翻转')
                ctx.drawImage(img, 0, 0)
                data = ctx.getImageData(0, 0, w, h);
                BinarizationImageData = imgUtils.binarization(revertImageColor(data), 255 / 8);
            }
            // console.log(removeBlanks(originData,w,h)) 
            // 根据二值抠图 
            // var DisplayImageData = CutImage(originData, BinarizationImageData) 
            var DisplayImageData = originData
            // 重绘处理后的图片
            await ctx.putImageData(DisplayImageData, 0, 0);
            // 导出Base64
            var result = new imageFile({
                fileName: 'data.png',
                suffix: 'png',
                width: w,
                height: h
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

function removeBlanks(imageData,imgWidth, imgHeight) { 
        data = imageData.data,
        getRBG = function (x, y) {
            return {
                red: data[(imgWidth * y + x) * 4],
                green: data[(imgWidth * y + x) * 4 + 1],
                blue: data[(imgWidth * y + x) * 4 + 2]
            };
        },
        isWhite = function (rgb) {
            return rgb.red == 255 && rgb.green == 255 && rgb.blue == 255;
        },
        scanY = function (fromTop) {
            var offset = fromTop ? 1 : -1;
            // loop through each row
            for (var y = fromTop ? 0 : imgHeight - 1; fromTop ? (y < imgHeight) : (y > -1); y += offset) {
                // loop through each column
                for (var x = 0; x < imgWidth; x++) {
                    if (!isWhite(getRBG(x, y))) {
                        return y;
                    }
                }
            }
            return null; // all image is white
        },
        scanX = function (fromLeft) {
            var offset = fromLeft ? 1 : -1;
            // loop through each column
            for (var x = fromLeft ? 0 : imgWidth - 1; fromLeft ? (x < imgWidth) : (x > -1); x += offset) {
                // loop through each row
                for (var y = 0; y < imgHeight; y++) {
                    if (!isWhite(getRBG(x, y))) {
                        return x;
                    }
                }
            }
            return null; // all image is white
        };

    return{ 
        cropTop : scanY(true),
        cropBottom : scanY(false),
        cropLeft : scanX(true),
        cropRight : scanX(false)
    }
    // cropTop is the last topmost white row. Above this row all is white
    // cropBottom is the last bottommost white row. Below this row all is white
    // cropLeft is the last leftmost white column.
    // cropRight is the last rightmost white column.
}
async function BinarizationImage(file) {
    return new Promise(async (res, rej) => {
        var fileRecord = await ReadImage(file);
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
            var originCanvas = Canvas.createCanvas(w, h)
            var originCtx = originCanvas.getContext("2d")
            originCtx.drawImage(img, 0, 0)
            var originData = originCtx.getImageData(0, 0, w, h);
            // 检测二值化后的平均颜色，如果大于200，就反向图片颜色后再读取
            var BinarizationImageData = imgUtils.binarization(data);
            let {
                averageColor,
                pixels
            } = GetImageInfo(BinarizationImageData, w, h);
            // 高亮反转
            if (averageColor.r > 200 && averageColor.g > 200 && averageColor.b > 200) {
                // console.log('高亮翻转')
                ctx.drawImage(img, 0, 0)
                data = ctx.getImageData(0, 0, w, h);
                BinarizationImageData = imgUtils.binarization(revertImageColor(data), 255 / 8);
            }
            // // 腐蚀二值
            // erosionDIB(BinarizationImageData,w,h,0)
            // //  膨胀二值
            // dilationDIB(BinarizationImageData,w,h,1)
            // 根据二值抠图 
            // var DisplayImageData = CutImage(originData,BinarizationImageData)
            var DisplayImageData = BinarizationImageData
            // 重绘处理后的图片
            await ctx.putImageData(DisplayImageData, 0, 0);
            // 导出Base64
            var result = new imageFile({
                path: file.path,
                suffix: 'png',
                width: w,
                height: h,
            })
            result.fileName = file.name
            result.pixels = pixels
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

function getImageAverageColor(ImageData, w, h) {
    var data = ImageData.data
    let r = 0;
    let b = 0;
    let g = 0;
    // 取所有像素的平均值
    for (var row = 0; row < h; row++) {
        for (var col = 0; col < w; col++) {
            r += data[((w * row) + col) * 4];
            g += data[((w * row) + col) * 4 + 1];
            b += data[((w * row) + col) * 4 + 2];
            // console.log(r,b,g)
        }
    }
    // 求取平均值
    r /= (w * h);
    g /= (w * h);
    b /= (w * h);
    // 将最终的值取整
    r = Math.round(r);
    g = Math.round(g);
    b = Math.round(b);
    return {
        r,
        g,
        b
    };
}

function revertImageColor(ImageData) {
    var data = ImageData.data
    for (var i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i];
        data[i + 1] = 255 - data[i + 1];
        data[i + 2] = 255 - data[i + 2];
    }
    return ImageData;
}

function CutImage(OriginImageData, BinarizationImageData) {
    var originData = OriginImageData.data
    var binarizationData = BinarizationImageData.data
    for (var i = 0; i < originData.length; i += 4) {
        originData[i] = binarizationData[i] | originData[i];
        originData[i + 1] = binarizationData[i + 1] | originData[i + 1];
        originData[i + 2] = binarizationData[i + 2] | originData[i + 2];
        originData[i + 3] = binarizationData[i + 3];
    }
    return OriginImageData
}

function GetImageInfo(ImgData, w, h) {
    return {
        averageColor: getImageAverageColor(ImgData, w, h),
        pixels: mathUtils.CountArr(ImgData.data, w, h)
    }
}

// async function ReadAndFormatXML(path) {
//     let result = await readXMLAsJson(path)
//     return result.imgdir.imgdir.map(item => {
//         return {
//             id: item && item.$.name,
//             name: item && item.string && item.string[0] && item.string[0].$ && item.string[0].$.value,
//             desc: item && item.string && item.string[1] && item.string[1].$ && item.string[1].$.value,
//         }
//     })
// }
module.exports = {
    UploadImage: async function (file, path) {
        let fileRecord = await writeToFile(file, path || '/Upload_Files/', file.name)
        await db.Insert('Attachments', fileRecord)
        let fileId = fileRecord.fileId
        fileRecord = await ReadBinarizationImageById(fileRecord.fileId)
        // console.log('更新')
        await db.Update('Attachments', {
            'fileId': fileId
        }, {
            $set: {
                'pixels': fileRecord.pixels
            }
        }).catch(e => {
            console.log(e)
        })
        // console.log('更新完毕')
        return fileId
    },
    // 获取图片
    ReadImage,
    // 通过ID获取图片
    ReadImageByID,
    // 通过ID获取二值图片
    ReadBinarizationImageById,
    // 上传图片进行二值化
    BinarizationImage,
    QueryImage: async (formdata) => {
        let fileRecord = await BinarizationImage(formdata)
        let QueryPixels = fileRecord.pixels
        console.log('查询像素', fileRecord.pixels)
        let result = await db.Query('Attachments', {
            $and: [{
                    'pixels': {
                        $gte: QueryPixels,
                    }
                },
                {
                    'pixels': {
                        $lte: QueryPixels
                    }
                }
            ]
        })
        return result
    },
    // InitAllStringXML: async () => {
    //     let stringWZPath = 'C:/Users/Administrator/Desktop/export/String.wz/'
    //     let filesPathArr = await fileUtils.findAllXMLFileUnderFolder(stringWZPath)
    //     let arr =  await new Promise((res,rej)=>{
    //         let promiseArr = []
    //         filesPathArr.map(async fileName => {  
    //             promiseArr.push(ReadAndFormatXML(stringWZPath + fileName) )
    //         }) 
    //         Promise.all(promiseArr).then(AllPromise=>{ 
    //             res(AllPromise.reduce((pre,next)=>{
    //                 return pre.concat(next)
    //             },[]))
    //         })
    //     })
    //     db.Insert('ItemsString',arr)
    // }
    async InitAllImage() {
        let arr = []
        var bagpipe = new Bagpipe(100);
        fileUtils.readfiles('C:/Users/Administrator/Desktop/export/Item.wz/', arr, '.icon.')
        var count = arr.length

        async function BIA(path, callback) {
            let ImgPath = path
            let pathArr = ImgPath.split('/')
            let name = pathArr[pathArr.length - 1].split('.')[0] + '.png'
            let result = await BinarizationImage({
                file: {
                    path: ImgPath,
                    name: name,
                    fileId: name
                }
            })
            result.path = ImgPath
            result.fileName = name
            delete result.base64
            callback()
            return await db.Insert('Attachments', result)
        }


        for (var index = 0; index < count; index++) {
            bagpipe.push(BIA, arr[index], () => {
                console.log('搞定！')
            })
        }

        bagpipe.on('full', function (length) {
            console.warn('队列拥堵，目前队列长度为:' + length);
        });
        console.log(arr.length)
    }
}