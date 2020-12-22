/*
 * @Author: your name
 * @Date: 2020-12-21 13:27:17
 * @LastEditTime: 2020-12-22 17:29:51
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
        let fileRecord = await writeToFile(file, '/Upload_Files/', file.name)
        db.Insert('Attachments',fileRecord) 
        return fileRecord.fileId
    },
    ReadImage: async function(id) { 
        let result = null
        let records = await db.Query('Attachments',{fileId:id})
        if(records.length>0){
            const record = records[0]
            const {path} = record  
            result = new file({
                fileId:record.fileId,
                fileName:record.fileName,
                suffix:record.suffix
            })  
            result.base64 = await readFilesASBase64(path)
        }
        return result
    }
}