/*
 * @Author: your name
 * @Date: 2021-03-19 11:23:26
 * @LastEditTime: 2021-05-06 15:22:35
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /MPANDA.SUTDIO/controllers/Vendor/index.js
 */
const https = require('https')
const http = require('http')
const axios = require('axios')
var response = require('../../model/Response')
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
                    // console.log(parsedData);
                    ctx.send(new response(parsedData))
                    resolve(parsedData)
                } catch (e) {
                    console.error(e.message);
                    rej(e.message)
                }
            })
        }).end()
    }) .catch(e=>{
        
    })
})
router.get('/Vendor/Other/GetDailyWords',async (ctx,next)=>{
    //http://api.lkblog.net/ws/api.php
    var options = {
        host: 'api.lkblog.net',
        path: '/ws/api.php',
        method: 'GET',
    } 
    await new Promise((resolve,rej)=>{
        http.get(options,(res)=>{
            var rawData = ''
            res.on('data', (d) => {
                rawData += d
            })
            res.on('end', () => {
                try {
                    const parsedData = JSON.parse(rawData);
                    // console.log(parsedData);
                    ctx.send(new response(parsedData))
                    resolve(parsedData)
                } catch (e) {
                    console.error(e.message);
                    rej(e.message)
                }
            })
        }).end()
    }).catch(e=>{
        
    })
})
module.exports = router