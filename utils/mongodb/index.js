/*
 * @Author: your name
 * @Date: 2020-12-07 10:55:23
 * @LastEditTime: 2020-12-09 13:25:31
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /MPANDA.SUTDIO/utils/mongodb/index.js
 */
var client = require('mongodb').MongoClient;
var config = require('../../config'); 
const {
  username,
  password,
  host,
  port
} = config.mongoDB
var url = `mongodb://${username}:${password}@${host}:${port}/?readPreference=primary&ssl=false`;
// console.log('URL',url)
module.exports = {
  async Connect(queryFunc) {
    return new Promise((res, rej) => {
      client.connect(url, async function (err, db) {
        if (err) {
          rej(err)
          throw err;
        }
        var dbo = db.db('Mpanda');
        const result = await queryFunc(dbo);
        console.log("数据库连接已创建!");
        res(result);
        await db.close();
      })
    })
  },
  async Query(table, query) {
    return this.Connect((dbo) => {
      return dbo.collection(table).find(query).toArray();
    })
  },
  async Insert(table,obj) {
    return this.Connect((dbo) => {
      return dbo.collection(table).insertOne(obj);
    })
  }
}