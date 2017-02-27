const mocha = require('mocha')
const MockObject = require('./mock-object')

const {it, mock} = (function () {
  let mocks = []
  return {it, mock}

  function it (name, callback) {
    const test = () => {
      callback()
      const errors = mocks
        .map(mockObject => {
          try {
            mockObject.verify()
          } catch (error) {
            return error
          }
        })
        .filter(error => error)

      // reset the mocks
      mocks = []

      errors.forEach(error => {
        throw error
      })
    }

    return mocha.it(name, test)
  }

  function mock (object) {
    const mockObject = new MockObject(object)
    mocks.push(mockObject)
    return mockObject
  }
})()

module.exports = {it, mock}
