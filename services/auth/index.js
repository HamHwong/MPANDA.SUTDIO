const User = require('../../model/User')
const { isNull } = require('../../utils/common')
const db = require('../../utils/mongodb')
const { IService } = require('../IServices')
var mongodb = require('mongodb')
/**
 * 验证类
 *
 * @class Auth
 */
class Auth extends IService {
  constructor() {
    super('Users', User)
  }
  async login(account, pwd) {
    const user = await this.ifUserExist(account)
    //console.log(user.password,pwd)
    if (user.password === pwd) {
      delete user.password
      return user
    } else {
      return false
    }
  }
  async changePassword(account, newPassword) {
    // console.log('changePassword', account, newPassword)
    const user = await this.ifUserExist(account)
    var ObjectID = mongodb.ObjectID
    // let result = await db.Update(
    //   'Users',
    //   { _id: ObjectID(user._id) },
    //   { password: newPassword }
    // )
    let result = await this.Update(user._id, { password: newPassword })
    // console.log('user._id:', ObjectID(user._id))
    // console.log('result:', user.upsertedCount)
    if (result.upsertedCount > 0) {
      return true
    } else {
      return false
    }
  }
  async ifUserExist(account) {
    const UsersRaw = await db.Query('Users', { account })
    if (UsersRaw.length > 0) {
      const UserRaw = UsersRaw[0]
      const user = User.Convert(UserRaw)
      return user
    } else {
      throw new Error(`账号${account}用户不存在!`)
    }
  }
}
exports.AuthService = Auth
