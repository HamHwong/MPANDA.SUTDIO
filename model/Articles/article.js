const IModel = require('../IModel')
/**
 * 文章类
 *
 * @class Article
 */
class Article extends IModel{ 
  cate=null;
  cateId=null;
  title=null;
  content=null; 
  constructor() { 
    super()
  }
}

module.exports = Article