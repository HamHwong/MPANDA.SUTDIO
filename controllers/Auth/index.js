
let router = require('koa-router')() 
const User = require('../../model/User')
var response = require('../../model/Response')
let {AuthService} = require('../../services/auth')
router.post('/auth/login',async(ctx,next)=>{
  var user = User.Convert(ctx.request.body)
  var loginUser = await AuthService.login(user.account,user.password) 
  var result = null
  if(loginUser){
    result = new response(loginUser) 
  }else{
    throw new Error('验证失败')
  }
  ctx.send(result)
})

module.exports = router