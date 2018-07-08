const _ = require('lodash')
const logger = require('../util/logger')(__filename)

function getLogFunc(status) {
  return status >= 500 ? logger.error : logger.warn
}

function deepSupressLongStrings(obj) {
  const newObj = {}
  _.each(obj, (val, key) => {
    if (_.isString(val) && val.length > 1000) {
      newObj[key] = `${val.slice(0, 1000)}... [CONTENT SLICED]`
    } else if (_.isPlainObject(val)) {
      deepSupressLongStrings(val)
    } else {
      newObj[key] = val
    }
  })

  return newObj
}

function logRequestDetails(log, req) {
  log('Request headers:', deepSupressLongStrings(req.headers))
  log('Request parameters:', deepSupressLongStrings(req.params))

  if (_.includes(req.headers['content-type'], 'json')) {
    log('Request body:', deepSupressLongStrings(req.body))
  }
}

function createErrorLogger(_opts) {
  const opts = _.merge({
    logRequest: (status) => {
      return status >= 400 && status !== 404 && status !== 503
    },
    logStackTrace: (status) => {
      return status >= 500 && status !== 503
    }
  }, _opts)

  return function errorHandler(err, req, res, next) {
    const status = err.status ? err.status : 500
    const log = getLogFunc(status)

    if (opts.logRequest(status)) {
      logRequestDetails(log, req, status)
    }

    if (opts.logStackTrace(status)) {
      log(err, err.stack)
    } else {
      log(err.toString())
    }

    next(err)
  }
}

module.exports = createErrorLogger
