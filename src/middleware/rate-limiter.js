const RateLimit = require('express-rate-limit')
const RedisStore = require('rate-limit-redis');
const _ = require('lodash')
const config = require('../config')
const { createClient } = require('../util/redis')
const logger = require('../util/logger')(__filename)

let redisClient = null
if (config.REDIS_URL) {
  redisClient = createClient()
} else {
  logger.warn('Warning: using in-memory store for rate limiting!')
  logger.warn('In production setups with multiple node processes you should use Redis as the store')
}

const readLimiter = new RateLimit({
  store: redisClient ? new RedisStore({
    expiry: 5 * 60 * 1000,
    client: redisClient,
  }) : undefined,
  windowMs: 5 * 60 * 1000,
  max: 1,
  delayMs: 0,
  keyGenerator: req => `read-${req.ip}`,
})
const writeLimiter = new RateLimit({
  store: redisClient ? new RedisStore({
    expiry: 15 * 60 * 1000,
    client: redisClient,
  }) : undefined,
  windowMs: 15 * 60 * 1000,
  max: 30,
  delayMs: 0,
  keyGenerator: req => `write-${req.ip}`,
})

function createLimiter() {
  return function limiter(req, res, next) {
    const isReadMethod = _.includes(['GET', 'HEAD', 'OPTIONS'], req.method)
    if (isReadMethod) {
      readLimiter(req, res, next)
    } else {
      writeLimiter(req, res, next)
    }
  }
}

module.exports = createLimiter
