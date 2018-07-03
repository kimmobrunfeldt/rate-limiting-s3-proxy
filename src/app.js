const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const bodyParser = require('body-parser')
const compression = require('compression')
const errorResponder = require('./middleware/error-responder')
const errorLogger = require('./middleware/error-logger')
const createProxy = require('./middleware/proxy')
const createLimiter = require('./middleware/rate-limiter')
const config = require('./config')

function createApp() {
  const app = express()

  // Heroku's load balancer can be trusted
  app.enable('trust proxy', 1)
  app.disable('x-powered-by')

  if (config.NODE_ENV !== 'production') {
    app.use(morgan('dev'))
  }

  app.use(createLimiter())

  app.use(bodyParser.raw({
    // By default body parser matches only when content-type matches this type.
    // We want to proxy body content straight to S3 so we always want to parse the body as raw
    type: () => true,
    limit: config.MAX_BODY_SIZE,
  }))
  app.use(cors({ origin: '*' }))
  app.use(compression({
    // Compress everything over 10 bytes
    threshold: 10,
  }))

  app.use(createProxy())

  app.use(errorLogger())
  app.use(errorResponder())

  return app
}

module.exports = createApp
