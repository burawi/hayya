const setRequest = require('../../lib/set-request')

it('Should throw error body with GET and DELETE', () => {
  expect(() => {
    setRequest("{ name: 'User' }", { tests: [{ method: 'GET' }] })
  }).toThrow('Cannot send body with GET and DELETE methods')
  expect(() => {
    setRequest("{ name: 'User' }", { tests: [{ method: 'DELETE' }] })
  }).toThrow('Cannot send body with GET and DELETE methods')
})
it('Should throw error body already set', () => {
  expect(() => {
    setRequest("{ name: 'User' }", { tests: [{ request: { body: { name: 'D' } } }] })
  }).toThrow('Body is already set')
})
it('Should set a string body', () => {
  const result = { tests: [{ request: {} }] }
  setRequest('Success', result)
  expect(result.tests[0].request.headers['content-type']).toEqual('text/plain')
  expect(result.tests[0].request.body).toEqual('Success')
})
it('Should set a JSON body', () => {
  const result = { tests: [{ request: {} }] }
  setRequest('{ name: "User" }', result)
  expect(result.tests[0].request.headers['content-type']).toEqual('application/json')
  expect(result.tests[0].request.body).toEqual({ name: 'User' })
})
it('Should throw error body already set', () => {
  expect(() => {
    setRequest('{ name }', { tests: [{ method: 'POST' }] })
  }).toThrow('The provided JSON object is not valid')
})
