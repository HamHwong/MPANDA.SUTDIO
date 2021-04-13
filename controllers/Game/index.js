/*
 * @Author: your name
 * @Date: 2021-04-13 14:48:44
 * @LastEditTime: 2021-04-13 16:25:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /MPANDA.SUTDIO/controllers/Game/index.js
 */
let router = require('koa-router')()
var response = require('../../model/response.model') 
const { init } = require('../../services/Game')
const {PassThrough,Readable}  = require('stream')
router.post('/game/init', async (ctx,next)=>{
  const arr = await init() 
  ctx.send(new response(arr))
})

module.exports = router