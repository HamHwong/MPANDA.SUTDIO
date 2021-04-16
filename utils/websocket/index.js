/*
 * @Author: your name
 * @Date: 2021-04-16 16:45:31
 * @LastEditTime: 2021-04-16 17:17:48
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /MPANDA.SUTDIO/utils/websocket/index.js
 */
const WS = require('ws')
module.exports = (port)=>{
  this.connects = []
  const wss = new WS.Server({port})
  wss.on('connection',(ws)=>{
    console.log('来客了')
    this.connects.push(ws)
    this.connects.map(i=>{
      i.send('客来了')
    })
    // ws.send('客来了')
  })
  wss.on('message',()=>{
    
  })
  wss.on('close',()=>{ 
    console.log('走了')
    ws.send('客走了')
  })
}