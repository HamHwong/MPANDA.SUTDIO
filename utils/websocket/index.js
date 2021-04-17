/*
 * @Author: your name
 * @Date: 2021-04-16 16:45:31
 * @LastEditTime: 2021-04-17 23:25:39
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
        console.log('走了')
        this.connects =  this.connects.filter(w=>w!=ws)
        console.log('ws.id',ws.userid)
        sentToOthers(JSON.stringify(new defaultEvent({$event:'$ws.event.leave',from:ws.userid})),this.connects,ws)
        // sentToOthers('$ws', this.connects, ws)
        // ws.send('客走了')
      })
  }) 
}