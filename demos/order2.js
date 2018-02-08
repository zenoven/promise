let a = new Promise((resolve, reject) => {
  resolve(2)
})
a.then((v) => {console.log(v)})//microtask

setTimeout(() => {//macrotask
  console.log(4);
},0)

let scc = setInterval(() => {//macrotask
  console.log('5')
},0)

setTimeout(() => {//macrotask
  console.log(6);
  Promise.resolve().then(() => {//microtask
    console.log(7)
  },0);
  setTimeout(() => {//macrotask
    console.log('58');
    clearInterval(scc);
  },0)
},0)

Promise.resolve().then(() => {//microtask
  console.log(3)
});

console.log(1)//主线程


/**
 * 推测结果
 * 1
 * 2
 * 3
 * 4
 * 5
 * 5
 * 58

 **/
