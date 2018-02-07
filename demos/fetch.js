var Promise = require('../index')

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
