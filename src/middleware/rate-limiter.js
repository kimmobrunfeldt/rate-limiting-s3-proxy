const RateLimit = require('express-rate-limit')
const RedisStore = require('rate-limit-redis')
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
    expiry: config.RATE_LIMIT_READ_TIME_WINDOW_IN_MINS * 60,
    client: redisClient,
  }) : undefined,
  windowMs: config.RATE_LIMIT_READ_TIME_WINDOW_IN_MINS * 60 * 1000,
  max: config.RATE_LIMIT_MAX_READ_REQUESTS_IN_TIME_WINDOW,
  delayMs: 0,
  keyGenerator: req => `read-${req.ip}`,
})
const writeLimiter = new RateLimit({
  store: redisClient ? new RedisStore({
    expiry: config.RATE_LIMIT_WRITE_TIME_WINDOW_IN_MINS * 60,
    client: redisClient,
  }) : undefined,
  windowMs: config.RATE_LIMIT_WRITE_TIME_WINDOW_IN_MINS * 60 * 1000,
  max: config.RATE_LIMIT_MAX_WRITE_REQUESTS_IN_TIME_WINDOW,
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
