 const UtilsCollection={
    'db':require('./mongodb'),
    'logger':require('./log4js'),
}
module.exports = (app)=>{ 
    console.log('UtilsCollection',UtilsCollection)
    for(utilCommand in UtilsCollection){
        ((utilCommand)=>{
            app.use(async (ctx,next)=>{
                if(!ctx.utils){
                    ctx.utils = {}
                }
                ctx.utils[utilCommand] = UtilsCollection[utilCommand]
                await next()
            }) 
        })(utilCommand)

    } 
}