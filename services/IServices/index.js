/*
 * @Author: your name
 * @Date: 2021-05-04 15:07:20
 * @LastEditTime: 2021-05-04 21:16:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \MPANDA.SUTDIO\services\IServices\index.js
 */
const db = require('../../utils/mongodb') 
var mongodb = require('mongodb')
const logger = require('../../utils/log4js')
var ObjectID = mongodb.ObjectID
class IService {
  tableName = null
  Class = null
  constructor(tableName,Class) {
    this.tableName = tableName
    this.Class = Class
  }
  /**
   * 插入一条记录
   * @param {Object} Instance 要插入的对象实例
   * @param {Function} validation 校验对象实例属性,返回Boolean;如需要重写错误提示信息, 请在校验方法中抛异常!
   * @returns {String} Instance ID
   * @memberof IService
   */
  async Create(Instance,validation) { 
    var validationResult = true
    try{
      if(validation){
        validationResult = validation(Instance)
      }
      if(validationResult){
        Instance.id = await this.GetNewMaxCount()
        const { insertedId } = await db.Insert(this.tableName, Instance)
        return insertedId
      } else {
        throw new Error('对象属性未通过验证,创建失败,插入对象属性如下:\n'+JSON.stringify(Instance))
      }
    }catch(e){
      logger.error(String(e.stack));
      throw e
    }
  }
  /**
   * 更新记录
   *
   * @param {String} insertedId 实例ID
   * @param {*} Instance 实例中要修改的键值对组成的对象
   * @return {*} 
   * @memberof IService
   */
  async Update(insertedId, Instance) { 
    return await db.Update(
      this.tableName,
      { _id: ObjectID(insertedId) },
      Instance
    )
  }

  async Get(insertedId) {
    return await db.Get(this.tableName, insertedId)
  }
  async Exist(Condition){
    const count =  await db.Count(
      this.tableName,
      Condition,
    )
    return count > 0
  }
  async Query(keywords) {}

  async Delete(insertedId) {
    return await db.Delete(this.tableName, insertedId)
  }
  async List(condition,start,count,orderCondition) {  
    return await db.Query(
      this.tableName,
      condition,
      start,
      count,
      orderCondition
    )
  }
  async GetCount(conditions){
    return await db.Count(
      this.tableName,
      conditions,
    )
  }
  async GetAmount() {
    return db.CountAll(this.tableName)
  }
  async GetNewMaxCount(){ 
    return Number(await db.CountAll(this.tableName))+1
  }
}
exports.IService = IService