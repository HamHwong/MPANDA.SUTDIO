/*
 * @Author: your name
 * @Date: 2020-12-21 13:25:18
 * @LastEditTime: 2020-12-21 17:48:04
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /MPANDA.SUTDIO/utils/files/index.js
 */

let fs = require('fs')
let path = require('path')
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
        let SavingFolderPath = path.resolve(__dirname, '../../' + filepath)
        if (checkExistAndCreateDirIfNotExist(SavingFolderPath)) { 
            let reader = await fs.createReadStream(file.path); 
            let writer = await fs.createWriteStream(SavingFolderPath + '/' + (name || file.name), {
                flags: 'w',
                mode: 0o666,
                autoClose: true,
            })
            reader.pipe(writer) 
        }
    },
    readASBase64: function (fileId) {

    },

}