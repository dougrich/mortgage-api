/* eslint-env jest */
const { allow } = require('./')

test.each([
  [
    'POST',
    ['POST', 'GET'],
    (_, __, next) => expect(next).toHaveBeenCalled()
  ],
  [
    'POST',
    ['GET'],
    (_, res, next) => {
      expect(res.writeHead).toHaveBeenCalledWith(405, { Allow: ['GET'] })
      expect(next).not.toHaveBeenCalled()
    }
  ]
])('%s on allow(...%p)', (paramMethod, paramAllow, resultExpectations) => {
  // arrange
  const middleware = allow(...paramAllow)
  const req = {
    method: paramMethod
  }
  const res = {
    writeHead: jest.fn(),
    end: jest.fn()
  }
  const next = jest.fn()

  // act
  middleware(req, res, next)

  // assert
  resultExpectations(req, res, next)
})
