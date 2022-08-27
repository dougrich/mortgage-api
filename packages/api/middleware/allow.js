/**
 * Which methods to allow on the endpoint
 * @param  {...string} methods strings for each of the methods the endpoint should allow
 */
function allow (...methods) {
  return (req, res, next) => {
    for (const m of methods) {
      if (req.method === m) {
        next()
        return
      }
    }
    res.writeHead(405, { Allow: methods })
    res.end()
  }
}

module.exports = { allow }
