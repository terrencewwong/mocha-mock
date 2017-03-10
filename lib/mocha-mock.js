const mocha = require('mocha')
const MockObject = require('./mock-object')

const {it, mock} = (function () {
  let mocks = []
  return {it, mock}

  function it (name, callback) {
    const test = () => {
      let promise = callback()
      if (!(promise instanceof Promise)) {
        promise = Promise.resolve(promise)
      }

      return promise
        .catch(error => error)
        .then(error => {
          let errors = error ? [error] : []

          const mockErrors = mocks
            .map(mockObject => {
              try {
                mockObject.verify()
              } catch (error) {
                return error
              }
            })
            .filter(error => error)

          errors = errors.concat(mockErrors)

          // reset the mocks
          mocks = []

          errors.forEach(error => {
            throw error
          })
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
