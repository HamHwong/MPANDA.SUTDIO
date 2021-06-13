const { IService } = require('../IServices') 
const { Article } = require('../../model/Articles/article')
const {Tasks} = require('../tasks')
console.log('Tasks',Tasks)
const TaskService = new Tasks();
const { isNull } = require('../../utils/common') 
class Articles extends IService {
  constructor() {
    super('Articles', Article)
  }
  async Create (Instance,validation){ 
    const articleID =  await super.Create(Instance,validation) 
    Instance._id = articleID
    await TaskService.createTaskFromArticle(Instance)
    return articleID
  }
  async Update(insertedId, Instance){
    await TaskService.updateTaskFromArticle(Instance)
    await super.Update(insertedId, Instance)
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
module.exports.Articles = Articles
