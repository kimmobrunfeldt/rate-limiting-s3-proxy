var http  = require('http'),
    https = require('https'),
    aws4  = require('aws4')

console.log(process.env.AWS_ACCESS_KEY_ID)
console.log(process.env.AWS_SECRET_ACCESS_KEY)

const opts = {
  service: 's3',
  host: 's3-eu-west-1.amazonaws.com',
  headers: {
    accept: '*/*',
    'content-type': 'application/text',
  },
  path: '/my-bucket/a',
  method: 'GET',
  region: 'eu-west-1'
}
const signed = aws4.sign(opts)
console.log(signed)
// we can now use this to query AWS using the standard node.js http API
http.request(signed, function(res) { res.pipe(process.stdout) }).end()
