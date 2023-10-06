



class CustomError {
  createError({name="Error", cause, msg, code=1}){
    const error = new Error(msg, {cause})
    error.name = name
    error.code = code
    throw error
  }
}
module.exports = new CustomError()