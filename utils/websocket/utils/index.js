/*
 * @Author: your name
 * @Date: 2021-04-17 16:05:19
 * @LastEditTime: 2021-04-17 23:03:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \MPANDA.SUTDIO\utils\websocket\utils\index.js
 */

module.exports={
   sendToAll:(data,connects)=>{
    connects.map(i=>{
      i.send(data)
    })
  },
  sentToOthers:(data,connects,ws)=>{
    // console.log( connects.filter(i=>i!==ws).length)
    connects.filter(i=>i!==ws).map(i=>{
      i.send(data)
    })
  }
}