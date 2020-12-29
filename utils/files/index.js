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
const MIME = require('mime')
/**
 * 检查并且创建目录 
 * @param {String} path
 * @return {Boolean} 
 */
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
/**
 * 读文件夹（包括子文件夹）下所有文件的绝对位置
 * @param {*} dir 文件夹
 * @param {Array} list 保存用数组
 * @param {String} query （可选）绝对地址字符串包含的字符
 * @out {Array} 即List
 */
function readAllChildrenFiles(dir, list, query) { 
    const arr = fs.readdirSync(dir)
    arr.forEach(item => {
        const itemPath = dir + item
        const isDir = fs.statSync(itemPath).isDirectory()
        if (isDir) {
            const temp = dir + item + '/'
            readAllChildrenFiles(temp, list, query)
        } else {
            if (itemPath.indexOf(query) > 0) {
                list.push(itemPath)
            }
        }
    })
}
/**
 * 写文件，并生成FileRecord
 * @param {File} file 
 * @param {String} filepath 相对项目的目标目录
 * @param {String} name 文件名（包含后缀）
 * @return {fileRecord} 
 */
async function writeToFile (file, filepath, name) {
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
}
/**
 * 从目标位置读文件
 * @param {*} filePath
 * @return {*} 
 */
async function readFromFile (filePath) {
    return await fs.readFileSync(filePath);
}
/**
 * 以流的方式从目标位置读文件并且读成Base64
 * @param {*} path
 * @return {*} 
 */
async function readFilesASBase64(path) {
    return new Promise((res, rej) => {
        // console.log('读取中成base64。。。')
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
            // console.log('读取成base64完。。。')
        })
        reader.on('error', function (err) {
            rej(new Error(err))
        })
    })
}
/**
 * 将从数据库读取的文件Base64添加上读取头
 * @param {ImageRecord} file
 * @return {ImageRecord} 
 */
function base64ImageFormat (file) {
    file.base64 = "data:"+MIME.getType(file.fileName)+";base64," + file.base64;
    return file
}
/**
 * 找到目录下的所有XML文件（不包含子目录） *
 * @param {*} path
 * @return {*} 
 */
async function  findAllXMLFileUnderFolder(path) {
    return new Promise((res, rej) => {
        fs.readdir(path, (err, files) => { 
            res(files)
        })
    })
}
/**
 * 读取指定XML，并将其格式化为JSON
 * @param {*} path
 * @return {*} 
 */
async function ReadAndFormatXML(path) {
    let result = await readXMLAsJson(path)
    return result.imgdir.imgdir.map(item => {
        return {
            id: item && item.$.name,
            name: item && item.string && item.string[0] && item.string[0].$ && item.string[0].$.value,
            desc: item && item.string && item.string[1] && item.string[1].$ && item.string[1].$.value,
        }
    })
}
module.exports = {
    writeToFile,
    readFromFile,
    readFilesASBase64,
    base64ImageFormat,
    readAllChildrenFiles,
    findAllXMLFileUnderFolder,
    ReadAndFormatXML
}