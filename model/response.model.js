/*
 * @Author: your name
 * @Date: 2020-12-14 13:53:40
 * @LastEditTime: 2020-12-22 17:24:31
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /MPANDA.SUTDIO/model/response.model.js
 */
class response{
  constructor(data){
    // const {Data,Message,isSuccess} = data
    this.Data = data
    this.Message = 'Message'
    this.IsSuccess = 'IsSuccess'
    this.StatusCode = 200
  } 
  GetError(ErrorMessage){
    this.Data = {}
    this.Message = ErrorMessage
    this.IsSuccess = false
    this.StatusCode = 500
    return this
  }
}
module.exports = response