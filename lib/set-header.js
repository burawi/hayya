const shorthands = {
  ct: 'content-type',
  auth: 'authorization',
  lang: 'accept-language',
  cc: 'cache-control',
  ce: 'content-encoding',
  ah: 'access-control-allow-headers',
  am: 'access-control-allow-methods',
  ao: 'access-control-allow-origin'
}

const valuesShorthands = {
  ct: {
    json: 'application/json',
    html: 'text/html',
    text: 'text/plain'
  }
}

const setHeader = (content, result, type) => {
  const [key, ...valueArr] = content.trim().split(' ')
  const value = valueArr.join(' ')

  if (!value) throw Error('No value provided for the header')
  if (!['request', 'response'].includes(type)) throw Error('Invalid argument type')

  const testIndex = result.tests.length - 1
  const test = result.tests[testIndex]

  const propKey = shorthands[key] ?? key.toLowerCase()
  const propValue = valuesShorthands[key]?.[value] ?? value

  test[type] = test[type] ?? {}
  test[type].headers = test[type].headers ?? {}
  test[type].headers[propKey] = propValue
}

module.exports = setHeader
