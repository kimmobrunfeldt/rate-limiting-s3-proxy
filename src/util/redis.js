const Redis = require('ioredis')
const config = require('../config')
const logger = require('./logger')(__filename)

function createClient() {
  const redis = new Redis(config.REDIS_URL)
  redis.on('connect', () => logger.info('Redis client connected'))
  redis.on('reconnect', () => logger.info('Redis client reconnect attempt'))
  redis.on('error', (err) => {
    logger.error('Error in redis:', err)
  })

  return redis
}

module.exports = {
  createClient,
}
