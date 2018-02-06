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

    if(data instanceof Promise) return data.then(onFulfilled, onRejected)

    setTimeout(function () {
      if(self.status !== 'pending') return
      self.status = 'fulfilled'
      self.data = data
      var currentCallback

      for(var i = 0; i < self.fulfilledCallbacks.length; i++) {
        currentCallback = self.fulfilledCallbacks[i]
        typeof currentCallback === 'function' && currentCallback(self.data)
      }
    })
  }

  function onRejected(reason) {
    setTimeout(function () {
      if(self.status !== 'pending') return
      self.status = 'rejected'
      self.data = reason
      var currentCallback
      for(var i = 0; i < self.rejectedCallbacks.length; i++) {
        currentCallback = self.rejectedCallbacks[i]
        typeof currentCallback === 'function' && currentCallback(self.data)
      }
    })

  }
}

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

  } else if(x !== null && (typeof x === 'function' || typeof x === 'object') ){

    try{
      then = x.then
      if(typeof then === 'function') {
        then.call(x, function(y){
          if(thenCalled) return
          thenCalled = true
          resolvePromise(promise, y, resolve, reject)
        }, function(r){
          if(thenCalled) return
          thenCalled = true
          return reject(r)
        })
      } else {
        resolve(x)
      }
    }catch(e){
      if(thenCalled) return
      thenCalled = true
      return reject(e)
    }

  }else{
    resolve(x)
  }

}

Promise.prototype.then = function (onFulfilled, onRejected) {
  var self = this
  var p
  onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : function(val){return val}
  onRejected = typeof onRejected === 'function' ? onRejected : function(reason){throw reason}

  if(self.status !== 'pending') {
    return p = new Promise(function (resolve, reject) {
      setTimeout(function () {
        var functionToCall = self.status === 'fulfilled' ? onFulfilled : onRejected
        var result
        try {
          result = functionToCall(self.data)
          resolvePromise(p, result, resolve, reject)
        } catch (e) {
          reject(e)
        }
      })
    })
  } else {
    return p = new Promise(function (resolve, reject) {
      self.fulfilledCallbacks.push(function(){
        try {
          var result = onFulfilled(self.data)
          // 如果上个then的返回值是个Promise实例 或者Promise executor里面resolve的结果是个Promise实例
          resolvePromise(p, result, resolve, reject)
        } catch (e) {
          reject(e)
        }
      })
      self.rejectedCallbacks.push(function(){
        try {
          var result = onRejected(self.data)
          // 如果上个then的返回值是个Promise实例 或者Promise executor里面resolve的结果是个Promise实例
          resolvePromise(p, result, resolve, reject)
        } catch (e) {
          reject(e)
        }
      })
    })
  }

}

Promise.deferred = Promise.defer = function(){
  var dfd = {}
  dfd.promise = new Promise(function (resolve, reject) {
    dfd.resolve = resolve
    dfd.reject = reject
  })
  return dfd
}

Promise.resolve = function(val){
  var p
  return p = new Promise(function(resolve, reject){
    resolvePromise(p, val, resolve, reject)
  })
}

Promise.reject = function (reason) {
  return new Promise(function(resolve, reject){
    reject(reason)
  })
}

module.exports = Promise
