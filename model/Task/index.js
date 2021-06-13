const IModel = require('../IModel')
const ENUMS = require('./enums')
/**
 * 任务类
 *
 * @class Task
 */
class Task extends IModel{ 
  relatedId=null;
  content=null;
  status=ENUMS.NOT_COMPLETE;
  constructor() { 
    super()
  }
  toString(){
    return `* [${this.status===ENUMS.COMPLETED?'X':' '}] ${this.content}`
  }
  revertToString(){ 
    return `* [${this.status===ENUMS.COMPLETED?' ':'X'}] ${this.content}`
  }
}

module.exports = Task