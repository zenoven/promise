function onResolved(data) {
  console.log('data:', data)
  return data
}

function onRejected(reason) {
  console.log('reason:', reason)
  throw new Error(reason)
}

function Promise(executor) {
  this.status = 'PENDING'
  this.resolvedCallbacks = []
  this.rejectedCallbacks = []
  executor = typeof executor === 'function' ? executor : function(){}
  try {
    executor(onResolved, onRejected)
  }catch (e){

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
