/*
 * @Author: your name
 * @Date: 2020-12-23 09:20:27
 * @LastEditTime: 2021-05-06 16:10:16
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /MPANDA.SUTDIO/middleware/jsonify/index.js
 */
const Response = require("../../model/Response")

module.exports = () => {
  function render(json) {
      this.set("Content-Type", "application/json")
      // throw new Error('ERR') 
      // validate json object  
      this.body = JSON.stringify(JSON.parse(JSON.stringify(json)))
  }
  return async (ctx, next) => {
    try{
      ctx.send = render.bind(ctx)
      ctx.sendPlainText = (content)=>ctx.body=content
      // console.log('jsonify')
      await next()
    } catch (e) {
      ctx.body = JSON.stringify(new Response().GetError(e.message))  
      ctx.utils.logger.info(String(e.stack))
    }
  }
}
