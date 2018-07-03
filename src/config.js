/* eslint-disable no-process-env */
const { requiredEnv, optionalEnv, number, string, boolean } = require('./util/env')

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
  // Max limit what this express app will accept as body
  // Value is parsed with https://www.npmjs.com/package/bytes
  MAX_BODY_SIZE: optionalEnv('MAX_BODY_SIZE', string, '5mb'),
}

module.exports = config
