/*
 * @Author: your name
 * @Date: 2020-12-21 13:25:18
 * @LastEditTime: 2020-12-22 16:58:29
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
                    res(new fileRecord({
                        fileId: UUIDFileName,
                        fileName: FileName,
                        suffix: FileSuffix,
                        path: FullPathOfFiles
                    }))
                })
                await reader.pipe(writer)
            })
        }
        console.log('result', result)
        return result;
    },
    readFilesASBase64: async function (path) {
        let reader = fs.createReadStream(path, {
            encoding: 'base64'
        })
        reader.on('data', (data) => {
            console.log(path, 'data', Buffer.from(data, 'base64').toString());
        });
    },

}