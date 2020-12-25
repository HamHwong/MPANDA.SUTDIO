/*
 * @Author: your name
 * @Date: 2020-12-23 14:28:22
 * @LastEditTime: 2020-12-24 13:33:48
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /MPANDA.SUTDIO/utils/images/index.js
 */

//二值化
module.exports = {
    binarization: function (imgData) {
        console.log('binarization')
        var index = 255 / 2; //阈值
        for (var i = 0; i < imgData.data.length; i += 4) {
            var R = imgData.data[i];
            var G = imgData.data[i + 1];
            var B = imgData.data[i + 2];
            var sum = (R + G + B) / 3;
            if (sum > index) {
                imgData.data[i] = 255;
                imgData.data[i + 1] = 255;
                imgData.data[i + 2] = 255;
            } else {
                imgData.data[i] = 0;
                imgData.data[i + 1] = 0;
                imgData.data[i + 2] = 0;
            }
        }
        return imgData;
    }
}