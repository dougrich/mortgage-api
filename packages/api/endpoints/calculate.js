const bodyparser = require('body-parser')

const { allow, schema, combine } = require('../middleware')
const calculateSchema = require('./calculate.schema.json')

/**
 * Creates a calculate endpoint middleware
 * @returns {Middleware}
 */
function createCalculateEndpoint () {
  return combine(
    allow('POST'),
    bodyparser.json(),
    schema(calculateSchema),
    (_, res, __) => {
      res.status(200).json({ payment: 1454.01 })
    }
  )
}

module.exports = { createCalculateEndpoint }
