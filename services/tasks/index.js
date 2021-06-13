const { IService } = require('../IServices')
const { Task } = require('../../model/Task')
const { isNull } = require('../../utils/common')
const TaskModel = require('../../model/Task')
const enums = require('../../model/Task/enums') 
const logger = require('../../utils/log4js')  
var mongodb = require('mongodb')
var ObjectID = mongodb.ObjectID
class Tasks extends IService {
  constructor() {
    super('Tasks', Task)
  }
  async createTaskFromArticle(Article) {
    const tasks = await this.getTasksFromArticle(Article)
    if (tasks.length > 0) {
      tasks.map(async (newTask) => {
        await this.Create(newTask)
      })
    }
  }
  async updateTaskFromArticle(Article) {
    // 文章中的任务
    const tasks = await this.getTasksFromArticle(Article)
    // 已生成的任务
    const existedTasks = await this.getTasksByArticle(Article._id) 
    // 生成新任务
    const newTasks = tasks.filter(task=>!existedTasks.find(existTask=>existTask.content.trim()===task.content.trim()))
    const oldTasks = tasks.filter(task=>existedTasks.find(existTask=>existTask.content.trim()===task.content.trim()))
    // console.log('existedTasks',existedTasks)
    // console.log('newTasks',newTasks)
    // console.log('oldTasks',oldTasks)
    newTasks.map(async newTask=>{
      await this.Create(newTask)
    })
    // 更新老任务 
    oldTasks.filter(async oldTask=>{
      // existedTasks 包含_id
      var task = existedTasks.filter(existedTask=>[
        existedTask.content.trim()===oldTask.content.trim()
      ])
      if(task.length>0){
        await this.Update(task[0]._id,{status:oldTask.status})
      }
    })
    // 对于从内容中被删除的老的任务，不做更新 
  } 
  async getTasksByArticle(_id){ 
    const tasks = await this.List({relatedId:_id}) 
    return tasks.map(i=>TaskModel.Convert(i))
  }
  async getTasksFromArticle(Article) { 
    if (!isNull(Article)) {
      var result = []
      var regex = /(\* \[(x| )?\] *.+)/gi
      var tasks = Article.content.match(regex) 
      if (tasks.length > 0) {
        tasks.map(async (taskString) => {
          var taskArr = taskString.split(' ')
          var newTask = TaskModel.Convert({
            relatedId: Article._id,
            content: taskArr[taskArr.length - 1],
            status: taskArr.filter((i) => i.toLowerCase() === '[x]').length > 0,
          })
          result.push(newTask)
        })
      }
      return result
    } else {
      throw new Error('未找到该文章！')
    }
  }
  async completeTask(_id) {
    var task = await this.Get(_id)
    if (!isNull(task)) {
      try {
        await this.Update(_id, { status: enums.COMPLETED })
        return true
      } catch (e) {
        logger.info(e.stack)
        throw e
      }
    } else {
      throw new Error('未找到该任务！')
    }
  }
  async unCompleteTask(_id) {
    const task = await this.Get(_id)
    if (!isNull(task)) {
      try {
        await this.Update(_id, {
          status: enums.NOT_COMPLETE,
        })
        return true
      } catch (e) {
        logger.info(e.stack)
        throw e
      }
    } else {
      throw new Error('未找到该任务！')
    }
  }

  // async updateTaskInArticle(task){
  //   this.tableName= 'Articles'
  //   const Article = await this.Get(task.relatedId)
  //   this.tableName= 'Tasks' 
  //   if(Article&&task.relatedId){
  //     return await this.Update(task.relatedId,{content:Article.content.replaceAll(task.revertToString(),task.toString())})
  //   }
  // }
}
module.exports.Tasks = Tasks
