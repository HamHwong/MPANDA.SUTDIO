const IModel = require('../IModel')
/**
 * 用户类
 *
 * @class User
 * @extends {IModel}
 */
class User extends IModel {
  account = null
  display_name = null
  avatar = null
  email = null
  mobile = null
  password = null
  roles = null
  constructor() {
    super()
  }
}
