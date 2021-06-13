const { IService } = require('../IServices')
const { Article } = require('../../model/Articles/article')
const { Tasks } = require('../tasks')
// console.log('Tasks',Tasks)
const TaskService = new Tasks()
var mongodb = require('mongodb')
var ObjectID = mongodb.ObjectID
const { isNull } = require('../../utils/common')
class Articles extends IService {
  constructor() {
    super('Articles', Article)
  }
  async Create(Instance, validation) {
    const articleID = await super.Create(Instance, validation)
    Instance._id = articleID
    await TaskService.createTaskFromArticle(Instance)
    return articleID
  }
  async Update(insertedId, Instance) {
    await TaskService.updateTaskFromArticle(Instance)
    await super.Update(insertedId, Instance)
  }
  async updateTaskInArticle(task) {
    const tasks = await TaskService.getTasksByArticle(task.relatedId)
    const updateTasks = tasks.filter((existTask) => {
      return existTask.content === task.content
    })
    if (updateTasks.length > 0) {
      const targetTask = updateTasks[0]
      const Article = await this.Get(ObjectID(targetTask.relatedId))
      if (Article && targetTask.relatedId) {
        return await this.Update(targetTask.relatedId, {
          content: Article.content.replace(
            new RegExp(
              task
                .revertToString()
                .replace('*', '\\*')
                .replace('[', '>%$#>')
                .replace(']', '\\]')
                .replace('>%$#>', '\\['),
              'g'
            ),
            task.toString()
          ),
        })
      }
    }
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
