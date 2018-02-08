// https://juejin.im/post/59e85eebf265da430d571f89

setTimeout(function() {
  console.log('2');
  process.nextTick(function() {
    console.log('3');
  })
  new Promise(function(resolve) {
    console.log('4');
    resolve();
  }).then(function() {
    console.log('5')
  })
})



setTimeout(function() {
  console.log('9');
  process.nextTick(function() {
    console.log('10');
  })
  new Promise(function(resolve) {
    console.log('11');
    resolve();
  }).then(function() {
    console.log('12')
  })
})


/**
 * 推测结果
 * 1、7
 * 6、8
 * 2、4
 * 3、5
 * 9、11
 * 10、12

 **/

/**
 * 实际结果
 1
 7
 6
 8
 2
 4
 9
 11
 3
 10
 5
 12
 */
