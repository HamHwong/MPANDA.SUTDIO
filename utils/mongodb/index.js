/*
 * @Author: your name
 * @Date: 2020-12-07 10:55:23
 * @LastEditTime: 2021-05-06 20:59:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /MPANDA.SUTDIO/utils/mongodb/index.js
 */
var client = require('mongodb').MongoClient
var config = require('../../config')
const { username, password, host, dbName, port,authDBName } = config.mongoDB
var url = `mongodb://${username}:${password}@${host}:${port}/?authSource=${authDBName}&readPreference=primary&ssl=false`

var mongodb = require('mongodb')
const { isNull } = require('../../utils/common')
var ObjectID = mongodb.ObjectID

module.exports = {
  async Connect(queryFunc) {
    return new Promise((res, rej) => {
      client.connect(url, async function (err, db) {
        if (err) {
          rej(err)
          throw err
        }
        var dbo = db.db(dbName)
        const result = await queryFunc(dbo)
        // console.log("数据库连接已创建!");
        res(result)
        await db.close()
      })
    })
  },
  async Get(table, id) {
    return this.Connect((dbo) =>
      dbo.collection(table).findOne({ _id: ObjectID(id) })
    )
  },
  async Query(table, query, start, count, orderCondition) {
    return this.Connect((dbo) => {
      var _query = dbo.collection(table).find(query)
      if (!isNull(start)) _query.skip(Number(start))
      if (!isNull(count)) _query.limit(Number(count))
      if (!isNull(orderCondition)) _query.sort(orderCondition)
      return _query.toArray()
    })
  }, 
  async Insert(table, obj) {
    obj.createDate = new Date()
    obj.updateDate = new Date()
    if (obj instanceof Array) {
      return this.Connect((dbo) => {
        return dbo.collection(table).insertMany(obj)
      })
    } else {
      return this.Connect((dbo) => {
        return dbo.collection(table).insertOne(obj)
      })
    }
  },
  async Update(table, condition, updatedObj) { 
    console.log(table)
    var method = {
      $set: {},
    }
    for (var propKey in updatedObj) {
      if (!isNull(updatedObj[propKey]))
        method.$set[propKey] = updatedObj[propKey]
    }
    delete method.$set._id
    delete method.$set.id
    method.$set.updateDate = new Date()
    // console.log(condition._id instanceof ObjectID,method)
    return await this.Connect((dbo) =>
      dbo.collection(table).updateOne(condition, method)
    )
  },
  async Delete(table, id) {
    var { deletedCount } = await this.Connect((dbo) =>
      dbo.collection(table).deleteOne({ _id: ObjectID(id) })
    )
    return deletedCount
  },
  async Count(table,conditions){
    return this.Connect((dbo)=>
      dbo.collection(table).count(conditions)
    )

  },
  async CountAll(table) {
    return this.Connect((dbo) => {
      return dbo.collection(table).count()
    })
  },
}
