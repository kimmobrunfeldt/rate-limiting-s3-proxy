const request = require('request')
const aws4 = require('aws4')
const _ = require('lodash')
const logger = require('./util/logger')(__filename)
const config = require('./config')

const BASE_URL = `https://s3-${config.AWS_REGION}.amazonaws.com/${config.AWS_S3_BUCKET_NAME}`

// If the upstream (S3) call causes one of these errors, we'll respond with 503
// Error code reference: https://nodejs.org/api/errors.html#errors_common_system_errors
const SERVICE_UNAVAILABLE_ERRORS = ['ECONNRESET', 'ETIMEDOUT']
const HEADERS_TO_NOT_PROXY = [
  'content-encoding',
  'content-length',
  'content-md5',
  'host',
  'transfer-encoding',
]

function getRequestOpts(req) {
  const opts = {
    url: BASE_URL + req.originalUrl,
    method: req.method,
    headers: _.omit(req.headers, HEADERS_TO_NOT_PROXY),
    timeout: config.REQUEST_TIMEOUT,
  }

  if (req.body && !_.isEmpty(req.body)) {
    opts.body = req.body
  }

  return opts
}

function handleUpstreamError(err, res) {
  if (_.includes(SERVICE_UNAVAILABLE_ERRORS, err.code)) {
    return res.sendStatus(503)
  }

  return res.sendStatus(500)
}

function proxyRequest(req, res) {
  const reqOpts = getRequestOpts(req)
  console.log(reqOpts)
  request(reqOpts, (err) => {
    if (err) {
      handleUpstreamError(err, res)
    }
  }).pipe(res)
}

function createProxy() {
  return function proxy(req, res, next) {
    try {
      proxyRequest(req, res)
    } catch (err) {
      logger.error('Error when proxying to S3:', err)
      next(err)
    }
  }
}

module.exports = createProxy
