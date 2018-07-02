const _ = require('lodash')

function string(val) {
  return String(val)
}

function number(val, name) {
  const num = Number(val)
  if (!_.isFinite(num)) {
    throw new Error(`Expected env var ${name} to be a number but found: ${val}`)
  }

  return num
}

function boolean(val, name) {
  if (val !== 'true' && val !== 'false') {
    throw new Error(`Expected env var ${name} to be a boolean but found: ${val}`)
  }

  return val === 'true'
}

function requiredEnv(envName, typeCast) {
  const envVal = process.env[envName]

  if (!envVal) {
    throw new Error(`${envName} environment variable is not set`)
  }

  return typeCast(envVal)
}

function optionalEnv(envName, typeCast, defaultVal) {
  const envVal = process.env[envName]
  return envVal ? typeCast(envVal, envName) : defaultVal
}

module.exports = {
  string,
  number,
  boolean,
  requiredEnv,
  optionalEnv,
}
