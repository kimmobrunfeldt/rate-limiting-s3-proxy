const { URL } = require('url')
const request = require('request')
const aws4 = require('aws4')
const _ = require('lodash')
const logger = require('../util/logger')(__filename)
const config = require('../config')

const BASE_URL = `https://s3-${config.AWS_REGION}.amazonaws.com`

// If the upstream (S3) call causes one of these errors, we'll respond with corresponding
// http status
// Error code reference: https://nodejs.org/api/errors.html#errors_common_system_errors
const ERROR_CODE_TO_HTTP_STATUS = {
  ECONNRESET: 503,
  ETIMEDOUT: 503,
}

const HEADERS_TO_NOT_PROXY = [
  'content-length',
  'content-md5',
  'host',
  'transfer-encoding',
]

// XXX: some paths which have query with special characters returned signature mismatch
function sign(reqOpts, path) {
  const parts = new URL(reqOpts.url)

  const signOpts = _.omitBy({
    service: 's3',
    host: parts.host,
    method: reqOpts.method,
    path,
    body: reqOpts.body,
    region: config.AWS_REGION,
    headers: reqOpts.headers,
  }, _.isUndefined)

  const signature = aws4.sign(signOpts, {
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
  })
  return signature
}

function getRequestOpts(req) {
  console.log(JSON.stringify(req.headers))
  const headers = _.omitBy(
    _.omit(req.headers, HEADERS_TO_NOT_PROXY),
    (val, key) => _.startsWith(key.toLowerCase(), 'x-')
  )

  const path = `/${config.AWS_S3_BUCKET_NAME}${req.originalUrl}`
  const opts = {
    url: BASE_URL + path,
    method: req.method,
    headers,
    timeout: config.REQUEST_TIMEOUT,
  }

  if (req.body && !_.isEmpty(req.body)) {
    opts.body = req.body
  }

  const signature = sign(opts, path)
  opts.headers = signature.headers

  return opts
}

function handleUpstreamError(err, res) {
  if (_.has(ERROR_CODE_TO_HTTP_STATUS, err.code)) {
    return res.sendStatus(ERROR_CODE_TO_HTTP_STATUS[err.code])
  }

  return res.sendStatus(500)
}

function proxyRequest(req, res) {
  const reqOpts = getRequestOpts(req)
  console.log('reqOpts', reqOpts)
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
