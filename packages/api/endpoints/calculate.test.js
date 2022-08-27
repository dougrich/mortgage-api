/* eslint-env jest */
const { createCalculateEndpoint, getMortgagePaymentParameters, calcPMT } = require('./calculate')

test.each([
  [
    'POST',
    {
      propertyPrice: 500000,
      downPayment: 100000,
      annualInterestRate: 0.05,
      amoritizationPeriod: 25,
      paymentSchedule: 'accelerated-biweekly'
    },
    200,
    {
      payment: 1078.6364768725948
    }
  ]
])('createCalculateEndpoint %s %p -> response of %i %p', (paramMethod, paramBody, expectedStatus, expectedResponse) => {
  // arrange
  const endpoint = createCalculateEndpoint()
  const request = {
    method: paramMethod,
    body: paramBody,
    _body: true // indicates to bodyparser that we already have a body
  }
  const response = {
    status: jest.fn(() => response),
    json: jest.fn(() => response)
  }
  const next = jest.fn()

  // act
  endpoint(request, response, next)

  // assert
  expect(response.status).toHaveBeenCalledWith(expectedStatus)
  expect(response.json).toHaveBeenCalledWith(expectedResponse)
})

// note: the numbers for testing come from the PMT function google calendar
test.each([
  [
    500000,
    (0.05 / 12),
    300,
    2922.950207539901
  ]
])('calcPMT(%i, %i, %i) -> %i', (principle, perPaymentInterestRate, numPayments, expectedPayment) => {
  expect(calcPMT({
    principle,
    perPaymentInterestRate,
    numPayments
  })).toEqual(expectedPayment)
})

test.each([
  [
    // input
    500000,
    120000,
    0.06,
    25,
    'monthly',
    // output
    380000,
    0.005,
    300
  ],
  [
    // input
    500000,
    120000,
    0.06,
    25,
    'biweekly',
    // output
    380000,
    0.0025,
    600
  ],
  [
    // input
    500000,
    120000,
    0.06,
    25,
    'accelerated-biweekly',
    // output
    380000,
    0.0023076923076923075,
    650
  ]
])('getMortgagePaymentParameters(%i, %i, %i, %i, %s) - {%i, %i, %i}', (
  propertyPrice,
  downPayment,
  annualInterestRate,
  amoritizationPeriod,
  paymentSchedule,
  principle,
  perPaymentInterestRate,
  numPayments
) => {
  expect(getMortgagePaymentParameters({
    propertyPrice,
    downPayment,
    annualInterestRate,
    amoritizationPeriod,
    paymentSchedule
  })).toEqual({
    principle,
    perPaymentInterestRate,
    numPayments
  })
})

test('getMortgatePaymentParameters fails on unsupported payment plan', () => {
  expect(() => getMortgagePaymentParameters({
    propertyPrice: 500,
    downPayment: 120,
    annualInterestRate: 0.05,
    amoritizationPeriod: 25,
    paymentSchedule: 'this is garbage!'
  })).toThrow('missing payment plan schedule')
})
