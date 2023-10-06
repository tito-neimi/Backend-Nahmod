const errorType = require("../../errors/errorTypes");

module.exports = ( error, req, res, next) => {
  console.log(error.cause)
  switch (error.code) {
    case errorType.INVALID_TYPES:
      console.log("aaaaaaaaaa")
      res.send({status:"error", error: error.name})
      break;
    
    case errorType.DB:
      res.send({status:"error", error: error.name})
      break;
    

    default:
      res.send({status:"error", error:"Unhandled error"})
      break;
  }
}