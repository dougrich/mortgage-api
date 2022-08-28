/* eslint-env jest */
const { schema } = require('./')

const testSchemaNumberValue = {
  type: 'object',
  properties: {
    value: {
      type: 'integer',
      minimum: 1,
      maximum: 3
    }
  },
  required: ['value'],
  additionalProperties: false
}

test.each([
  [
    { value: 3 },
    testSchemaNumberValue,
    (_, __, next) => expect(next).toHaveBeenCalled()
  ],
  [
    null,
    testSchemaNumberValue,
    (_, res, next) => {
      expect(res.statusCode).toEqual(400)
      expect(res.end).toHaveBeenCalledWith(JSON.stringify({ subcode: 1, reason: 'missing request body' }))
      expect(next).not.toHaveBeenCalled()
    }
  ],
  [
    { value: 0 },
    testSchemaNumberValue,
    (_, res, next) => {
      expect(res.statusCode).toEqual(400)
      expect(res.end).toHaveBeenCalledWith(JSON.stringify({ subcode: 2, reason: 'invalid shape of request body' }))
      expect(next).not.toHaveBeenCalled()
    }
  ]
])('%p on schema(%p)', (paramRequest, paramSchema, resultExpectations) => {
  // arrange
  const middleware = schema(paramSchema)
  const req = {
    body: paramRequest
  }
  const res = {
    statusCode: 0,
    setHeader: jest.fn(),
    end: jest.fn()
  }
  const next = jest.fn()

  // act
  middleware(req, res, next)

  // assert
  resultExpectations(req, res, next)
})
