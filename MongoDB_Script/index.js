/*
 * @Author: your name
 * @Date: 2021-05-04 15:25:33
 * @LastEditTime: 2021-05-06 20:38:46
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

//docker run -p 27017:27017 --name=MongoDB -v /home/projects/dockers/mongodb/data:/data/dv -d mongo -auth