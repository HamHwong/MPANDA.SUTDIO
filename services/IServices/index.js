/*
 * @Author: your name
 * @Date: 2021-05-04 15:07:20
 * @LastEditTime: 2021-05-04 21:16:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \MPANDA.SUTDIO\services\IServices\index.js
 */
const db = require('../../utils/mongodb')
var { plainToClass } = require('class-transformer')
var mongodb = require('mongodb')
var ObjectID = mongodb.ObjectID
class IService {
  tableName = null
  Class = null
  constructor(tableName,Class) {
    this.tableName = tableName
    this.Class = Class
  }
  async Create(article,validation) { 
    validation&&validation(article)
    article.id = await this.GetNewMaxCount()
    const { insertedId } = await db.Insert(this.tableName, article)
    return insertedId
  }

  async Update(insertedId, article) { 
    return await db.Update(
      this.tableName,
      { _id: ObjectID(insertedId) },
      article
    )
  }

  async Get(insertedId) {
    return await db.Get(this.tableName, insertedId)
  }

  async Query(keywords) {}

  async Delete(insertedId) {
    return await db.Delete(this.tableName, insertedId)
  }
  async List() {}
  async GetCountOfArticle() {}
  async GetCountOfArticle() {
    return db.CountAll(this.tableName)
  }
  async GetNewMaxCount(){ 
    return Number(await db.CountAll(this.tableName))+1
  }
}
exports.IService = IService