const setHeader = require('../../lib/set-header')

it('Should throw no value provided', () => {
  expect(() => {
    setHeader('ct', {}, 'request')
  }).toThrow('No value provided for the header')
})

it('Should throw no type provided', () => {
  expect(() => {
    setHeader('ct json', {})
  }).toThrow('Invalid argument type')
})

it('Should set content type json', () => {
  const result = { tests: [{}] }
  setHeader('ct json', result, 'request')
  expect(result.tests[0].request.headers['content-type']).toEqual('application/json')
})

it('Should set content type html', () => {
  const result = { tests: [{}] }
  setHeader('ct html', result, 'response')
  expect(result.tests[0].response.headers['content-type']).toEqual('text/html')
})

it('Should set authorization', () => {
  const result = { tests: [{}] }
  setHeader('auth Bearer', result, 'response')
  expect(result.tests[0].response.headers.authorization).toEqual('Bearer')
})

it('Should set accept language', () => {
  const result = { tests: [{}] }
  setHeader('lang Fr-fr', result, 'response')
  expect(result.tests[0].response.headers['accept-language']).toEqual('Fr-fr')
})

it('Should set cache control', () => {
  const result = { tests: [{}] }
  setHeader('cc no-store', result, 'response')
  expect(result.tests[0].response.headers['cache-control']).toEqual('no-store')
})

it('Should set content encoding', () => {
  const result = { tests: [{}] }
  setHeader('ce gzip', result, 'response')
  expect(result.tests[0].response.headers['content-encoding']).toEqual('gzip')
})

it('Should set access control allow headers', () => {
  const result = { tests: [{}] }
  setHeader('ah X-PINGOTHER, Content-Type', result, 'response')
  expect(result.tests[0].response.headers['access-control-allow-headers']).toEqual('X-PINGOTHER, Content-Type')
})

it('Should set access control allow method', () => {
  const result = { tests: [{}] }
  setHeader('am POST, GET, OPTIONS', result, 'response')
  expect(result.tests[0].response.headers['access-control-allow-methods']).toEqual('POST, GET, OPTIONS')
})

it('Should set access control allow origin', () => {
  const result = { tests: [{}] }
  setHeader('ao https://foo.example', result, 'response')
  expect(result.tests[0].response.headers['access-control-allow-origin']).toEqual('https://foo.example')
})

it('Should set X-POINT', () => {
  const result = { tests: [{}] }
  setHeader('X-POINT something', result, 'response')
  expect(result.tests[0].response.headers['x-point']).toEqual('something')
})
