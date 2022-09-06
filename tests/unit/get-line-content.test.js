const getLineContent = require('../../lib/get-line-content')

it('Should get from non spaced', () => {
  const content = getLineContent('$ localhost')
  expect(content).toEqual('localhost')
})

it('Should get from non defined method', () => {
  const content = getLineContent('/create 200')
  expect(content).toEqual('/create 200')
})

it('Should get from spaced content', () => {
  const content = getLineContent('Post / 400')
  expect(content).toEqual('/ 400')
})

it('Should get from non existent content', () => {
  const content = getLineContent('>')
  expect(content).toEqual('')
})

it('Should get from nothing', () => {
  const content = getLineContent('')
  expect(content).toEqual('')
})
