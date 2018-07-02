
const AWS = require('aws-sdk')
const BPromise = require('bluebird')
const config = require('../config')

const awsConfig = {
  accessKeyId: config.AWS_ACCESS_KEY_ID,
  secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
  region: config.AWS_REGION,
  sslEnabled: true,
}
if (config.AWS_DEBUG) {
  awsConfig.logger = process.stdout
}

AWS.config.update(awsConfig)

module.exports = {
  createS3: () => BPromise.promisifyAll(new AWS.S3({ apiVersion: '2006-03-01' })),
}
