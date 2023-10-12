const logger = require('../logger/index.js')


const fn = () => {
  try {
    logger.debug("logger tipo debug")
    logger.info("logger tipo info")
    logger.warn("logger tipo warn")
    logger.error("logger tipo error")
    return true
  } catch (error) {
    return false
  }
  
}

module.exports = fn