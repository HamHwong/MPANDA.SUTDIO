const { IService } = require('../IServices') 
const { Category } = require('../../model/Category')
const { isNull } = require('../../utils/common')
class CategoryService extends IService {
  constructor() {
    super('Category', Category)
  }
}
exports.Category=CategoryService