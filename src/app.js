const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const bodyParser = require('body-parser')
const compression = require('compression')
const errorResponder = require('./middleware/error-responder')
const errorLogger = require('./middleware/error-logger')
const createProxy = require('./proxy')
const config = require('./config')

function createApp() {
  const app = express()

  // Heroku's load balancer can be trusted
  app.enable('trust proxy', 1)
  app.disable('x-powered-by')

  if (config.NODE_ENV !== 'production') {
    app.use(morgan('dev'))
  }

  app.use(bodyParser.raw({ limit: '5mb' }))
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
