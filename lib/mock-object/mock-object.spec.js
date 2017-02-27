const expect = require('expect')
const MockObject = require('./')

describe('mock-object', () => {
  it('has a verify method', () => {
    const mockObject = new MockObject()
    expect(mockObject.verify).toBeTruthy()
  })

  it('verify returns true on an "empty" mock', () => {
    const mockObject = new MockObject()
    expect(mockObject.verify()).toBe(true)
  })

  it('verify throws if the should received method is not received', () => {
    const mockObject = new MockObject()
    mockObject.shouldReceive('method')
    const verify = () => mockObject.verify()
    expect(verify).toThrow()
  })

  it('sets up the mock method properly', () => {
    const mockObject = new MockObject({method: () => {}})
    mockObject.shouldReceive('method')
    mockObject.method()
    expect(mockObject.verify()).toBe(true)
  })

  it('once verifies if the method was called once', () => {
    const mockObject = new MockObject({method: () => {}})
    mockObject
      .shouldReceive('method')
      .once()
    mockObject.method()
    expect(mockObject.verify()).toBe(true)
  })

  it('once does not verify if the method was more than called once', () => {
    const mockObject = new MockObject({method: () => {}})
    mockObject
      .shouldReceive('method')
      .once()
    mockObject.method()
    mockObject.method()
    const verify = () => mockObject.verify()
    expect(verify).toThrow()
  })

  it('can mock the method of an existing object', () => {
    const object = {method: () => 'method'}
    const mockObject = new MockObject(object)
    mockObject.shouldReceive('method')
    mockObject.method()
    expect(mockObject.verify()).toBe(true)
  })

  it('can specify the return value of a mocked method', () => {
    const object = {method: () => 'method'}
    const mockObject = new MockObject(object)
    const returnedValue = 'bar'
    mockObject
      .shouldReceive('method')
      .andReturn(returnedValue)
    expect(mockObject.method()).toBe(returnedValue)
    expect(mockObject.verify()).toBe(true)
  })

  it('should have a with method', () => {
    const mockObject = new MockObject()
    expect(mockObject.with).toBeTruthy()
  })

  it('throws when the mock is not called with specified args', () => {
    const args = 'foo'
    const mockObject = new MockObject({method: () => {}})
    mockObject
      .shouldReceive('method')
      .with(args)
    mockObject.method(args)

    expect(mockObject.verify()).toBe(true)
  })
})
