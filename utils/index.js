const { wssPort } = require('../config')

/*
 * @Author: your name
 * @Date: 2020-12-07 10:55:23
 * @LastEditTime: 2021-04-17 14:33:48
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /MPANDA.SUTDIO/utils/index.js
 */
 const UtilsCollection={
    'db':require('./mongodb'),
    'logger':require('./log4js'),
    'io':require('./websocket')(wssPort)
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