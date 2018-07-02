const http = require('http')
const _ = require('lodash')

// This reponder is assuming that all <500 errors are safe to be responded
// with their .message attribute.
// DO NOT write sensitive data into error messages.
function createErrorResponder(_opts) {
  const opts = _.merge({
    isErrorSafeToRespond(status) {
      return status < 500
    },
  }, _opts)

  // eslint-disable-next-line
  return function errorResponder(err, req, res, next) {
    let message
    const status = err.status ? err.status : 500

    const httpMessage = http.STATUS_CODES[status]
    if (opts.isErrorSafeToRespond(status)) {
      message = `${httpMessage}: ${err.message}`
    } else {
      message = httpMessage
    }

    const body = { error: message }
    if (err.userMessage) {
      body.showUser = true
      body.message = err.userMessage
    }

    if (err.userHeader) {
      body.header = err.userHeader
    }

    res.status(status)
    res.send(body)
  }
}

module.exports = createErrorResponder
