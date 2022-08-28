const Ajv = require('ajv')

/**
 * Schema middleware; creates middleware that checks the body against a JSON schema
 * @param {object} schema
 * @param {?function} additionalVerification optional extra validation logic
 * @returns {Middleware}
 */
function schema (schema, additionalVerification) {
  const ajv = new Ajv()
  ajv.addKeyword('version')
  const validate = ajv.compile(schema)
  return (req, res, next) => {
    if (!req.body) {
      // developer note:
      // make sure a bodyparser is registered before this one in the middleware chain
      // otherwise, the body will always be null & 400s will be returned
      res.statusCode = 400
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({
        subcode: 1,
        reason: 'missing request body'
      }))
      return
    }

    const valid = validate(req.body)
    if (!valid) {
      res.statusCode = 400
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({
        subcode: 2,
        reason: 'invalid shape of request body'
      }))
      return
    }

    if (additionalVerification && !additionalVerification(req.body)) {
      res.statusCode = 400
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({
        subcode: 3,
        reason: 'invalid request body'
      }))
      return
    }

    next()
  }
}

module.exports = { schema }
