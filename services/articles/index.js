/*
 * @Author: your name
 * @Date: 2021-04-25 22:36:02
 * @LastEditTime: 2021-05-04 21:56:14
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \MPANDA.SUTDIO\services\articles\index.js
 */
// const { Article } = require('../../model/Articles/article')
const { IService } = require('../IServices') 
const { Article } = require('../../model/Articles/article')
const { isNull } = require('../../utils/common')
const db = require('../../utils/mongodb')
class Articles extends IService {
  constructor() {
    super('Articles', Article)
  }

  // async Query(keywords) {}

  async List(condition,start,count,orderCondition) {  
    return await db.Query(
      this.tableName,
      condition,
      start,
      count,
      orderCondition
    )
  }
}
exports.Article = Articles
