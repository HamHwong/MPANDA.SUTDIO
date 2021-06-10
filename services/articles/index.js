const { IService } = require('../IServices') 
const { Article } = require('../../model/Articles/article')
const { isNull } = require('../../utils/common')
const db = require('../../utils/mongodb')
class Articles extends IService {
  constructor() {
    super('Articles', Article)
  }

  // async Query(keywords) {}

  // async List(condition,start,count,orderCondition) {  
  //   return await db.Query(
  //     this.tableName,
  //     condition,
  //     start,
  //     count,
  //     orderCondition
  //   )
  // }
}
exports.Article = Articles
