const expect = require('expect')
const {it, mock} = require('./')

let mocked
describe('mocha-mock', () => {
  it('wraps around mochas it', () => {
    expect(true).toBe(true)
  })

  it('verifies expectations on mocks automatically', () => {
    mocked = mock({func: () => 'func'})
      .shouldReceive('func')
      .once()
    // only way I can think of to test this is by making sure the
    // following line prevents that an error is thrown
    mocked.func()
  })

  // also a shitty way to test this since it depends on the
  // mock I created in the previous test
  it('clears mocks from previous tests', () => {
    // basically this will fail if we did not clear the mock
    // because in the previous test we declared that mock.func
    // should only execute once
    mocked.func()
  })
})
