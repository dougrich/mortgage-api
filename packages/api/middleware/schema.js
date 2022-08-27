const Ajv = require('ajv')

function schema (schema) {
  const ajv = new Ajv()
  const validate = ajv.compile(schema)
  return (req, res, next) => {
    if (!req.body) {
      // developer note:
      // make sure a bodyparser is registered before this one in the middleware chain
      // otherwise, the body will always be null & 400s will be returned
      res.status(400).json({
        subcode: 1,
        reason: 'missing request body'
      })
      return
    }

    const valid = validate(req.body)
    if (!valid) {
      res.status(400).json({
        subcode: 2,
        reason: 'invalid request body'
      })
      return
    }

    next()
  }
}

module.exports = { schema }
