/*
 * @Author: your name
 * @Date: 2021-04-16 16:45:31
 * @LastEditTime: 2021-04-20 17:09:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /MPANDA.SUTDIO/utils/websocket/index.js
 */
const WS = require('ws')
const {
  sendToAll,
  sentToOthers
} = require('./utils')
class defaultEvent {
  constructor({$event,data,from,to='ALL'}){
    this.$event = $event
    this.data = data
    this.from = from
    this.to = to
  }
}
module.exports = (port) => {
  this.connects = []
  const wss = new WS.Server({
    port
  })
  wss.on('connection', (ws) => { 
    this.connects.push(ws) 
      ws.on('message', (e) => { 
        var o  = JSON.parse(e) 
        ws.userid = o.from
        sentToOthers(e, this.connects, ws)
      })
      ws.on('close', () => { 
        this.connects =  this.connects.filter(w=>w!=ws) 
        sentToOthers(JSON.stringify(new defaultEvent({$event:'$ws.event.leave',from:ws.userid})),this.connects,ws) 
        console.log('还有'+this.connects.length+'个连接')
      })
  }) 
}