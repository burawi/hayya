const fs = require('fs')
const path = require('path')

const run = require('../../lib/run')
const parseText = require('../../lib/parser')

const tests = [
  { msg: 'Should return all good', config: 'configAllGood', expected: 'expectedAllGood.json' },
  { msg: 'Should return length error', config: 'configLengthError', expected: 'expectedLengthError.json' }
]

for (let i = 0; i < tests.length; i++) {
  const { msg, config, expected } = tests[i]
  const configTxt = fs.readFileSync(path.resolve(__dirname, config), 'utf-8')
  const expectedObject = require(path.resolve(__dirname, expected))
  const parsed = parseText(configTxt)
  it(msg, async () => {
    const report = JSON.parse(JSON.stringify(await run(parsed)))
    expect(report).toEqual(expectedObject)
  })
}
