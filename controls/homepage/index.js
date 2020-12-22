/*
 * @Author: your name
 * @Date: 2020-12-21 13:27:17
 * @LastEditTime: 2020-12-22 17:02:45
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /MPANDA.SUTDIO/business/homepage/index.js
 */
const db = require('../../utils/mongodb')
const file = require('../../model/file.records.model')
const {
    writeToFile,
    readFilesASBase64
} = require('../../utils/files')
module.exports = {
    UploadImage: async function(file,ctx) { 
        let fileRecord = await writeToFile(file, '/Upload_Files/', file.name) ;
        // db.Insert() 
        db.Insert('Attachments',fileRecord)
        let record = await db.Query('Attachments',{fileId:fileRecord.fileId})
        console.log('record',record)
        return fileRecord.fileId
    },
    // ReadImage: async function(id) {
    //     return readFilesASBase64()
    // }
}