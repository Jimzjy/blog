---
title: JS
date: 2020-01-01
author: All
tags: 
  - memo
---

### 多个标签页之间通信的几种方法

**1.localstorage**

    window.onstorage = (e) => {console.log(e)}
    // 或者这样
    window.addEventListener('storage', (e) => console.log(e))

onstorage以及storage事件，针对都是**非当前页面**对localStorage进行修改时才会触发，当前页面修改localStorage不会触发监听函数。然后就是在对原有的数据的值进行修改时才会触发，比如原本已经有一个key会a值为b的localStorage，你再执行：`localStorage.setItem('a', 'b')`代码，同样是不会触发监听函数的.

**2.webworker**

普通的webworker直接使用new Worker()即可创建，这种webworker是当前页面专有的。然后还有种共享worker(SharedWorker)，这种是可以多个标签页、iframe共同使用的.

**SharedWorker**

SharedWorker可以被多个window共同使用，但必须保证这些标签页都是同源的(相同的协议，主机和端口号)

新建一个js文件worker.js

```js
// sharedWorker所要用到的js文件，不必打包到项目中，直接放到服务器即可
let data = ''
onconnect = function (e) {
  let port = e.ports[0]

  port.onmessage = function (e) {
    if (e.data === 'get') {
      port.postMessage(data)
    } else {
      data = e.data
    }
  }
}
```

webworker端(暂且这样称呼)的代码就如上，只需注册一个onmessage监听信息的事件，客户端(即使用sharedWorker的标签页)发送message时就会触发.

注意webworker无法在本地使用, worker.js和index.html在同一目录.

index.html

    // 这段代码是必须的，打开页面后注册SharedWorker，显示指定worker.port.start()方法建立与worker间的连接
        if (typeof Worker === "undefined") {
          alert('当前浏览器不支持webworker')
        } else {
          let worker = new SharedWorker('worker.js')
          worker.port.addEventListener('message', (e) => {
            console.log('来自worker的数据：', e.data)
          }, false)
          worker.port.start()
          window.worker = worker
        }
    // 获取和发送消息都是调用postMessage方法，我这里约定的是传递'get'表示获取数据。
    window.worker.port.postMessage('get')
    window.worker.port.postMessage('发送信息给worker')

### 原型

<img :src="$withBase('/js/proto.png')"/>

- `Object` 是所有对象的爸爸，所有对象都可以通过 `__proto__` 找到它
- `Function` 是所有函数的爸爸，所有函数都可以通过 `__proto__` 找到它
- `Function.prototype` 和 `Object.prototype` 是两个特殊的对象，他们由引擎来创建
- 除了以上两个特殊对象，其他对象都是通过构造器 `new` 出来的
- 函数的 `prototype` 是一个对象，也就是原型
- 对象的 `__proto__` 指向原型， `__proto__` 将对象和原型连接起来组成了原型链

先有的 Function.prototype 再有的 function Function , 不像 Foo , 是先有的 function Foo 再有的 Foo.prototype, 所以 Function.__proto__ === Function.prototype, 这是引擎作出的操作.

bind() 生成的没有 prototype (所以不会影响原来的 function), new 它们的时候, 会调用原构造函数, 将原构造函数的 prototype 赋给 对象的 __proto__ .

### prototype作用

- 让实例对象知道是什么函数构造了它
- 如果想给某些类库中的构造函数增加一些自定义的方法，就可以通过 `xx.constructor.method` 来扩展

### new的过程

- step1：首先创建一个空对象，这个对象将会作为执行 new 构造函数() 之后，返回的对象实例
- step2：将上面创建的空对象的原型（`__proto__`），指向构造函数的 prototype 属性
- step3：将这个空对象赋值给构造函数内部的 this，并执行构造函数逻辑
- step4：根据构造函数执行逻辑，返回第一步创建的对象或者构造函数的显式返回值

    function newFunc(...args) {
     // 取出 args 数组第一个参数，即目标构造函数
     const constructor = args.shift()
    
     // 创建一个空对象，且这个空对象继承构造函数的 prototype 属性
     // 即实现 obj.__proto__ === constructor.prototype
     const obj = Object.create(constructor.prototype)
    
     // 执行构造函数，得到构造函数返回结果
     // 注意这里我们使用 apply，将构造函数内的 this 指向为 obj
     const result = constructor.apply(obj, args)
    
     // 如果造函数执行后，返回结果是对象类型，就直接返回，否则返回 obj 对象
     return (typeof result === 'object' && result != null) ? result : obj
    }

### this

**this 的指向，是在调用函数时根据执行上下文所动态确定的**

- 在函数体中，简单调用该函数时（非显式/隐式绑定下），严格模式下 `this` 绑定到 `undefined`，否则绑定到全局对象 `window`／`global`；
- 一般构造函数 `new` 调用，绑定到新创建的对象上；
- 一般由 `call`/`apply`/`bind` 方法显式调用，绑定到指定参数的对象上；
- 一般由上下文对象调用，绑定在该对象上；
- 箭头函数中，根据外层上下文绑定的 `this` 决定 `this` 指向。

非严格模式下的 bind call apply 会把 undefined, null 这些context转成全局对象(window, global)
<img :src="$withBase('/js/bind.jpg')"/>

### JavaScript 执行

- 代码预编译阶段
- 代码执行阶段

预编译阶段是前置阶段，这个时候由编译器将 JavaScript 代码编译成可执行的代码。 注意，这里的预编译和传统的编译并不一样，传统的编译非常复杂，涉及分词、解析、代码生成等过程 。这里的预编译是 JavaScript 中独特的概念，虽然 JavaScript 是解释型语言，编译一行，执行一行。但是在代码执行前，JavaScript 引擎确实会做一些「预先准备工作」

**执行阶段主要任务是执行代码，执行上下文在这个阶段全部创建完成**

JavaScript 代码在预编译阶段对变量的内存空间进行分配，我们熟悉的变量提升过程便是在此阶段完成的

- 预编译阶段进行变量声明；
- 预编译阶段变量声明进行提升，但是值为 undefined；
- 预编译阶段所有非表达式的函数声明进行提升。

    function bar() {
       console.log('bar1')
    }
    
    var bar = function () {
       console.log('bar2')
    }
    
    bar()
    
    // 输出：bar2，我们调换顺序：
    
    var bar = function () {
       console.log('bar2')
    }
    
    function bar() {
       console.log('bar1')
    }
    
    bar()
    // 仍然输出：bar2
    
    foo(10)
    function foo (num) {
       console.log(foo)
       foo = num;       
       console.log(foo)
       var foo
    }
    console.log(foo)
    foo = 1
    console.log(foo)
    
    输出：
    
    undefined
    10
    ƒ foo (num) {
       console.log(foo)
       foo = num     
       console.log(foo)
       var foo
    }
    1
    

作用域在预编译阶段确定，但是作用域链是在执行上下文的创建阶段完全生成的。因为函数在调用时，才会开始创建对应的执行上下文。

**执行上下文**包括了：变量对象、作用域链以及 this 的指向  

变量提升是发生在预编译阶段，也就是执行上下文的创建阶段，这个阶段就是：创建变量对象，创建作用域链，确定this指向，let和const的变量是在执行阶段开始执行的，所以没有在预编译阶段执行，就是没有提升.  
JavaScript引擎在扫描代码时，也就是预编译阶段，对于发现的变量声明，要么将它们提升到作用域顶部，也就是var声明的，要么将声明放在暂时性死区，也就是let和const，在执行阶段时，执行到声明语句后，才会从暂时性死区移除. 

### 闭包
闭包也是一个函数，它也是定义在全局里的，只是它的定义时间是依赖它的包含函数的，之所以闭包能访问外部函数的变量，是因为外部函数内的代码执行，执行到它，它被定义时，它把外部函数的变量对象保存在了自己的`[[scope]]`属性上.  
这个内部函数被返回，然后执行时，第一创建自己的执行环境，然后把`[[scope]]`里保存的作用域复制过来，把自己的变量对象放在最前端，建立自己的作用域链，所以它依然可以访问外部函数的变量，所以无论闭包还是词法环境，搜索变量的过程都是在作用域链上搜索.  
至于它能搜索到哪些变量，取决于它所在的执行环境，也就是this.  

### 内存管理基本概念

- 栈空间：由操作系统自动分配释放，存放函数的参数值，局部变量的值等，其操作方式类似于数据结构中的栈。
- 堆空间：一般由开发者分配释放，这部分空间就要考虑垃圾回收的问题。

一般情况下，基本数据类型保存在栈内存当中，引用类型保存在堆内存当中

### bind

    Function.prototype.bind = Function.prototype.bind || function (context) {
       var me = this;
       var args = Array.prototype.slice.call(arguments, 1);
       var F = function () {}; // 为了不影响原来的 prototype
       F.prototype = this.prototype;
       var bound = function () {
           var innerArgs = Array.prototype.slice.call(arguments);
           var finalArgs = args.concat(innerArgs);
           return me.apply(this instanceof F ? this : context || this, finalArgs);
       }
       bound.prototype = new F();
       return bound;
    }

### apply

    Function.prototype.applyFn = function (targetObject, argsArray) {
       if(typeof argsArray === 'undefined' || argsArray === null) {
           argsArray = []
       }
    
       if(typeof targetObject === 'undefined' || targetObject === null){
           targetObject = window
       }
    
       targetObject = new Object(targetObject)
    
       const targetFnKey = 'targetFnKey'
       targetObject[targetFnKey] = this
    
       const result = targetObject[targetFnKey](...argsArray)
       delete targetObject[targetFnKey]
       return result
    }

### reduce

    Array.prototype.reduce = Array.prototype.reduce || function(func, initialValue) {
       var arr = this
       var base = typeof initialValue === 'undefined' ? arr[0] : initialValue
       var startPoint = typeof initialValue === 'undefined' ? 1 : 0
       arr.slice(startPoint)
           .forEach(function(val, index) {
               base = func(base, val, index + startPoint, arr)
           })
       return base
    }

### JavaScript 类型

- null
- undefined
- boolean
- number
- string
- object
- symbol
- bigint

object 类型又具体包含了 function、array、date 等。

**使用 typeof 判断类型**

使用 typeof 可以准确判断出除 null 以外的基本类型，以及 function 类型、symbol 类型；null 会被 typeof 判断为 object, bigint 为 bigint。

    const foo = () => 1
    typeof foo // "function"

**使用 instanceof 判断类型**

使用 a instanceof B 判断的是：a 是否为 B 的实例，即 a 的原型链上是否存在 B 构造函数

**使用 constructor 和 Object.prototype.toString 判断类型**

    console.log(Object.prototype.toString.call(1))
    // [object Number]

### **转换**

当使用 + 运算符计算 string 和其他类型相加时，都会转换为 string 类型；其他情况，都会转换为 number 类型，但是 undefined 会转换为 NaN，相加结果也是 NaN

**复杂类型**

当使用 + 运算符计算时，如果存在复杂类型，那么复杂类型将会转换为基本类型，再进行运算.

对象在转换基本类型时，会调用该对象上 valueOf 或 toString 这两个方法，该方法的返回值是转换为基本类型的结果.

那具体调用 valueOf 还是 toString 呢？这是 ES 规范所决定的，实际上这取决于内置的 toPrimitive 调用结果.

    const object1 = {
      [Symbol.toPrimitive](hint) {
        if (hint == 'number') {
    			// The hint argument can be one of "number", "string", and "default".
          return 42;
        }
        return null;
      }
    };
    
    console.log(+object1);
    // expected output: 42

### Promise

    function Promise(executor) {
     this.status = 'pending'
     this.value = null
     this.reason = null
     this.onFulfilledArray = []
     this.onRejectedArray = []
    
     const resolve = value => {
       if (value instanceof Promise) {
         return value.then(resolve, reject)
       }
       setTimeout(() => {
         if (this.status === 'pending') {
           this.value = value
           this.status = 'fulfilled'
    
           this.onFulfilledArray.forEach(func => {
             func(value)
           })
         }
       })
     }
    
     const reject = reason => {
       setTimeout(() => {
         if (this.status === 'pending') {
           this.reason = reason
           this.status = 'rejected'
    
           this.onRejectedArray.forEach(func => {
             func(reason)
           })
         }
       })
     }
    
    
       try {
           executor(resolve, reject)
       } catch(e) {
           reject(e)
       }
    }
    
    const resolvePromise = (promise2, result, resolve, reject) => {
     // 当 result 和 promise2 相等时，也就是说 onfulfilled 返回 promise2 时，进行 reject
     if (result === promise2) {
       return reject(new TypeError('error due to circular reference'))
     }
    
     // 是否已经执行过 onfulfilled 或者 onrejected
     let consumed = false
     let thenable
    
     if (result instanceof Promise) {
       if (result.status === 'pending') {
         result.then(function(data) {
           resolvePromise(promise2, data, resolve, reject)
         }, reject)
       } else {
         result.then(resolve, reject)
       }
       return
     }
    
     let isComplexResult = target => (typeof target === 'function' || typeof target === 'object') && (target !== null)
     // 如果返回的是疑似 Promise 类型
     if (isComplexResult(result)) {
       try {
         thenable = result.then
         // 如果返回的是 Promise 类型，具有 then 方法
         if (typeof thenable === 'function') {
           thenable.call(result, function(data) {
             if (consumed) {
               return
             }
             consumed = true
    
             return resolvePromise(promise2, data, resolve, reject)
           }, function(error) {
             if (consumed) {
               return
             }
             consumed = true
    
             return reject(error)
           })
         }
         else {
           return resolve(result)
         }
    
       } catch(e) {
         if (consumed) {
           return
         }
         consumed = true
         return reject(e)
       }
     }
     else {
       return resolve(result)
     }
    }
    
    Promise.prototype.then = function(onfulfilled, onrejected) {
     onfulfilled = typeof onfulfilled === 'function' ? onfulfilled : data => data
     onrejected = typeof onrejected === 'function' ? onrejected : error => {throw error}
    
     // promise2 将作为 then 方法的返回值
     let promise2
    
     if (this.status === 'fulfilled') {
       return promise2 = new Promise((resolve, reject) => {
         setTimeout(() => {
           try {
             // 这个新的 promise2 resolved 的值为 onfulfilled 的执行结果
             let result = onfulfilled(this.value)
             resolvePromise(promise2, result, resolve, reject)
           }
           catch(e) {
             reject(e)
           }
         })
       })
     }
     if (this.status === 'rejected') {
       return promise2 = new Promise((resolve, reject) => {
         setTimeout(() => {
           try {
             // 这个新的 promise2 reject 的值为 onrejected 的执行结果
            let result = onrejected(this.reason)
            resolvePromise(promise2, result, resolve, reject)
           }
           catch(e) {
             reject(e)
           }
         })
       })
     }
     if (this.status === 'pending') {
       return promise2 = new Promise((resolve, reject) => {
         this.onFulfilledArray.push(value => {
           try {
             let result = onfulfilled(value)
             resolvePromise(promise2, result, resolve, reject)
           }
           catch(e) {
             return reject(e)
           }
         })
    
         this.onRejectedArray.push(reason => {
           try {
             let result = onrejected(reason)
             resolvePromise(promise2, result, resolve, reject)
           }
           catch(e) {
             return reject(e)
           }
         })      
       })
     }
    }
    
    Promise.prototype.catch = function(catchFunc) {
     return this.then(null, catchFunc)
    }
    
    Promise.resolve = function(value) {
     return new Promise((resolve, reject) => {
       resolve(value)
     })
    }
    
    Promise.reject = function(value) {
     return new Promise((resolve, reject) => {
       reject(value)
     })
    }
    
    Promise.race = function(promiseArray) {
     if (!Array.isArray(promiseArray)) {
         throw new TypeError('The arguments should be an array!')
     }
     return new Promise((resolve, reject) => {
       try {
         const length = promiseArray.length
         for (let i = 0; i        promiseArray[i].then(resolve, reject)
         }
       }
       catch(e) {
         reject(e)
       }
     })
    }
    
    Promise.all = function (promiseArray) {
      if (!Array.isArray(promiseArray)) {
        throw new TypeError('The arguments should be an array!')
      }
      return new Promise((resolve, reject) => {
        try {
          let resultArray = []
          let count = 0
          const length = promiseArray.length
    
          for (let i = 0; i < promiseArray.length; i++) {
            promiseArray[i].then(data => {
              resultArray[i] = data
              count++
    
              if (count === length) {
                resolve(resultArray)
              }
            }, reject)
          }
        }
        catch (e) {
          reject(e)
        }
      })
    }

### 继承

    function inherit(Child, Parent) {
        // 继承原型上的属性
       Child.prototype = Object.create(Parent.prototype)
    
        // 修复 constructor
       Child.prototype.constructor = Child
    
       // 存储超类
       Child.super = Parent
    
       // 静态属性继承
       if (Object.setPrototypeOf) {
           // setPrototypeOf es6
           Object.setPrototypeOf(Child, Parent)
       } else if (Child.__proto__) {
           // __proto__ es6 引入，但是部分浏览器早已支持
           Child.__proto__ = Parent
       } else {
           // 兼容 IE10 等陈旧浏览器
           // 将 Parent 上的静态属性和方法拷贝一份到 Child 上，不会覆盖 Child 上的方法
           for (var k in Parent) {
               if (Parent.hasOwnProperty(k) && !(k in Child)) {
                   Child[k] = Parent[k]
               }
           }
       }
    
    }

JavaScript 的日期对象只能通过 JavaScript Date 作为构造函数来实例化得到。

**Date继承**

    function DateConstructor() {
       var dateObj = new(Function.prototype.bind.apply(Date, [Date].concat(Array.prototype.slice.call(arguments))))()
    
       Object.setPrototypeOf(dateObj, DateConstructor.prototype)
    
       dateObj.foo = 'bar'
    
       return dateObj
    }
    
    Object.setPrototypeOf(DateConstructor.prototype, Date.prototype)
    
    DateConstructor.prototype.getMyTime = function getTime() {
       return this.getTime()
    }
    
    let date = new DateConstructor()
    
    console.log(date.getMyTime())

整个实现过程通过更改原型关系，在构造函数里调用原生构造函数 Date，并返回其实例的方法，「欺骗了」浏览器。当然这样的做法比较取巧，其副作用是更改了原型关系，这样也会干扰浏览器某些优化操作。

**ES6**

    class DateConstructor extends Date {
       constructor() {
           super()
           this.foo ='bar'
       }
       getMyTime() {
           return this.getTime()
       }
    }
    
    let date = new DateConstructor()
    
    // 上面的方法可以完美执行：
    
    date.getMyTime()
    // 1558921640586

### async await

    async function findPosts() {
      var response = await $.get('/posts');
      try{
         return JSON.parse(response.posts)
      } catch(e) {
         throw new Error("failed")
      }
    }

to

    function findPosts() {
        var ctx = this, args = arguments;
        return Promise.resolve().then(function () {
            var response;
            return $.get('/posts').then(function (value) {
                response = value;
                return Promise.resolve().then(function () {
                    return JSON.parse(response.posts);
                }).catch(function (e) {
                    throw new Error('failed');
                }).then(function () {
                });
            });
        });
    }

### 箭头函数

没有自己的this，arguments，super或new.target。箭头函数表达式更适用于那些本来需要匿名函数的地方，并且它不能用作构造函数。

### 类数组转数组

Array.prototype.slice.call()

    var toArray = function(s){
    	try{  
    	   return Array.prototype.slice.call(s);  
    	} catch(e){  
    	  var arr = [];  
    	  for(var i = 0,len = s.length; i < len; i++){   
    	       arr[i] = s[i];
    		}
    	}  
      return arr;  
    }

Array.from()

    var args = Array.from(arguments);

扩展运算符（…）

    var args = [...arguments];

### 纯函数

- 相同输入总是会返回相同的输出。
- 不产生副作用。
- 不依赖于外部状态。

调用一个纯函数，但是不使用其返回值，无意义.

### **副作用**

修改全局变量（函数外的变量），修改参数或改变外部存储

### 柯里化

    function curry(fn, ...args) {
      return fn.length <= args.length ? fn(...args) : function(...args1) {
        return curry(fn, ...args, ...args1)
      }
    }
    
    function plus(a, b, c) {
      return a + b + c
    }
    
    console.log(curry(plus)(1)(2)(3))

### 偏函数

    function partial (fn, ...args) {
    	return fn.bind(null, ...args)
    }

### Proxy

支持13种拦截操作

- **get(target, propKey, receiver)**：拦截对象属性的读取，比如`proxy.foo`和`proxy['foo']`。
- **set(target, propKey, value, receiver)**：拦截对象属性的设置，比如`proxy.foo = v`或`proxy['foo'] = v`，返回一个布尔值。
- **has(target, propKey)**：拦截`propKey in proxy`的操作，返回一个布尔值。
- **deleteProperty(target, propKey)**：拦截`delete proxy[propKey]`的操作，返回一个布尔值。
- **ownKeys(target)**：拦截`Object.getOwnPropertyNames(proxy)`、`Object.getOwnPropertySymbols(proxy)`、`Object.keys(proxy)`、`for...in`循环，返回一个数组。该方法返回目标对象所有自身的属性的属性名，而`Object.keys()`的返回结果仅包括目标对象自身的可遍历属性。
- **getOwnPropertyDescriptor(target, propKey)**：拦截`Object.getOwnPropertyDescriptor(proxy, propKey)`，返回属性的描述对象。
- **defineProperty(target, propKey, propDesc)**：拦截`Object.defineProperty(proxy, propKey, propDesc）`、`Object.defineProperties(proxy, propDescs)`，返回一个布尔值。
- **preventExtensions(target)**：拦截`Object.preventExtensions(proxy)`，返回一个布尔值。
- **getPrototypeOf(target)**：拦截`Object.getPrototypeOf(proxy)`，返回一个对象。
- **isExtensible(target)**：拦截`Object.isExtensible(proxy)`，返回一个布尔值。
- **setPrototypeOf(target, proto)**：拦截`Object.setPrototypeOf(proxy, proto)`，返回一个布尔值。如果目标对象是函数，那么还有两种额外操作可以拦截。
- **apply(target, object, args)**：拦截 Proxy 实例作为函数调用的操作，比如`proxy(...args)`、`proxy.call(object, ...args)`、`proxy.apply(...)`。
- **construct(target, args)**：拦截 Proxy 实例作为构造函数调用的操作，比如`new proxy(...args)`。

### globalThis

在 Web 中，可以通过 window、self 或者 frames 取到全局对象，但是在 Web Workers 中只有 self 可以。在 Node.js 中，它们都无法获取，必须使用 global。在松散模式下，可以在函数中返回 this 来获取全局对象，但是在严格模式下 this 会返回 undefined 。

### 单例

    let obj = {}
    // 也是单例, 因为在JavaScript创建对象的方式十分灵活, 
    // 可以直接通过对象字面量的方式实例化一个对象, 
    // 而其他面向对象的语言必须使用类进行实例化

    class SingletonApple {
      constructor(name, creator, products) {
        //首次使用构造器实例
        if (!SingletonApple.instance) {
          this.name = name;
          this.creator = creator;
          this.products = products;
          //将this挂载到SingletonApple这个类的instance属性上
          SingletonApple.instance = this;
        }
        return SingletonApple.instance;
      }
    }

### 装饰器

Object.assign

    class Math {
      @log
      add(a, b) {
        return a + b;
      }
    }
    
    function log(target, name, descriptor) {
      var oldValue = descriptor.value;
    
      descriptor.value = function() {
        console.log(`Calling ${name} with`, arguments);
        return oldValue.apply(this, arguments);
      };
    
      return descriptor;
    }
    
    const math = new Math();
    
    // passed parameters should get logged now
    math.add(2, 4);

### 0.1+0.2 ≠ 0.3

64位比特又可分为三个部分：

- 符号位S：第 1 位是正负数符号位（sign），0代表正数，1代表负数
- 指数位E：中间的 11 位存储指数（exponent），用来表示次方数
- 尾数位M：最后的 52 位是尾数（mantissa），超出的部分自动进一舍零

[https://user-gold-cdn.xitu.io/2018/3/8/16205c88ea806bac?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2018/3/8/16205c88ea806bac?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

十进制的0.1和0.2会被转换成二进制的，但是由于浮点数用二进制表示时是无穷的：

    0.1 -> 0.0001 1001 1001 1001...(1100循环)
    0.2 -> 0.0011 0011 0011 0011...(0011循环)

IEEE 754 标准的 64 位双精度浮点数的小数部分最多支持53位二进制位，所以两者相加之后得到二进制为：

    0.0100110011001100110011001100110011001100110011001100

因浮点数小数位的限制而截断的二进制数字，再转换为十进制，就成了0.30000000000000004。所以在进行算术计算时会产生误差。