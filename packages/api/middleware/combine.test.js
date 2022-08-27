/* eslint-env jest */
const { combine } = require('./combine')

test('combine fallthrough', () => {
  // arrange
  const inputRequest = {}
  const inputResponse = {
    visited: []
  }
  const one = jest.fn((req, res, next) => {
    expect(req).toEqual(inputRequest)
    expect(res).toEqual(inputResponse)
    res.visited.push('one')
    next()
  })
  const two = jest.fn((req, res, next) => {
    expect(req).toEqual(inputRequest)
    expect(res).toEqual(inputResponse)
    res.visited.push('two')
    next()
  })
  const rollup = combine(
    one,
    two
  )
  const next = jest.fn(() => {
    expect(inputResponse.visited).toEqual(['one', 'two'])
  })

  // act
  rollup(inputRequest, inputResponse, next)

  // assert
  expect(one).toHaveBeenCalledWith(inputRequest, inputResponse, expect.any(Function))
  expect(two).toHaveBeenCalledWith(inputRequest, inputResponse, expect.any(Function))
  expect(next).toHaveBeenCalledWith()
})
