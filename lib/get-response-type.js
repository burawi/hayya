module.exports = (content) => {
  if (content.trim().startsWith('{') && content.trim().endsWith('}')) return 'object'
  if (content.trim().startsWith('[') && content.trim().endsWith(']')) return 'array'
  return 'enum'
}
