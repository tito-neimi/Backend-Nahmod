const errorType = require("../../errors/errorTypes");
const logger = require("../../logger");

module.exports = ( error, req, res, next) => {
  logger.error(error.cause)
  switch (error.code) {
    case errorType.INVALID_TYPES:
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