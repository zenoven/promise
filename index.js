function Promise(executor) {
  var self = this
  self.status = 'PENDING'
  self.resolvedCallbacks = []
  self.rejectedCallbacks = []
  self.data = null
  executor = typeof executor === 'function' ? executor : function(){}

  try {
    executor(onResolved, onRejected)
  }catch (e){
    onRejected(e)
  }

  function onResolved(data) {
    self.status = 'RESOLVED'
    self.data = data
  }

  function onRejected(reason) {
    var error
    self.status = 'REJECTED'
    error= new Error(reason)
    self.data = error
  }
}

Promise.prototype.then = function () {
  var result = new Promise(function (resolve, reject) {

  })
}

var p = new Promise(function (resolve, reject) {
  setTimeout(function () {
    resolve('aaa')
  }, 300)
})

p.then(function (data) {
  console.log(data)
})
