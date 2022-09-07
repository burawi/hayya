const getResponseType = require('./get-response-type')
const { parseResponseValue } = require('./parse-response-object')

const setResponse = (content, result) => {
  const testIndex = result.tests.length - 1
  const test = result.tests[testIndex]
  const type = getResponseType(content)

  test.response = test.response ?? {}

  if (test.response.body) { throw Error('Body is already set') }

  test.response.body = parseResponseValue(content.trim())

  if (['object', 'array'].includes(type)) {
    test.response.headers = test.response.headers ?? {}
    test.response.headers['content-type'] = test.response.headers['content-type'] ?? 'application/json'
  } else {
    test.response.headers = test.response.headers ?? {}
    test.response.headers['content-type'] = test.response.headers['content-type'] ?? '(text/plain|undefined)'
  }
}

module.exports = setResponse
