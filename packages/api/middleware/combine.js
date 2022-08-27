/**
 * @typedef Middleware
 * @type {function}
 * @param {object} request object
 * @param {object} response object
 * @param {function} next continuation function
 */

/**
 * Combines a set of middleware into a single middleware
 * @param {...Middleware} middleware functions which are rolled up into a single middleware function
 * @returns {Middleware} middleware function which runs through all the middleware
 */
function combine (...middleware) {
  return middleware.reduce((currentMiddleware, nextMiddleware) => {
    return (req, res, next) => {
      currentMiddleware(req, res, () => nextMiddleware(req, res, next))
    }
  }, (_, __, next) => next())
}

module.exports = { combine }
