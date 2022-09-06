const setBase = (content, result) => {
  if (!content.trim()) throw Error('At least a port number should be provided')

  const localhosts = ['localhost', '127.0.0.1']
  if (result.base) throw Error('Base already set')

  if (/^:\d+$/.test(content)) {
    content = 'localhost' + content
  }

  if (!/^https*:\/\//.test(content)) {
    if (localhosts.some(host => content.startsWith(host))) {
      content = 'http://' + content
    } else {
      content = 'https://' + content
    }
  }

  let url
  try {
    url = new URL(content)
  } catch (e) {
    throw Error('Invalid URL')
  }

  if (localhosts.includes(url.host) && !url.port) {
    throw Error('Port number must be provided for local URLs')
  }

  result.base = content
}

module.exports = setBase
