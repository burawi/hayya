const { parseResponseValue } = require('../../lib/parse-response-object')

describe('Parse response value', () => {
  it('Should return required', () => {
    const result = parseResponseValue('')
    expect(result).toEqual({ type: ['required'] })
  })

  it('Should return number', () => {
    const result = parseResponseValue('#')
    expect(result).toEqual({ type: ['required', 'float', 'nonString'] })
  })

  it('Should return number specific', () => {
    const result = parseResponseValue('#20')
    expect(result).toEqual({
      type: ['required', 'float', 'nonString'],
      min: 20,
      max: 20
    })
  })

  it('Should return string', () => {
    const result = parseResponseValue('*')
    expect(result).toEqual({ type: ['required', 'string'] })
  })

  it('Should return boolean', () => {
    const result = parseResponseValue('!')
    expect(result).toEqual({ type: ['required', 'boolean'] })
  })

  it('Should return true boolean', () => {
    const result = parseResponseValue('!+')
    expect(result).toEqual({ type: ['required', 'boolean'], value: true })
  })

  it('Should return false boolean', () => {
    const result = parseResponseValue('!-')
    expect(result).toEqual({ type: ['required', 'boolean'], value: false })
  })

  it('Should return object', () => {
    const result = parseResponseValue('{ age }')
    expect(result).toEqual({
      type: ['required', 'object'],
      schema: {
        age: { type: ['required'] }
      }
    })
  })

  it('Should return array', () => {
    const result = parseResponseValue('[ * ]')
    expect(result).toEqual({ type: ['required', 'array'], itemOptions: { type: ['required', 'string'] } })
  })

  it('Should return array with length', () => {
    const result = parseResponseValue('[*]5')
    expect(result).toEqual({
      type: ['required', 'array'],
      minItems: 5,
      maxItems: 5,
      itemOptions: { type: ['required', 'string'] }
    })
  })

  it('Should return enum', () => {
    const result = parseResponseValue('Salim')
    expect(result).toEqual({ type: ['required', 'enum'], values: ['Salim'] })
  })

  it('Should return enum from invalid number', () => {
    const result = parseResponseValue('#2d0')
    expect(result).toEqual({ type: ['required', 'enum'], values: ['#2d0'] })
  })

  it('Should return enum from invalid boolean', () => {
    const result = parseResponseValue('!d')
    expect(result).toEqual({ type: ['required', 'enum'], values: ['!d'] })
  })
})

describe('Parse response object', () => {
  it('Should return all valid schemas', () => {
    const input = '{ id: #, name: Younes, active: !, meta: { age }, comments: [*] }'
    const result = parseResponseValue(input)

    const expected = {
      type: ['required', 'object'],
      schema: {
        id: { type: ['required', 'float', 'nonString'] },
        name: { type: ['required', 'enum'], values: ['Younes'] },
        active: { type: ['required', 'boolean'] },
        meta: {
          type: ['required', 'object'],
          schema: {
            age: { type: ['required'] }
          }
        },
        comments: {
          type: ['required', 'array'],
          itemOptions: { type: ['required', 'string'] }
        }
      }
    }

    expect(result).toEqual(expected)
  })
})
