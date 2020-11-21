 const UtilsCollection={
    'logger':require('./log4js')
}
module.exports = (app)=>{ 
    for(utilCommand in UtilsCollection){
        app.use(async (ctx,next)=>{
            if(!ctx.utils){
                ctx.utils = {}
            }
            ctx.utils[utilCommand] = UtilsCollection[utilCommand]
            await next()
        }) 
    } 
}