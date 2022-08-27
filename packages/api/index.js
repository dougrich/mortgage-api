const http = require('http')

const { combine } = require('./middleware/combine')
const { createCalculateEndpoint } = require('./endpoints/calculate')

const hostname = process.argv[2] || '127.0.0.1'
const port = process.argv[3] || 3000
const app = combine(
  createCalculateEndpoint(),
  (res) => {
    res.statusCode = 404
    res.setHeader('Content-Type', 'text/plain')
    res.end('not found')
  }
)
const server = http.createServer((req, res) => {
  try {
    app(req, res)
  } catch (err) {
    console.error(err)
    if (!res.statusCode) {
      res.statusCode = 500
      res.end('Internal Error')
    }
  }
})

console.log(`starting Mortgage calculator API at http://${hostname}:${port}/`)
server.listen(port, hostname, () => {
  console.log(`Mortgage calculator API running at http://${hostname}:${port}/`)
})
