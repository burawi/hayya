const tatabot = require('tatabot')
const colors = require('colors')
const axios = require('axios')

tatabot.addType('boolean', {
  coerce: (value) => value,
  validate: (value, options) => {
    const result = []
    if (typeof value !== 'boolean') result.push(`${value} is not a boolean`)
    if (options.value === null || options.value === undefined) return result
    if (options.value !== value) result.push(`${value} is different from ${options.value}`)
    return result
  }
})

tatabot.addType('nonString', {
  coerce: (value) => value,
  validate: (value) => typeof value === 'string' ? [`${value} is a string`] : []
})

const broadcast = (message, channel, depth = 0) => {
  if (channel) {
    const tabs = new Array(depth).fill(1).map(() => '  ').join('')
    channel.write(`${tabs}${message}\n`)
  }
}

const broadcastInfo = (message, channel, depth) => {
  broadcast(`${colors.blue('=>')} ${message}`, channel, depth)
}

const broadcastSuccess = (message, channel, depth) => {
  broadcast(`${colors.green('✓')} ${message}`, channel, depth)
}

const broadcastError = (message, channel, depth) => {
  broadcast(`${colors.red('✗')} ${message}`, channel, depth)
}

const run = async (parsed, channel) => {
  const report = {
    tests: [],
    testsCount: { failed: 0, succeeded: 0 },
    assertionsCount: { failed: 0, succeeded: 0 }
  }

  broadcast(`${colors.bold('HAYYA')}: 🏁 Starting tests`, channel)

  broadcast(' ', channel)

  broadcast(`All URLs will be prefixed by: ${colors.yellow(parsed.base)}`, channel)

  for (let i = 0; i < parsed.tests.length; i++) {
    const test = parsed.tests[i]
    const options = {
      baseURL: parsed.base,
      url: test.url.replace(/^\//, ''),
      method: test.method,
      ...(test.request?.body ? { data: test.request.body } : {}),
      responseType: 'text',
      ...(test.request?.headers ? { headers: test.request?.headers } : {})
    }

    const testReport = {
      success: true,
      url: test.url,
      method: test.method,
      'Request Headers': test.request?.headers,
      response: {
        statusCode: {
          expected: test.response.statusCode
        },
        headers: {}
      }
    }

    broadcast(' ', channel)
    broadcastInfo(`Testing new URL: ${colors.yellow(testReport.url)}`, channel, 1)
    broadcastInfo(`Method: ${colors.yellow(testReport.method)}`, channel, 2)
    if (testReport['Request Headers']) {
      broadcastInfo('Request headers:', channel, 2)
      Object.entries(testReport['Request Headers']).forEach(([key, value]) => {
        broadcastInfo(`${key}: ${value}`, channel, 3)
      })
    } else {
      broadcastInfo('No request headers have been provided for this test', channel, 2)
    }

    Object.entries(test.response.headers ?? {}).forEach(([key, expected]) => {
      testReport.response.headers[key] = {
        expected
      }
    })

    let response
    try {
      response = await axios(options)
    } catch (e) {
      response = e.response
    }

    broadcastInfo('Response received', channel, 2)

    testReport.response.statusCode.received = response.status

    Object.entries(response.headers).forEach(([key, received]) => {
      if (testReport.response.headers[key]) {
        testReport.response.headers[key].received = received
      }
    })

    if (testReport.response.statusCode.expected === testReport.response.statusCode.received) {
      report.assertionsCount.succeeded++
    } else {
      report.assertionsCount.failed++
      testReport.success = false
    }

    const statusCodeColor = testReport.success ? colors.green : colors.red
    const expectedSC = testReport.response.statusCode.expected
    const receivedSC = testReport.response.statusCode.received
    const statusCodeMessage = `Status code: expected ${expectedSC}, received ${statusCodeColor(receivedSC)}`
    if (testReport.success) {
      broadcastSuccess(statusCodeMessage, channel, 3)
    } else {
      broadcastError(statusCodeMessage, channel, 3)
    }

    if (Object.keys(testReport.response.headers).length) {
      broadcastInfo('Response Headers:', channel, 3)
      Object.entries(testReport.response.headers).forEach(([key, { expected, received }]) => {
        let color
        let fn
        if (new RegExp(expected).test(received)) {
          report.assertionsCount.succeeded++
          color = colors.green
          fn = broadcastSuccess
        } else {
          report.assertionsCount.failed++
          testReport.success = false
          color = colors.red
          fn = broadcastError
        }
        const message = `${key}: expected ${colors.italic(expected)}, received ${color(received)}`
        fn(message, channel, 4)
      })
    }

    let responseBody = response.data

    if (typeof responseBody === 'string') {
      responseBody = `"${responseBody.replaceAll('\\', '\\\\').replaceAll('"', '\\"').replaceAll('\n', ' ')}"`
    } else {
      responseBody = JSON.stringify(responseBody)
    }

    const validatableBody = JSON.parse(`{ "body": ${responseBody} }`)

    const bodySchema = { body: test.response.body }
    const { isValid, errors } = tatabot.validate(validatableBody, bodySchema)
    testReport.response.body = {
      isValid,
      errors
    }

    if (isValid) {
      broadcastSuccess('Body is matching schema', channel, 3)
    } else {
      broadcastError('Body validation returns the following errors', channel, 3)
      errors.forEach(error => {
        broadcastError(error, channel, 4)
      })
      testReport.success = false
    }

    if (testReport.success) {
      broadcastSuccess('Test worked as expected', channel, 2)
      report.testsCount.succeeded++
    } else {
      broadcastError('Test did not work as expected', channel, 2)
      report.testsCount.failed++
    }

    report.tests.push(testReport)
  }

  broadcast(' ', channel)
  broadcast(`${colors.bold('Summary')}`, channel)

  const getInFailColor = (n) => n ? colors.red(n) : colors.green(n)
  const getInSuccessColor = (n) => n ? colors.green(n) : colors.red(n)
  broadcast(`Tests: ${getInSuccessColor(report.testsCount.succeeded)} Successes, ${getInFailColor(report.testsCount.failed)} Failures`, channel, 2)
  broadcast(`Assertions: ${getInSuccessColor(report.assertionsCount.succeeded)} Successes, ${getInFailColor(report.assertionsCount.failed)} Failures`, channel, 2)
  broadcast('', channel)
  broadcast(`${colors.italic('(Assertions in response bodies are not counted)')}`, channel, 2)

  return report
}

module.exports = run
