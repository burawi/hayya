const getLineContent = line => {
  if (line.startsWith('/')) return line

  const [, ...content] = line.trim().split(' ')
  return content.join(' ')
}

module.exports = getLineContent
