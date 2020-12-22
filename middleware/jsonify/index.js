const response = require("../../model/response.model")

module.exports = () => {
  function render(json) {
      this.set("Content-Type", "application/json")
      // throw new Error('ERR') 
      // validate json object  
      this.body = JSON.stringify(JSON.parse(JSON.stringify(json)))
  }
  return async (ctx, next) => {
    try{
      ctx.send = render.bind(ctx)
      await next()
    } catch (e) {
      ctx.body = JSON.stringify(new response().GetError(String(e.stack)))  
      ctx.utils.logger.info(String(e.stack))
    }
  }
}
