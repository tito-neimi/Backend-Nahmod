const logger = require('../logger/index')

const fn = (req, _res, next) => {
  logger.http(`[${req.method} - ${req.url} at ${(new Date()).toISOString()}]`)
  next()
}

module.exports = fn