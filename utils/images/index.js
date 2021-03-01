/*
 * @Author: your name
 * @Date: 2020-12-23 14:28:22
 * @LastEditTime: 2021-02-04 17:02:02
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /MPANDA.SUTDIO/utils/images/index.js
 */
const Canvas = require('canvas')
/**
 * 图片颜色反转
 * @param {*} ImageData
 * @return {*} 
 */
function RevertImageColor(ImageData) {
    var data = ImageData.data
    for (var i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i];
        data[i + 1] = 255 - data[i + 1];
        data[i + 2] = 255 - data[i + 2];
    }
    return ImageData;
}
/**
 * 图片二值化 
 * @param {*} imgData
 * @param {*} scale
 * @return {*} 
 */
function Binarization(imgData, scale) {
    var index = scale || 255 / 2; //阈值
    for (var i = 0; i < imgData.data.length; i += 4) {
        var R = imgData.data[i];
        var G = imgData.data[i + 1];
        var B = imgData.data[i + 2];
        // var Alpha = imgData.data[i+3];
        var sum = (R + G + B) / 3;
        if (sum > index) {
            imgData.data[i] = 255;
            imgData.data[i + 1] = 255;
            imgData.data[i + 2] = 255;
            imgData.data[i + 3] = 0;
        } else {
            imgData.data[i] = 0;
            imgData.data[i + 1] = 0;
            imgData.data[i + 2] = 0;
        }

        // if([R,G,B].every(v=>v<256&&v>245)){
        //     imgData.data[i+3] = 0;
        // }

    }
    return imgData;
}
/**
 * 根据二值画图片裁切原图（保留原图对应二值化后图片的黑色部分）
 *
 * @param {*} OriginImageData
 * @param {*} BinarizationImageData
 * @return {*} 
 */
function CutImageByBinarizationImage(OriginImageData, BinarizationImageData) {
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
/**
 * 统计图片中的指定颜色像素个数
 *
 * @param {*} arr
 * @param {*} [r,g,b,a]
 * @param {*} exclude 除了某个指定颜色以外的其余像素个数
 * @return {*} 
 */
function CountSpecificColorPixels(arr, [r = 255, g = 255, b = 255], exclude = true) {
    var count = 0
    for (var i = 0; i < arr.length; i += 4) {
        if (exclude) {
            if (arr[i] !== r && arr[i + 1] !== g && arr[i + 2] !== b && arr[i + 3] !== 0 ) {
                count++
            }
        } else {
            if (arr[i] === r && arr[i + 1] === g && arr[i + 2] === b && arr[i + 3] !== 0 ) {
                count++
            }
        }
    }
    return count
}
/**
 * 获取整个图片颜色的平均值
 * @param {*} ImageData
 * @param {*} w
 * @param {*} h
 * @return {*} 
 */
function GetImageAverageColor(ImageData, w, h) {
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

function GetImageInfo(ImgData, w, h) { 
    return {
        averageColor: GetImageAverageColor(ImgData, w, h),
        pixels: CountSpecificColorPixels(ImgData.data, [255, 255, 255], true)
    }
}

/**
 * 移除空白（未测）
 *
 * @param {*} imageData
 * @param {*} imgWidth
 * @param {*} imgHeight
 * @return {*} 
 */
function RemoveBlanks(imageData, imgWidth, imgHeight) {
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
            // all image is white
            return null;
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
            // all image is white
            return null;
        };
    return {
        cropTop: scanY(true),
        cropBottom: scanY(false),
        cropLeft: scanX(true),
        cropRight: scanX(false)
    }
    // cropTop is the last topmost white row. Above this row all is white
    // cropBottom is the last bottommost white row. Below this row all is white
    // cropLeft is the last leftmost white column.
    // cropRight is the last rightmost white column.
}

// 画边框
async function DrawLine(ImageData, matrix, leftX, rightX, topY, bottomY) {
    var data = ImageData.data;
    DrawHorizontalLine(data, matrix, topY);
    DrawHorizontalLine(data, matrix, bottomY);
    DrawVerticalLine(data, matrix, leftX);
    DrawVerticalLine(data, matrix, rightX);
    return ImageData;
}
// 获取边框信息
async function GetCutInfo(ImageData, matrix, w, h) {
    var data = ImageData.data;
    var CollidedArr = await VerticalLineCollide(ImageData, matrix);
    var leftX = CollidedArr[0] - 1
    var rightX = CollidedArr[CollidedArr.length - 1]
    var topY = HorizontalCollide(data, w, h, "top");
    var bottomY = HorizontalCollide(data, w, h, "bottom");
    return {
        leftX: leftX < 0 ? 0 : leftX,
        rightX: rightX < 0 ? 0 : rightX,
        topY: topY < 0 ? 0 : topY,
        bottomY: bottomY < 0 ? 0 : bottomY
    };
}
// 初始化Matrix
function InitBinaryArr(w, h) {
    var Matrix = [];
    for (var row = 0; row < h; row++) {
        var rowArr = [];
        for (var col = 0; col < w; col++) {
            var index = row * w + col;
            rowArr.push(index);
        }
        Matrix.push(rowArr);
    }
    return Matrix;
}
// 画横线
function DrawHorizontalLine(data, matrix, y) {
    var w = matrix[0].length
    var col = 0;
    while (col < y) {
        col++;
    }
    for (var index = col * w; index < (col + 1) * w; index++) {
        data[index * 4] = 0;
        data[index * 4 + 1] = 0;
        data[index * 4 + 2] = 0;
        data[index * 4 + 3] = 255;
    }
}
// 画竖线
function DrawVerticalLine(data, Matrix, ColIndex) {
    for (var rowIndex = 0; rowIndex < Matrix.length; rowIndex++) {
        var PixelIndex = Matrix[rowIndex][ColIndex];
        data[PixelIndex * 4] = 0;
        data[PixelIndex * 4 + 1] = 0;
        data[PixelIndex * 4 + 2] = 0;
        data[PixelIndex * 4 + 3] = 255;
    }
}
// 框出竖直边框
async function VerticalLineCollide({
    data
}, Matrix, r = 255, g = 255, b = 255) {
    var CollidedArr = []
    for (var X = 0; X < Matrix[0].length; X++) {
        var arr = GetIndexArrOfVertical(Matrix, X)
        var collided = arr.map(index => index * 4).some(i => {
            return data[i] !== r && data[i + 1] !== g && data[i + 2] !== b && data[i + 3] !== 0
        })
        if (collided) {
            CollidedArr.push(X + 1)
        }
    }
    return CollidedArr
}
// 获取位于图片水平方向X像素的垂直数组
function GetIndexArrOfVertical(Matrix, X) {
    var H = Matrix.length
    var arr = []
    for (var rowIndex = 0; rowIndex < H; rowIndex++) {
        // debugger
        arr.push(Matrix[rowIndex][X])
    }
    return arr
}
// 框出水平边距
function HorizontalCollide(data, w, h, from = "top", r = 255, g = 255, b = 255) {
    var enableSearch = true;
    var y = 0;
    var pixelsIndexArr = [];
    if (from.toLowerCase() === "top") {
        while (y < h && enableSearch) {
            // y++;
            for (var index = ++y * w; index < (y + 1) * w; index++) {
                if (data[index * 4] !== r && data[index * 4 + 1] !== g && data[index * 4 + 2] !== b && data[index * 4 + 3] !== 0) {
                    enableSearch = false;
                    pixelsIndexArr.push(index * 4);
                    break;
                }
            }
        }
    } else if (from.toLowerCase() === "bottom") {
        var y = h;
        while (y > 0 && enableSearch) {
            // y--;
            for (var index = --y * w - 1; index > (y - 1) * w; index--) {
                if (data[index * 4] !== r && data[index * 4 + 1] !== g && data[index * 4 + 2] !== b && data[index * 4 + 3] !== 0) {
                    enableSearch = false;
                    pixelsIndexArr.push(index * 4);
                    break;
                }
            }
        }
    }
    return y;
}
async function CutImage(ImageData, leftX, rightX, topY, bottomY) {
    var canvas = await Canvas.createCanvas(ImageData.width, ImageData.height);
    var ctx = await canvas.getContext("2d");
    ctx.putImageData(ImageData, 0, 0)
    var x = leftX - 1 < 0 ? 0 : leftX - 1;
    var y = topY - 1 < 0 ? 0 : topY - 1;
    var w = (rightX - leftX) < 0 ? 0 : rightX - leftX;
    var h = (bottomY - topY) < 0 ? 0 : bottomY - topY; 
    var cropImage = ctx.getImageData(x, y, w, h); 
    return cropImage; 
}
async function ScaleImage(ImageData,MaxWidth,MaxHeight){
    var w = ImageData.width
    var h = ImageData.height
    var canvas = await Canvas.createCanvas(w, h);
    var WidthPercent = MaxWidth/w;
    var HeightPercent = MaxWidth/h;
    var ctx = await canvas.getContext("2d");
    ctx.putImageData(ImageData,0,0) 
    var scalePercent = 0;
    // if(w>=MaxWidth){
    //     // w = MaxWidth
    //     scalePercent = WidthPercent
    // }else{
    //     //h = MaxHeight
    //     scalePercent = HeightPercent
    // }

    scalePercent = WidthPercent>HeightPercent?WidthPercent:HeightPercent
    var canvas2 = await Canvas.createCanvas(w*scalePercent, h*scalePercent);
    var ctx2 = await canvas2.getContext("2d"); 
    ctx2.drawImage(canvas,0,0,ImageData.width,ImageData.height,0,0,w*scalePercent, h*scalePercent)
    var scaleImage = ctx2.getImageData(0, 0, w*scalePercent, h*scalePercent); 
    // console.log(scalePercent)
    // console.log(w*scalePercent, h*scalePercent)
    return scaleImage
}
module.exports = {
    GetCutInfo,
    ScaleImage,
    InitBinaryArr,
    CutImage,
    Binarization,
    RevertImageColor,
    RemoveBlanks,
    GetImageAverageColor,
    GetImageInfo,
    CutImageByBinarizationImage
}