const { get, post } = require('../../utils/common')
const db = require('../../utils/mongodb')
const WXWork = {
  getConfig: async (key) => {
    var settings = await db.Query('Settings', { key })
    if (settings.length > 0) {
      return settings[0]
    } else {
      throw new Error('未找到配置项')
    }
  },
  async refreshAccessCode(AgentId, Secret, AccessCode, ExpiredTime) {
    await db.Insert('AccessCodeStore', {
      AgentId,
      Secret,
      AccessCode,
      ExpiredTime,
    })
  },
  async getAccessCodeFromCache(agent_id, corpsecret) {
    const records = await db.Query(
      'AccessCodeStore',
      { AgentId: agent_id },
      0,
      1,
      { ExpiredTime: -1 }
    )
    if (records.length > 0) { 
      const { AgentId, Secret, ExpiredTime, AccessCode } = records[0] 
      if (Secret !== corpsecret) {
        throw new Error('应用Secret不匹配')
      }
      if (Date.now() < ExpiredTime) {
        return AccessCode
      } else {
        return null
      }
    } else {
      return null
    }
  },
  async getAccessCode(AgentId, corpsecret) { 
    var Cache = await WXWork.getAccessCodeFromCache(AgentId, corpsecret)
    if (!Cache) {
      const { corpId } = await WXWork.getConfig('wxwork_auth')
      const api = `https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${corpId}&corpsecret=${corpsecret}`
      const result = await get(api)
      var now = new Date()
      const { errcode, errmsg, access_token, expires_in } = result
      if (result.errcode === 0) {
        var now = new Date()
        WXWork.refreshAccessCode(
          AgentId,
          corpsecret,
          access_token,
          new Date(now.setTime(now.getTime() + expires_in * 1000))
        )
      } else {
        throw new Error('获取Token失败:' + errmsg)
      }
    } else {
      return Cache
    }
  },
  async getUserInfo(userid, AgentId, corpsecret) { 
    const AccessCode = await WXWork.getAccessCode(AgentId, corpsecret)
    const api = `https://qyapi.weixin.qq.com/cgi-bin/user/get?access_token=${AccessCode}&userid=${userid}`
    const result = await get(api)
    if (result.errcode === 0) {
      return result
    } else {
      throw new Error('获取用户失败:' + result.errmsg)
    }
  },
  async addUserToDept(userid, agentid, corpsecret, departmentid) { 
    const AccessCode = await WXWork.getAccessCode(agentid, corpsecret)
    const user = await WXWork.getUserInfo(userid, agentid, corpsecret)
    if (user) {
      const { userid, department = [] } = user 
      department.push(departmentid)
      department.filter((i, index) => department.indexOf(i) === index) 
      const api = `https://qyapi.weixin.qq.com/cgi-bin/user/update?access_token=${AccessCode}&debug=1`
      const body = {
        userid,
        department,
      }
      const { data: result } = await post(api, body) 
      if (result.errcode === 0) {
        return result
      } else {
        throw new Error('添加失败:'+result.errmsg)
      }
      return result
    } else {
      throw new Error('获取用户失败')
    }
  },
  async getUserInfoByMobile(mobile, agentid, corpsecret) {
    const AccessCode = await WXWork.getAccessCode(agentid, corpsecret)
    const api = `https://qyapi.weixin.qq.com/cgi-bin/user/getuserid?access_token=${AccessCode}`
    const body = {
      mobile: mobile,
    }
    const { data: result } = await post(api, body)
    return result
  },
  async addUserToDeptByMobile(mobile, agentid, corpsecret, departmentid) { 
    userIdRes = await WXWork.getUserInfoByMobile(mobile, agentid, corpsecret)
    if (userIdRes.errcode === 0) {
      return await WXWork.addUserToDept(
        userIdRes.userid,
        agentid,
        corpsecret,
        departmentid
      ) 
    } else {
      throw new Error('获取用户失败:' + userIdRes.errmsg)
    }
  },
}
module.exports = WXWork
