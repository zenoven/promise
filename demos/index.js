require('isomorphic-fetch')

var Promise = require('../index')

function log(val){
  var str = '-------val:' + val + '-------:'
  console.time(str)
  console.timeEnd(str)
  val += 1
  return val
}
var a = new Promise(function (resolve, reject) {
  console.log('begin')
  console.log('aaaaa')
  resolve(1000)
  console.log('bbbbb')
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

console.log('end');

(function test() {
  setTimeout(function() {console.log(4)}, 0);
  new Promise(function executor(resolve) {
    console.log(1);
    for( var i=0 ; i<10000 ; i++ ) {
      i == 9999 && resolve();
    }
    console.log(2);
  }).then(function() {
    console.log(5);
  });
  console.log(3);
})()

