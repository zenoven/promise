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
  setTimeout(function () {
    console.log('aaaaa')
    resolve(1000)
    console.log('bbbbb')
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
var genDelay = function(time, value){
  return new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve(value)
    }, time)
  })
}


function fetchPro(url, options){
  var promises = []
  var finalPromise
  var called = false
  var abort

  var fetchPromise = new Promise(function(resolve, reject){
    fetch(url, options)
      .then(res =>{
        called = true
        resolve(res)
      })
      .catch(err => {
        called = true
        reject(err)
      })
  })


  var abortPromise = new Promise(function(resolve, reject){
    abort = reject
  })

  // 超时
  if(typeof options.timeout !== 'undefined'){
    var timeoutPromise = new Promise(function(resolve, reject){
      setTimeout(()=>{
        if(!called) {
          console.log('timeout worked')
          reject('request timeout in ' + options.timeout + ' ms')
        }else{
          console.log('timeout canceled')
        }
      }, options.timeout)
    })
    promises.push(timeoutPromise)
  }
  promises.push(fetchPromise)
  promises.push(abortPromise)

  finalPromise = Promise.race(promises)

  finalPromise.abort = function () {
    abort('abort here')
    called = true
    console.log('abort')
  }

  return finalPromise
}

var p = fetchPro('https://www.baidu.com', {mode:'no-cors', timeout: 50} )

p.then(res => {
  console.log('res.body:')
}).catch(e => {
  console.log('e:', e)
})

// p.abort()


