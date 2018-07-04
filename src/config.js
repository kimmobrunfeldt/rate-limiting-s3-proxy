/* eslint-disable no-process-env */
const {
  requiredEnv,
  optionalEnv,
  number,
  string,
  boolean
} = require('./util/env')

const config = {
  // Required
  AWS_ACCESS_KEY_ID: requiredEnv('AWS_ACCESS_KEY_ID', string),
  AWS_SECRET_ACCESS_KEY: requiredEnv('AWS_SECRET_ACCESS_KEY', string),
  AWS_REGION: requiredEnv('AWS_REGION', string),
  AWS_S3_BUCKET_NAME: requiredEnv('AWS_S3_BUCKET_NAME', string),

  // Optional
  PORT: optionalEnv('PORT', number, 8000),
  NODE_ENV: optionalEnv('NODE_ENV', string, 'development'),
  AWS_DEBUG: optionalEnv('AWS_DEBUG', boolean, false),
  // If defined, will use the specified redis as the rate limiting store
  REDIS_URL: optionalEnv('REDIS_URL', string, undefined),
  REQUEST_TIMEOUT: optionalEnv('REQUEST_TIMEOUT', number, 10 * 1000),
  RATE_LIMIT_READ_TIME_WINDOW_IN_MINS: optionalEnv('RATE_LIMIT_READ_TIME_WINDOW_IN_MINS', number, 5),
  RATE_LIMIT_WRITE_TIME_WINDOW_IN_MINS: optionalEnv('RATE_LIMIT_WRITE_TIME_WINDOW_IN_MINS', number, 10),
  RATE_LIMIT_MAX_READ_REQUESTS_IN_TIME_WINDOW: optionalEnv('RATE_LIMIT_MAX_READ_REQUESTS_IN_TIME_WINDOW', number, 500),
  RATE_LIMIT_MAX_WRITE_REQUESTS_IN_TIME_WINDOW: optionalEnv('RATE_LIMIT_MAX_WRITE_REQUESTS_IN_TIME_WINDOW', number, 50),
  // Max limit what this express app will accept as body
  // Value is parsed with https://www.npmjs.com/package/bytes
  MAX_BODY_SIZE: optionalEnv('MAX_BODY_SIZE', string, '5mb'),
}

module.exports = config
