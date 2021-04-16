const { port } = require('../config')

/*
 * @Author: your name
 * @Date: 2020-12-07 10:55:23
 * @LastEditTime: 2021-04-16 16:48:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /MPANDA.SUTDIO/utils/index.js
 */
 const UtilsCollection={
    'db':require('./mongodb'),
    'logger':require('./log4js'),
    'io':require('./websocket')(port+1)
}
module.exports = (app)=>{
    for(utilCommand in UtilsCollection){
        ((utilCommand)=>{
            app.use(async (ctx,next)=>{
                if(!ctx.utils){
                    ctx.utils = {}
                }
                ctx.utils[utilCommand] = UtilsCollection[utilCommand]
                await next()
            }) 
        })(utilCommand)
    } 
}