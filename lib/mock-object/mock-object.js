class MockObject {
  constructor (object) {
    object = object || {}
    this.stats = {}
    this.expectations = []
    this.currentMethod = null

    const constructor = object.constructor
    let keys = Object.getOwnPropertyNames(object)
    keys = constructor !== Object
      ? keys.concat(Object.getOwnPropertyNames(constructor.prototype))
      : keys

    keys.forEach(key => {
      if (typeof object[key] === 'function') {
        this._initializeStats(key)
        this._mockMethod(key)
      } else {
        this[key] = object[key]
      }
    })
  }

  shouldReceive (method) {
    this.currentMethod = method
    this._expectMethodIsCalled(method)
    return this
  }

  once () {
    return this.times(1)
  }

  twice () {
    return this.times(2)
  }

  times (n) {
    const method = this.currentMethod
    const expectation = {
      failMessage: () => {
        const callCount = this.stats[method].callCount
        return `Mock received ${method} ${callCount} time(s). Should have received ${method} ${n} times.`
      },
      execute: () => {
        return this.stats[method].callCount === n
      }
    }
    this.expectations.push(expectation)
    return this
  }

  andReturn (value) {
    const method = this.currentMethod
    const original = this[method]
    this[method] = () => {
      original()
      return value
    }
    return this
  }

  with (...args) {
    const method = this.currentMethod
    const expectation = {
      failMessage: () => {
        const calledArgs = this.stats[method].args
        return `Expected ${method} to be called with ${args}. Got ${JSON.stringify(calledArgs)}`
      },
      execute: () => {
        const calledArgs = this.stats[method].args
        const sameNumberOfArgs = calledArgs.length === args.length
        const matchingArgs = calledArgs.every((arg, index) => {
          return arg === args[index]
        })

        return sameNumberOfArgs && matchingArgs
      }
    }
    this.expectations.push(expectation)

    return this
  }

  verify () {
    return this.expectations.every(expectation => {
      if (expectation.execute()) {
        return true
      }
      const failMessage = expectation.failMessage
      const message = typeof failMessage === 'function' ? failMessage() : failMessage
      throw new Error(message)
    })
  }

  _initializeStats (method) {
    this.stats[method] = {
      callCount: 0
    }
  }

  _expectMethodIsCalled (method) {
    const expectation = {
      failMessage: `Mock did not receive ${method}`,
      execute: () => {
        return this.stats[method].callCount > 0
      }
    }
    this.expectations.push(expectation)
  }

  _mockMethod (method) {
    this[method] = (...args) => {
      this.stats[method].args = args
      this.stats[method].callCount = this.stats[method].callCount + 1
    }
  }
}

module.exports = MockObject
