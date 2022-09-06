const getLines = require('./get-lines')
const getLineType = require('./get-line-type')
const getLineContent = require('./get-line-content')
const setBase = require('./set-base')
const setMethod = require('./set-method')
const setRequest = require('./set-request')
const setResponse = require('./set-response')
const setHeader = require('./set-header')

const parseText = (text) => {
  const lines = getLines(text)
  const parsed = {}

  lines.forEach(line => {
    const lineType = getLineType(line)
    if (lineType === 'nothing') return

    if (lineType === 'method') return setMethod(line, parsed)

    const lineContent = getLineContent(line)
    if (lineType === 'base') return setBase(lineContent, parsed)

    if (lineType === 'request') return setRequest(lineContent, parsed)
    if (lineType === 'requestHeader') return setHeader(lineContent, parsed, 'request')

    if (lineType === 'response') return setResponse(lineContent, parsed)
    if (lineType === 'responseHeader') return setHeader(lineContent, parsed, 'response')
  })

  return parsed
}

module.exports = parseText
