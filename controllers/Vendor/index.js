const https = require('https')
const http = require('http')
const axios = require('axios')
var response = require('../../model/Response')
let router = require('koa-router')()
/**
 * @swagger
 * /api/v1/Vendor/Bing/GetDailyBG:
 *   get:
 *     summary: 从Bing获取今日壁纸
 *     description: 从Bing获取今日壁纸
 *     tags:
 *       - Vendor 
 *     responses:
 *       200:
 *         description: 从Bing获取今日壁纸的信息
 */
router.get('/Vendor/Bing/GetDailyBG', async (ctx, next) => {
  var options = {
    host: 'cn.bing.com',
    path: '/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN',
    method: 'GET',
  }
  await new Promise((resolve, rej) => {
    https
      .get(options, (res) => {
        var rawData = ''
        res.setEncoding('utf8')
        res.on('data', (d) => {
          try {
            rawData += d
          } catch (e) {
            console.error(e.message)
            rej(e.message)
          }
        })
        res.on('error', function () {
          try {
            res.destory()
          } catch (e) {
            rej(e.message)
          } finally {
            ctx.utils.logger.info(String(e.stack))
          }
        })
        res.on('end', () => {
          try {
            const parsedData = JSON.parse(rawData)
            ctx.send(new response(parsedData))
            resolve(parsedData)
          } catch (e) {
            console.error(e.message)
            rej(e.message)
          }
        })
      })
      .end()
  }).catch((e) => {})
})
/**
 * @swagger
 * /api/v1/Vendor/Other/GetDailyWords:
 *   get:
 *     summary: 获取段子文字
 *     description: 获取段子文字
 *     tags:
 *       - Vendor
 *     responses:
 *       200:
 *         description: 获取段子文字
 */
router.get('/Vendor/Other/GetDailyWords', async (ctx, next) => {
  //http://api.lkblog.net/ws/api.php
  var options = {
    host: 'api.lkblog.net',
    path: '/ws/api.php',
    method: 'GET',
  }
  await new Promise((resolve, rej) => {
    http
      .get(options, (res) => {
        var rawData = ''
        res.on('data', (d) => {
          try {
            rawData += d
          } catch (e) {
            console.error(e.message)
            rej(e.message)
          }
        })
        res.on('error', function () {
          try {
            res.destory()
          } catch (e) {
            rej(e.message)
          } finally {
            ctx.utils.logger.info(String(e.stack))
          }
        })
        res.on('end', () => {
          try {
            const parsedData = JSON.parse(rawData)
            // console.log(parsedData);
            ctx.send(new response(parsedData))
            resolve(parsedData)
          } catch (e) {
            console.error(e.message)
            rej(e.message)
          }
        })
      })
      .end()
  }).catch((e) => {
    
  })
})
module.exports = router
