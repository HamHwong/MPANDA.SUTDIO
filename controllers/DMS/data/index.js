// import { from } from "core-js/fn/array"
let user = require('./data/user')
let routers = require('./data/routers')
let dealers = require('./data/dealers')
module.exports={
  dealer:{
    list:dealers.list,
    history:dealers.history
  },
  user:{
    login:user.login,
    info:user.info,
    logout:user.info,
  },
  routers
}