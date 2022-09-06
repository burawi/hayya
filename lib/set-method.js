const setMethod = (line, result) => {
  result.tests = result.tests ?? []
  result.tests.push({})

  const testIndex = result.tests.length - 1

  let [method, path = '/', statusCode = 200] = line.trim().split(' ')

  if (method.startsWith('/')) {
    if (!isNaN(path)) statusCode = path
    path = method
    method = 'GET'
  }

  if (method === '--') {
    if (!testIndex) throw Error('No previous method found')
    method = result.tests[testIndex - 1].method
  }

  if (isNaN(statusCode)) throw Error('Status code is not a valid number')

  statusCode = parseInt(statusCode)
  if (statusCode > 599 || statusCode < 100) {
    throw Error('Status code is out of range')
  }

  result.tests[testIndex].method = method.toUpperCase()

  result.tests[testIndex].url = path

  result.tests[testIndex].response = {
    ...result.tests[testIndex].response,
    statusCode
  }
}

module.exports = setMethod
