const bodyparser = require('body-parser')

const { allow, schema, combine } = require('../middleware')
const calculateSchema = require('./calculate.schema.json')

const paymentScheduleBreakdown = {
  monthly: 12,
  biweekly: 24,
  'accelerated-biweekly': 26
}

/**
 * Gets the parameters for PMT from the mortgage inputs
 * @param {object} parameters named parameters
 * @returns the principle, per payment interest rate, and number of payments over the lifetime of the mortgage
 */
function getMortgagePaymentParameters ({
  propertyPrice,
  downPayment,
  annualInterestRate,
  amoritizationPeriod,
  paymentSchedule
}) {
  const principle = propertyPrice - downPayment
  const perAnnumPayments = paymentScheduleBreakdown[paymentSchedule]
  if (!perAnnumPayments) {
    throw new Error('missing payment plan schedule')
  }
  const perPaymentInterestRate = annualInterestRate / perAnnumPayments
  const numPayments = amoritizationPeriod * perAnnumPayments
  return {
    principle,
    perPaymentInterestRate,
    numPayments
  }
}

/**
 * Calculates loan payment for a given rate - equivalent to PMT in google sheets / excel
 * @param {object} parameters the named parameters for a loan payment rate
 * @returns the expected payment per period
 */
function calcPMT ({
  principle: P,
  perPaymentInterestRate: r,
  numPayments: n
}) {
  const rn = Math.pow((1 + r), n)
  const nom = r * rn
  const denom = rn - 1
  return P * (nom / denom)
}

/**
 * Creates a calculate endpoint middleware
 * @returns {Middleware}
 */
function createCalculateEndpoint () {
  return combine(
    allow('POST'),
    bodyparser.json(),
    schema(calculateSchema),
    (req, res) => {
      const paramPMT = getMortgagePaymentParameters(req.body)
      const payment = calcPMT(paramPMT)
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ payment }))
    }
  )
}

module.exports = {
  createCalculateEndpoint,
  getMortgagePaymentParameters,
  calcPMT
}
