const {createLogger, transports: {Console, File}, format:{colorize, combine, simple}} = require('winston')
const {LOGGER} = require('../config/config.js')

const options = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    debug: 4
  },
  colors: {
    fatal: 'red',
    error: 'red',
    warning: 'yellow',
    info: 'blue',
    debug: 'white'
  }
}

const logger = createLogger({
  transports: [
    new Console(
      {
        level: LOGGER,
        format: combine(colorize({colors: options.colors,}), simple())
      }
    ),
    new File({
      filename: './logs/error.log',
      level: 'error',
      format: simple()
    })
  ]
})

module.exports = logger