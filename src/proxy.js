const express = require('express')

function createProxy() {
  const router = express.Router()

  return router
}

module.exports = createProxy
