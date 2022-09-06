const parseText = require('../../lib/parser')

const text = `
$ localhost:3000
POsT /create 
> { name: 'User', age: 20 }
>h X-POINT something
< { id: # }
<h auth Bearer

GET /make 400
<h ct html
`

const expected = {
  base: 'http://localhost:3000',
  tests: [
    {
      url: '/create',
      method: 'POST',
      request: {
        body: { name: 'User', age: 20 },
        headers: {
          'content-type': 'application/json',
          'x-point': 'something'
        }
      },
      response: {
        statusCode: 200,
        headers: {
          'content-type': 'application/json',
          authorization: 'Bearer'
        },
        body: {
          type: ['required', 'object'],
          schema: {
            id: {
              type: ['required', 'float', 'nonString']
            }
          }
        }
      }
    },
    {
      url: '/make',
      method: 'GET',
      response: {
        statusCode: 400,
        headers: {
          'content-type': 'text/html'
        }
      }
    }
  ]
}

describe('Should parse the entire text', () => {
  it('Should parse without errors', () => {
    const parsed = parseText(text)
    expect(parsed).toEqual(expected)
  })
})
