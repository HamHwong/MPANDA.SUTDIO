class response{
  constructor(){
    // const {Data,Message,isSuccess} = data
    this.Data = 'Data'
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