function Promise(executor) {
  var self = this
  self.status = 'pending'
  self.fulfilledCallbacks = []
  self.rejectedCallbacks = []
  self.data = null
  executor = typeof executor === 'function' ? executor : function(){}

  try {
    executor(onFulfilled, onRejected)
  }catch (e){
    onRejected(e)
  }

  function onFulfilled(data) {
    if(self.status !== 'pending') return
    self.status = 'fulfilled'
    self.data = data
    var currentCallback
    for(var i = 0; i < self.fulfilledCallbacks.length; i++) {
      currentCallback = self.fulfilledCallbacks[i]
      typeof currentCallback === 'function' && currentCallback(self.data)
    }
  }

  function onRejected(reason) {
    if(self.status !== 'pending') return
    var error
    self.status = 'rejected'
    error= new Error(reason)
    self.data = error
    var currentCallback
    for(var i = 0; i < self.rejectedCallbacks.length; i++) {
      currentCallback = self.rejectedCallbacks[i]
      typeof currentCallback === 'function' && currentCallback(self.data)
    }
  }
}

Promise.prototype.then = function (onFulfilled, onRejected) {

  function resolvePromise(promise, x, resolve, reject){
    var then
    var thenCalled

    if(promise === x) reject(new TypeError('Chaining cycle detected for promise!'))

    if(x instanceof Promise) {
      if(x.status === 'pending') {
        x.then(function (value) {
          resolvePromise(promise, value, resolve, reject)
        }, reject)
      }else{
        x.then(resolve,reject)
      }

      return
    }else if(typeof x === 'function' || typeof x === 'object'){

      try{
        then = x.then
        if(typeof then === 'function') {
          then.call(x, function(){

          }, function(){

          })
        }
      }catch(e){
        reject(e)
      }


    }else{
      resolve(x)
    }
  }

  var self = this
  onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : function(val){return val}
  onRejected = typeof onRejected === 'function' ? onRejected : function(reason){throw reason}

  console.log('self.status:', self.status)

  if(self.status !== 'pending') {
    return p = new Promise(function (resolve, reject) {
      setTimeout(function () {
        var functionToCall = self.status === 'fulfilled' ? onFulfilled : onRejected
        var result
        try {
          result = functionToCall(self.data)
          console.log('result:', result)
          resolvePromise(p, result, resolve, reject)
        } catch (e) {
          reject(e)
        }
      })
    })
  } else {
    return new Promise(function (resolve, reject) {
      self.fulfilledCallbacks.push(function(){
        var result
        try {
          result = onFulfilled(self.data)
          // 如果上个then的返回值是个Promise实例 或者Promise executor里面resolve的结果是个Promise实例
          if(result instanceof Promise || typeof result.then === 'function'){
            result.then(resolve, reject)
          }
          resolve()
        } catch (e) {
          reject(e)
        }
      })
      self.rejectedCallbacks.push(function(){
        var result
        try {
          result = onRejected(self.data)
          // 如果上个then的返回值是个Promise实例 或者Promise executor里面resolve的结果是个Promise实例
          if(result instanceof Promise || typeof result.then === 'function'){
            result.then(resolve, reject)
          }
          resolve()
        } catch (e) {
          reject(e)
        }
      })
    })
  }

}

var p = new Promise(function (resolve, reject) {
  setTimeout(function () {
    resolve('aaa')
  }, 300)
})

p
  .then(function (data) {
    console.log(data)
    return '111'
  })
  .then(function (data) {
    return new Promise(function(res, rej){

      setTimeout(function () {
        res(data)
      }, 1000)
    })
  })
