/* eslint-env jest */
const { createCalculateEndpoint } = require('./calculate')

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
      payment: 1454.01
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
