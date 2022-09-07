const setResponse = require('../../lib/set-response')

it('Should throw error body already set', () => {
  expect(() => {
    setResponse('{ name }', { tests: [{ response: { body: { name: 'D' } } }] })
  }).toThrow('Body is already set')
})

it('Should set a string body', () => {
  const result = { tests: [{ response: {} }] }
  setResponse('Success', result)
  expect(result.tests[0].response.headers['content-type']).toEqual('(text/plain|undefined)')
  expect(result.tests[0].response.body).toEqual({
    type: ['required', 'enum'],
    values: ['Success']
  })
})

it('Should set a JSON body', () => {
  const result = { tests: [{ response: {} }] }
  setResponse('{ id: #, name: samir, success: ! }', result)
  expect(result.tests[0].response.headers['content-type']).toEqual('application/json')
  expect(result.tests[0].response.body).toEqual({
    type: ['required', 'object'],
    schema: {
      id: { type: ['required', 'float', 'nonString'] },
      name: { type: ['required', 'enum'], values: ['samir'] },
      success: { type: ['required', 'boolean'] }
    }
  })
})

it('Should set an array body', () => {
  const result = { tests: [{ response: {} }] }
  setResponse('[ { name } ]', result)
  expect(result.tests[0].response.headers['content-type']).toEqual('application/json')
  expect(result.tests[0].response.body).toEqual({
    type: ['required', 'array'],
    itemOptions: {
      type: ['required', 'object'],
      schema: {
        name: { type: ['required'] }
      }
    }
  })
})
