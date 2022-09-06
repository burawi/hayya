const JSON5 = require('json5')

const setRequest = (content, result) => {
  const testIndex = result.tests.length - 1
  const test = result.tests[testIndex]

  if (['GET', 'DELETE'].includes(test.method)) { throw Error('Cannot send body with GET and DELETE methods') }

  test.request = test.request ?? {}
  if (test.request.body) { throw Error('Body is already set') }

  if (content.startsWith('{') && content.endsWith('}')) {
    let json
    try {
      json = JSON5.parse(content)
    } catch (e) {
      throw Error('The provided JSON object is not valid')
    }
    test.request.headers = test.request.headers ?? {}
    test.request.headers['content-type'] = test.request.headers['content-type'] ?? 'application/json'
    test.request.body = json
  } else {
    test.request.headers = test.request.headers ?? {}
    test.request.headers['content-type'] = test.request.headers['content-type'] ?? 'text/plain'
    test.request.body = content
  }
}

module.exports = setRequest
