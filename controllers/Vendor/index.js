/*
 * @Author: your name
 * @Date: 2021-03-19 11:23:26
 * @LastEditTime: 2021-03-19 15:14:35
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /MPANDA.SUTDIO/controllers/Vendor/index.js
 */
const https = require('https')
const axios = require('axios')
var response = require('../../model/response.model')
let router = require('koa-router')()
router.get('/Vendor/Bing/GetDailyBG', async (ctx, next) => {
    var options = {
        host: 'cn.bing.com',
        path: '/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN',
        method: 'GET',
    } 
    await new Promise((resolve,rej)=>{
        https.get(options, (res) => {
            var rawData = ''
            res.setEncoding('utf8');
            res.on('data', (d) => {
                rawData += d
            })
            res.on('end', () => {
                try {
                    const parsedData = JSON.parse(rawData);
                    console.log(parsedData);
                    ctx.send(new response(parsedData))
                    resolve(parsedData)
                } catch (e) {
                    console.error(e.message);
                    rej(e.message)
                }
            })
        }).end()
    }) 
})
module.exports = router