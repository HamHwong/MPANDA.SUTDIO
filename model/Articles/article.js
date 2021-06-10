const IModel = require('../IModel')
/**
 * 文章类
 *
 * @class Article
 */
class Article extends IModel{ 
  cate={}; 
  title=null;
  content=null; 
  constructor() { 
    super()
  }
}

module.exports = Article