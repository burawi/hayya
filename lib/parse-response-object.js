function parseResponseValue (value) {
  const result = { type: ['required'] }

  const trimed = value.trim()

  if (!trimed) return result

  if (trimed.startsWith('#')) {
    const trailing = trimed.substring(1)
    const isNumber = trailing && !isNaN(trailing)
    const isValid = !trailing || isNumber
    if (isValid) {
      const specific = parseFloat(trailing)
      return {
        type: [...result.type, 'float', 'nonString'],
        ...(isNumber ? { min: specific, max: specific } : {})
      }
    }
  }

  if (trimed === '*') {
    return {
      type: [...result.type, 'string']
    }
  }

  if (trimed.startsWith('!')) {
    const trailing = trimed.substring(1)
    const values = { '+': true, '-': false }
    if (!trailing || Object.keys(values).includes(trailing)) {
      return {
        type: [...result.type, 'boolean'],
        ...(trailing ? { value: values[trailing] } : {})
      }
    }
  }

  const arrayEnding = /](\d*)$/
  if (trimed.startsWith('[') && arrayEnding.test(trimed)) {
    const [, length] = trimed.match(arrayEnding)
    const arrayContent = trimed.substring(1).replace(arrayEnding, '')
    return {
      type: [...result.type, 'array'],
      ...(length ? { minItems: +length, maxItems: +length } : {}),
      itemOptions: parseResponseValue(arrayContent)
    }
  }

  if (trimed.startsWith('{') && trimed.endsWith('}')) {
    const objectContent = trimed.substring(1).slice(0, -1)
    return {
      type: [...result.type, 'object'],
      schema: parseResponseObject(objectContent)
    }
  }

  return {
    type: [...result.type, 'enum'],
    values: [trimed]
  }
}

function parseResponseObject (content, type) {
  const parts = content.trim().split(',')

  const result = parts.reduce((final, part) => {
    const [key, ...contentArr] = part.trim().split(':')
    const content = contentArr.join(':')
    return {
      ...final,
      [key]: parseResponseValue(content)
    }
  }, {})

  return result
}

module.exports = { parseResponseObject, parseResponseValue }
