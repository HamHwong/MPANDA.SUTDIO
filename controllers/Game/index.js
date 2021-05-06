/*
 * @Author: your name
 * @Date: 2021-04-13 14:48:44
 * @LastEditTime: 2021-05-06 16:10:26
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /MPANDA.SUTDIO/controllers/Game/index.js
 */
let router = require('koa-router')()
var Response = require('../../model/Response') 
const { init } = require('../../services/Game')
const {PassThrough,Readable}  = require('stream')
router.post('/game/init', async (ctx,next)=>{
  const arr = await init() 
  ctx.send(new Response(arr))
})

module.exports = router