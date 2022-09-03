const text = `
$ localhost:3000
POsT /create 
> { name: 'User', age: 20 }
< { id: '*' }

GET /make 400
`

const expected = {
  base: "http://localhost:3000",
  tests: [
    {
      url: "/create",
      method: "POST",
      request: {
        body: { name: 'User', age: 20 }
      },
      response: {
        statusCode: 200
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          id: (value) => value
        }
      }
    },
    {
      url: "/make",
      method: "GET",
      response: {
        statusCode: 400
      }
    }
  ]
}

it("Should split into lines", () => {
  const lines = getLines(text);
  expect(lines.length).toBeEqual(6)
})
