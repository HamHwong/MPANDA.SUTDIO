/*
 * @Author: your name
 * @Date: 2021-05-04 15:25:33
 * @LastEditTime: 2021-05-04 15:36:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \MPANDA.SUTDIO\MongoDB_Script\index.js
 */

//docker run -tid --name mongo -p 27017:27017 mongo --auth

function createTable() {
  db.createUser({
    user: 'admin',
    pwd: 'hh0504hH!',
    roles: [{ role: 'root', db: 'admin' }],
  })
}
db.createUser({
  user: 'Mpanda',
  pwd: 'hh0504hH!',
  roles: [{ role: 'dbOwner', db: 'Mpanda_Studio' }],
}) 