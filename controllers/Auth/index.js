
let router = require('koa-router')()
let {AuthService} = require('../../services/auth')
router.post('/auth/login',async(ctx,next)=>{
  ctx.send('sss')
})

module.exports = router