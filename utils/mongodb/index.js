var client = require('mongodb').MongoClient;
var url = "mongodb://localhost:8111/?readPreference=primary&ssl=false";
module.exports = {
  async Connect(queryFunc) {
    return new Promise((res, rej) => {
      client.connect(url, async function (err, db) {
        console.log("数据库已连接!");
        if (err) {
          rej(err)
          throw err;
        }
        var dbo = db.db('test');
        const result = await queryFunc(dbo);
        res(result)
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