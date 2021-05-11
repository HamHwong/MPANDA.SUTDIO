
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
router.get('/oauth2/wechat/oauth2',async(ctx,next)=>{ 
  //ctx.send(new response(`result`) )
  const APPID = 'wx1945f85c362dd76f'
  const REDIRECT_URI = 'mpanda.studio'
  const path = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${APPID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=SCOPE&state=STATE#wechat_redirect`
  ctx.response.redirect(path);
})
router.get('/oauth2/wechat/check',async(ctx,next)=>{  
  ctx.send(true)
})

module.exports = router