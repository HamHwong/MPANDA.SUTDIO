
const User = require('../../model/User')
const { isNull } = require('../../utils/common')
const db = require('../../utils/mongodb')
/**
 * 验证类
 *
 * @class Auth
 */
class Auth{
  static async login(account,pwd){
    const UsersRaw =  await db.Query("Users",{account})
    if(UsersRaw.length>0){
      const UserRaw = UsersRaw[0]
      const user = User.Convert(UserRaw)
      if(user.password==pwd){
        delete user.password
        return user
      }else{
        return false
      } 
    }else{
      throw new Error('不存在!')
    }
  }
}
exports.AuthService = Auth