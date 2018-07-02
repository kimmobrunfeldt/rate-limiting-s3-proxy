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
}

module.exports = config
