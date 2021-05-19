
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
    const user =await this.ifUserExist(account)
    if(user.password===pwd){
      delete user.password
      return user
    }else{
      return false
    } 
  }
  static async changePassword(account,newPassword){
    //console.log('changePassword',account,newPassword)
    const user = await this.ifUserExist(account) 
    let result = await db.Update("Users",{_id:user._id},{password:newPassword})
    console.log('result:',result)
    if(result){
      return true
    }else{
      return false
    }
  }
  static async ifUserExist(account){
    const UsersRaw =  await db.Query("Users",{account})
    if(UsersRaw.length>0){
      const UserRaw = UsersRaw[0]
      const user = User.Convert(UserRaw)
      return user
    }else{
      throw new Error(`账号${account}用户不存在!`) 
    }
  }
}
exports.AuthService = Auth