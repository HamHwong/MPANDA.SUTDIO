/*
 * @Author: your name
 * @Date: 2020-12-23 14:28:22
 * @LastEditTime: 2020-12-24 13:33:48
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /MPANDA.SUTDIO/utils/images/index.js
 */
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
function CountSpecificColorPixels(arr,[r=255,g=255,b=255,a=255],exclude=false) {
    var count = 0
    for (var i = 0; i < arr.length; i += 4) {
        if(exclude){
            if (!(arr[i] === r && arr[i + 1] === g && arr[i + 2] === b&& arr[i + 3] === a)) {
                count++
            }
        }else{
            if (arr[i] === r && arr[i + 1] === g && arr[i + 2] === b&& arr[i + 3] === a) {
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
        pixels: CountSpecificColorPixels(ImgData.data,[255,255,255,255],true)
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
module.exports = {
    Binarization,
    RevertImageColor,
    RemoveBlanks,
    GetImageAverageColor,
    GetImageInfo,
    CutImageByBinarizationImage
}