const path = require('path')
const winston = require('winston')
const _ = require('lodash')

const COLORIZE = process.env.NODE_ENV === 'development'

function _setLevelForTransports(logger, level) {
  _.each(logger.transports, (transport) => {
    // eslint-disable-next-line
    transport.level = level
  })
}

function createLogger(filePath) {
  const fileName = path.basename(filePath)

  const logger = new winston.Logger({
    transports: [new winston.transports.Console({
      colorize: COLORIZE,
      label: fileName,
      timestamp: true
    })]
  })

  _setLevelForTransports(logger, process.env.LOG_LEVEL || 'info')
  return logger
}

module.exports = createLogger
