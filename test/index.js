var Promise = require('../index')

function log(val){
  var str = '-------val:' + val + '-------:'
  console.time(str)
  console.timeEnd(str)
  val += 1
  return val
}
var a = new Promise(function (resolve, reject) {
  setTimeout(function () {
    resolve(1000)
  }, 1000)
})

a
  .then(log)
  // .then(function(val){
  //   return new Promise( (resolve) => {
  //     setTimeout(()=> {
  //       resolve(log(val))
  //     }, 2000)
  //   })
  // })
  .then(log)
  .then(log)
  .then(log)
  .then(log)
  .then(log)
