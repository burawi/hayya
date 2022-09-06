const getLines = require('../../lib/get-lines')

const text = `
$ localhost:3000
POsT /create 
> { name: 'User', age: 20 }
< { id: # }

GET /make 400
`

it('Should split into lines', () => {
  const lines = getLines(text)
  expect(lines.length).toEqual(6)
})
