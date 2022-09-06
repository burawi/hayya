const setBase = require('../../lib/set-base')

it('Should return error base already set', () => {
  expect(() => {
    setBase('localhost:3000', { base: 'http://something.com' })
  }).toThrow('Base already set')
})
it('Should return error invalid entry', () => {
  expect(() => {
    setBase('localhos%$:/dft3000', { })
  }).toThrow('Invalid URL')
})
it('Should return error no port provided', () => {
  expect(() => {
    setBase('localhost', { })
  }).toThrow('Port number must be provided for local URLs')
})
it('Should return error no entry provided', () => {
  expect(() => {
    setBase('', { })
  }).toThrow('At least a port number should be provided')
})
it('Should fill protocol with HTTP', () => {
  const result1 = {}
  const result2 = {}
  setBase('localhost:4000', result1)
  setBase('127.0.0.1:4000', result2)
  expect(result1.base).toEqual('http://localhost:4000')
  expect(result2.base).toEqual('http://127.0.0.1:4000')
})
it('Should fill protocol with HTTPS', () => {
  const result = {}
  setBase('www.google.com', result)
  expect(result.base).toEqual('https://www.google.com')
})
it('Should fill origing with localhost', () => {
  const result = {}
  setBase(':5005', result)
  expect(result.base).toEqual('http://localhost:5005')
})
