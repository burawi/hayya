const getResponseType = require('../../lib/get-response-type')

it('Should return object', () => {
  const result = getResponseType('{ name }')
  expect(result).toEqual('object')
})

it('Should return array', () => {
  const result = getResponseType('[ { name } ]')
  expect(result).toEqual('array')
})

it('Should return string', () => {
  const result = getResponseType('name')
  expect(result).toEqual('enum')
})
