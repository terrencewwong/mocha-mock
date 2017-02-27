# mocha-mock
Mock library for mochajs

Basically I wanted to avoid the call to [`mock.verify`](http://sinonjs.org/releases/v1.17.7/mocks/) used in [`sinon`](http://sinonjs.org/)

##Example

```javascript
const assert = require('assert')
const {it, mock} = require('mocha-mock')

describe('Queue', () => {
  it('can peek', () => {
    const firstElement = 'firstElement'
    
    // The assertions added to the mock are run
    // automatically when the 'it' block is over.
    const linkedList = mock(new LinkedList([firstElement]))
      .shouldReceive('getHead')
      .once()
      .andReturn(firstElement)
      
    const queue = new Queue(linkedList)
    assert.equal(queue.peek(), firstElement)
  })
})
```

###API
####`it`
returns an instance of `mocha.it` but will also run any assertions setup by `mock` during the `it` block

####`mock`
returns an instance of `MockObject`

####`MockObject.prototype.shouldReceive := (method: string) : MockObject`
asserts that the given method is called

####`MockObject.prototype.once := () : MockObject`
- must be called after `shouldReceive`
- asserts that the method used in `shouldReceive` should be called exactly once


####`MockObject.prototype.twice := () : MockObject`
- must be called after `shouldReceive`
- asserts that the method used in `shouldReceive` should be called exactly twice

####`MockObject.prototype.times := (n: number) : MockObject`
- must be called after `shouldReceive`
- asserts that the method used in `shouldReceive` should be called exactly `n` times

####`MockObject.prototype.andReturn := (value: any) : MockObject`
- must be called after `shouldReceive`
- sets the value to be returned for the method used in `shouldReceive`

####`MockObject.prototype.with := (...args: any) : MockObject`
- must be called after `shouldReceive`
- asserts that the method used in `shouldReceive` was called with the given `args`

####`MockObject.prototype.verify := () : boolean`
- manually verify all of the assertions on the mock
- returns true if all assertions pass
- otherwise throws an an exception for the first assertion that failed
