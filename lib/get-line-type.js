const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
const getLineType = line => {
  const [command] = line.trim().split(' ')
  if (
    methods.includes(command.toUpperCase()) ||
    command.startsWith('/') ||
    command.startsWith('--')
  ) return 'method'
  if (command === '$') return 'base'
  if (command === '>') return 'request'
  if (command === '>h') return 'requestHeader'
  if (command === '<') return 'response'
  if (command === '<h') return 'responseHeader'
  if (command === '') return 'nothing'
  throw Error('Could not parse line')
}

module.exports = getLineType
