const getLineType = require('../../lib/get-line-type')

it('Should get base', () => {
  const base = getLineType('$ localhost')
  expect(base).toEqual('base')
})

it('Should get method', () => {
  const method = getLineType('-- / 404')
  expect(method).toEqual('method')
})

it('Should get method', () => {
  const method = getLineType('Post /')
  expect(method).toEqual('method')
})

it('Should get method', () => {
  const response = getLineType('/created')
  expect(response).toEqual('method')
})

it('Should get request', () => {
  const request = getLineType("> { name: 'm' }")
  expect(request).toEqual('request')
})

it('Should get request header', () => {
  const request = getLineType('>h ct json')
  expect(request).toEqual('requestHeader')
})

it('Should get response', () => {
  const response = getLineType("< 'created'")
  expect(response).toEqual('response')
})

it('Should get response header', () => {
  const request = getLineType('<h ct json')
  expect(request).toEqual('responseHeader')
})

it('Should get nothing', () => {
  const nothing = getLineType('')
  const spacedNothing = getLineType('   ')
  expect(nothing).toEqual('nothing')
  expect(spacedNothing).toEqual('nothing')
})

it('Should throw error', () => {
  expect(() => {
    getLineType('dfe sqf df')
  }).toThrow('Could not parse line')
})
