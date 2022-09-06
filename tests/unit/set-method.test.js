const setMethod = require('../../lib/set-method')

it('Should set method to uppercase', () => {
  const result = {}
  setMethod('PosT /create', result)
  expect(result.tests[0].method).toEqual('POST')
})

it('Should set method to GET when not defined', () => {
  const result = {}
  setMethod('/create 200', result)
  expect(result.tests[0].method).toEqual('GET')
})

it('Should set method to GET and status code to 200', () => {
  const result = {}
  setMethod('/create', result)
  expect(result.tests[0].method).toEqual('GET')
  expect(result.tests[0].response.statusCode).toEqual(200)
})

it('Should set method to previous method', () => {
  const result = { tests: [{ method: 'POST' }] }
  setMethod('-- /create 200', result)
  expect(result.tests[1].method).toEqual('POST')
})

it('Should throw no previous method found', () => {
  expect(() => {
    setMethod('-- /something 200', {})
  }).toThrow('No previous method found')
})

it('Should set path', () => {
  const result = {}
  setMethod('PosT /create', result)
  expect(result.tests[0].url).toEqual('/create')
})

it('Should fallback path to /', () => {
  const result = {}
  setMethod('PosT ', result)
  expect(result.tests[0].url).toEqual('/')
})

it('Should fallback status code to 200', () => {
  const result = {}
  setMethod('PosT /create', result)
  expect(result.tests[0].url).toEqual('/create')
})

it('Should set status code to 400', () => {
  const result = {}
  setMethod('PosT /create 400', result)
  expect(result.tests[0].response.statusCode).toEqual(400)
})

it('Should throw status code is out of range', () => {
  expect(() => {
    setMethod('PosT /create 09', {})
  }).toThrow('Status code is out of range')
  expect(() => {
    setMethod('PosT /create 600', {})
  }).toThrow('Status code is out of range')
})

it('Should throw status code is not a valid number', () => {
  expect(() => {
    setMethod('PosT /create dfq', {})
  }).toThrow('Status code is not a valid number')
})
