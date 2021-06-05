const response = require('../../model/Response')
const { getConfig, getAccessCode, addUserToDept,addUserToDeptByMobile } = require('../../services/wxwork')
const { callback_wxwork } = require('./utils')
let router = require('koa-router')()
/**
 * 校验接口配置信息 For WXWork
 **/
 router.get('/oauth2/wxwork/check', async (ctx, next) => {
  const {
    msg_signature = '',
    echostr = '',
    timestamp = '',
    nonce = '',
  } = ctx.request.query
  var wxworksetting = await getConfig('wxwork_auth')
  const { corpId, token, encodingAesKey } = wxworksetting
  var result = await callback_wxwork(
    msg_signature,
    nonce,
    timestamp,
    echostr,
    encodingAesKey,
    token
  )
  ctx.sendPlainText(result)
})
router.get('/oauth2/wxwork/getAccessCode', async (ctx, next) => { 
  const {
    AgentId,Secret
  } = ctx.request.query 
  ctx.send(new response(await getAccessCode(AgentId,Secret)))
})
router.post('/oauth2/wxwork/addUserToDept', async (ctx, next) => { 
  const {
    Mobile,
    AgentId,
    Secret,
    DepartmentId
  } = ctx.request.body 
  ctx.send(new response(await addUserToDeptByMobile(Mobile,AgentId,Secret,DepartmentId)))
})

module.exports = router
