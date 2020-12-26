/*
 * @Author: your name
 * @Date: 2020-12-21 13:25:18
 * @LastEditTime: 2020-12-24 14:18:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /MPANDA.SUTDIO/utils/files/index.js
 */

const fs = require('fs')
const path = require('path')
const uuid = require('uuid');
const fileRecord = require('../../model/file.records.model')

async function checkExistAndCreateDirIfNotExist(path) {
    let result = true;
    if (!fs.existsSync(path)) {
        console.log(path + ' 目录不存在,创建中...')
        await fs.mkdirSync(path, {
            recursive: true
        }, err => {
            result = false
            console.log('创建失败!' + err)
            throw new Error('创建失败!' + err)
        })
        console.log('目录创建成功...')
    }
    return result
}
module.exports = {
    writeToFile: async function (file, filepath, name) {
        let result = null;
        let SavingFolderPath = path.resolve(__dirname, '../../' + filepath)
        let FileName = (name || file.name);
        let UUIDFileName = uuid.v1();
        let FileSuffix = FileName.indexOf('.') > 0 ? FileName.substring(FileName.indexOf('.') + 1) : '';
        let FullPathOfFiles = SavingFolderPath + '/' + UUIDFileName + (FileSuffix ? '.' + FileSuffix : '');

        if (await checkExistAndCreateDirIfNotExist(SavingFolderPath)) {
            result = await new Promise(async (res, rej) => {
                let reader = await fs.createReadStream(file.path);
                let writer = await fs.createWriteStream(FullPathOfFiles, {
                    flags: 'w',
                    mode: 0o666,
                    autoClose: true,
                }).on('finish', async () => {
                    console.log('保存完')
                    var file = new fileRecord({
                        fileId: UUIDFileName,
                        fileName: FileName,
                        suffix: FileSuffix,
                        path: FullPathOfFiles
                    })
                    res(file)
                })
                await reader.pipe(writer)
            })
        }
        return result;
    },
    readFilesASBase64: async function (path) {
        return new Promise((res, rej) => {
            console.log('读取中成base64。。。')
            let buffer = []
            let reader = fs.createReadStream(path, {
                encoding: 'base64',
                highWaterMark: 1
            })
            reader.on('data', (data) => {
                buffer.push(data)
            });
            reader.on('end', (e) => {
                res(buffer.join(''))
                console.log('读取成base64完。。。')
            })
            reader.on('error', function (err) {
                rej(new Error(err))
            })
        })
    },
    base64ImageFormat: function (file) {
        switch (file.suffix) {
            case "png":
                file.base64 = "data:image/png;base64," + file.base64;
                break;
            case "jpg":
            case "jpeg":
                file.base64 = "data:image/jpeg;base64," + file.base64;
                break;
            case "gif":
                file.base64 = "data:image/gif;base64," + file.base64;
                break;
            default:
                throw new Error('不能识别该图片！')
        }
        return file
    }

}