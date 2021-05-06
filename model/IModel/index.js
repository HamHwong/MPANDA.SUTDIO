const { plainToClass } = require('class-transformer')
/**
 *基础Model类
 *
 * @class IModel
 */
class IModel {
  _id = null
  id = null
  createDate = null
  updateDate = null
  constructor() {}
  /**
   * 将JSON转化为该类示例
   *
   * @static
   * @param {*} JSON
   * @return {*} 
   * @memberof IModel
   */
  static Convert(JSON){
    return plainToClass(this, JSON)
  }
}
module.exports = IModel