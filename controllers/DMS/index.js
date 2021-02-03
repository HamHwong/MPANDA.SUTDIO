/*
 * @Author: your name
 * @Date: 2021-02-03 13:49:00
 * @LastEditTime: 2021-02-03 16:11:39
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /MPANDA.SUTDIO/EliteSource/index.js
 */
let {
    user,
    routers,
    dealer
} = require('./data/index')
let router = require('koa-router')()
router.get('/DMS/getRouters', (ctx, next) => {
    ctx.send(routers.routers)
})
router.get('/DMS/getInfo', (ctx, next) => {
    ctx.send(user.info)
})
router.get('/DMS/captchaImage', (ctx, next) => {
    ctx.send({
        'mockIndexData': 1
    })
})
router.post('/DMS/login', (ctx, next) => {
    ctx.send(user.login)
})
router.post('/DMS/logout', (ctx, next) => {
    ctx.send(user.logout)
})
router.post('/DMS/dealer/list', (ctx, next) => {
    ctx.send(dealer.list)
})
router.get('/DMS/dealer/detail', (ctx, next) => {
    ctx.send(dealer.detail)
})
router.get('/DMS/dealer/history', (ctx, next) => {
    ctx.send(dealer.history)
})
module.exports = router