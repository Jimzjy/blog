---
title: 概念&原理
tags: 
  - memo
date: 2020-01-01
author: All
---

### 渐进增强（Progressive Enhancement）

向上兼容.

一开始就针对低版本浏览器进行构建页面，完成基本的功能，然后再针对高级浏览器进行效果、交互、追加功能达到更好的体验.

### 优雅降级（Graceful Degradation）

向下兼容.

一开始就构建站点的完整功能，然后针对浏览器测试和修复。比如一开始使用 CSS3 的特性构建了一个应用，然后逐步针对各大浏览器进行 hack 使其可以在低版本浏览器上正常浏览.

### 未来 2020-2025

1.TypeScript

2.WebAssembly

3.Packages

4.Compile-to-JS

5.a11y

6.Serverless

### 进程线程

进程是 CPU 资源分配的最小单位（是能拥有资源和独立运行的最小单位)

线程是 CPU 调度的最小单位（是建立在进程基础上的一次程序运行单位）

### Virtual DOM 真的快吗

不一定

virtual dom 是为了数据驱动.

virtual dom 的diff是增加运算的.

 每次更新有耗时操作的话会多余计算

    function StrawManComponent(props) {
      const value = expensivelyCalculateValue(props.foo);
    
      return (
        <p>the value is {value}</p>
      );
    }

每次更新生成新list并且每个都有新的event handle

    function MoreRealisticComponent(props) {
      const [selected, setSelected] = useState(null);
    
      return (
        <div>
          <p>Selected {selected ? selected.name : 'nothing'}</p>
    
          <ul>
            {props.items.map(item =>
              <li>
                <button onClick={() => setSelected(item)}>
                  {item.name}
                </button>
              </li>
            )}
          </ul>
        </div>
      );
    }

### 响应式框架基本原理

- 依赖收集
- 数据劫持 / 数据代理
- 发布订阅模式

**数据劫持与代理**

    let data = {
       stage: 'GitChat',
       course: {
         title: '前端开发进阶',
         author: 'Lucas',
         publishTime: '2018 年 5 月'
       }
     }
    
     const observe = data => {
       if (!data || typeof data !== 'object') {
           return
       }
       Object.keys(data).forEach(key => {
         let currentValue = data[key]
    
         observe(currentValue)
    
         Object.defineProperty(data, key, {
           enumerable: true,
           configurable: false,
           get() {
             console.log(`getting ${key} value now, getting value is:`, currentValue)
             return currentValue
           },
           set(newValue) {
             currentValue = newValue
             console.log(`setting ${key} value now, setting value is`, currentValue)
           }
         })
       })
     }
    
     observe(data)

**监听数组变化**

    const arrExtend = Object.create(Array.prototype)
     const arrMethods = [
       'push',
       'pop',
       'shift',
       'unshift',
       'splice',
       'sort',
       'reverse'
     ]
    
     arrMethods.forEach(method => {
       const oldMethod = Array.prototype[method]
       const newMethod = function(...args) {
         oldMethod.apply(this, args)
         console.log(`${method} 方法被执行了`)
       }
       arrExtend[method] = newMethod
     })
    
    Array.prototype = Object.assign(Array.prototype, arrExtend)

**Proxy**

    let data = {
       stage: 'GitChat',
       course: {
         title: '前端开发进阶',
         author: ['Lucas'],
         publishTime: '2018 年 5 月'
       }
     }
    
     const observe = data => {
       if (!data || Object.prototype.toString.call(data) !== '[object Object]') {
           return
       }
    
       Object.keys(data).forEach(key => {
         let currentValue = data[key]
         // 事实上 proxy 也可以对函数类型进行代理。这里只对承载数据类型的 object 进行处理，读者了解即可。
         if (typeof currentValue === 'object') {
           observe(currentValue)
           data[key] = new Proxy(currentValue, {
             set(target, property, value, receiver) {
               // 因为数组的 push 会引起 length 属性的变化，所以 push 之后会触发两次 set 操作，我们只需要保留一次即可，property 为 length 时，忽略
               if (property !== 'length') {
                 console.log(`setting ${key} value now, setting value is`, currentValue)
               }
               return Reflect.set(target, property, value, receiver)
             }
           })
         }
         else {
           Object.defineProperty(data, key, {
             enumerable: true,
             configurable: false,
             get() {
               console.log(`getting ${key} value now, getting value is:`, currentValue)
               return currentValue
             },
             set(newValue) {
               currentValue = newValue
               console.log(`setting ${key} value now, setting value is`, currentValue)
             }
           })
         }
       })
     }
    
     observe(data)

**Proxy和defineProperty**

- Object.defineProperty 不能监听数组的变化，需要进行数组方法的重写
- Object.defineProperty 必须遍历对象的每个属性，且对于嵌套结构需要深层遍历
- Proxy 的代理是针对整个对象的，而不是对象的某个属性，因此不同于 Object.defineProperty 的必须遍历对象每个属性，Proxy 只需要做一层代理就可以监听同级结构下的所有属性变化，当然对于深层结构，递归还是需要进行的
- Proxy 支持代理数组的变化
- Proxy 的第二个参数除了 set 和 get 以外，可以有 13 种拦截方法，比起 Object.defineProperty() 更加强大，这里不再一一列举
- Proxy 性能将会被底层持续优化，而 Object.defineProperty 已经不再是优化重点

### this.setState 为什么是异步的

**保证内部的一致性**

如果要把原来用 state 表示的用 props 重构, 如果 state 是同步的话, 重构后 props 不会是同步的, 因为只有父组件渲染后props子组件才会更新props, 除非把 props 也变成同步的, 每次更新后渲染父组件, 这样的话批处理的效果就没有了, 性能下降 

    // 假设 setState 是同步的
    console.log(this.state.value) // 0
    this.setState({ value: this.state.value + 1 });
    console.log(this.state.value) // 1
    this.setState({ value: this.state.value + 1 });
    console.log(this.state.value) // 2
    
    // to
    console.log(this.props.value) // 0
    this.props.onIncrement();
    console.log(this.props.value) // 0
    this.props.onIncrement();
    console.log(this.props.value) // 0

**性能优化**

将state的更新延缓到最后批量合并再去渲染对于应用的性能优化是有极大好处的，如果每次的状态改变都去重新渲染真实dom，那么它将带来巨大的性能消耗。

### this.setState 全是异步执行吗？

React 控制的事件处理过程，setState 异步更新 this.state.

    onClick() {
     this.setState({
       count: this.state.count + 1
     })
    }
    
    componentDidMount() {
     document.querySelectorAll('#btn-raw')
       .addEventListener('click', this.onClick)
    }

### React 合成事件

- React 中的事件机制并不是原生的那一套，事件没有绑定在原生 DOM 上 ，大多数事件绑定在 document 上（除了少数不会冒泡到 document 的事件，如 video 等)
- 同时，触发的事件也是对原生事件的包装，并不是原生 event
- 出于性能因素考虑，合成事件（syntheticEvent）是被池化的。这意味着合成事件对象将会被重用，在调用事件回调之后所有属性将会被废弃。这样做可以大大节省内存，而不会频繁的创建和销毁事件对象。

**异步访问事件对象**

    function handleClick(e) {
     console.log(e)
     // 先持久化
     e.persist()
    
     setTimeout(() => {
       console.log(e)
     }, 0)
    }

**如何阻止冒泡**

在 React 中，直接使用 e.stopPropagation 不能阻止原生事件冒泡，因为事件早已经冒泡到了 document 上，React 此时才能够处理事件句柄.

    handleClick = e => {
     console.log('div click')
     e.nativeEvent.stopImmediatePropagation()
    }

### React Diffing 算法

**三个假设**

- 跨层级操作少到忽略不计——所以对比算法只需要对比树当前所在的层级
- 不同类型(Component)的树有不同的结构，这是在虚拟DOM层次上的设计
- 同层级的节点通过设置唯一key识别——不需要遍历当前层所有的节点

基于这三个假设，diff算法分为Tree Diff、Component Diff、Element Diff三个层面.

**Component Diff**

- 如果是相同类型，继续进行比较(这个比较可能是根据元素类型进行3种比较策略的组合)
- 如果不同类型 直接替换后面子节点
- shouldComponentUpdate Hook函数自行设置是否更新

**Element Diff**

React 三个假设在对比 element 时，存在短板，于是需要开发者给每一个 element 通过提供 key ，这样 react 可以准确地发现新旧集合中的节点中相同节点，对于相同节点无需进行节点删除和创建，只需要将旧集合中节点的位置进行移动，更新为新集合中节点的位置.

**有 key 就一定「性能最优」吗？**

我们来看这个场景，集合 [1,2,3,4] 渲染成 4 组数字，注意仅仅是数字这么简单：

`1`

`2`

`3`

`4`

当它变为 [2，1，4，5]：删除了 3，增加了 5，按照之前的算法，我们把 1 放到 2 后面，删除 3，再新增 5。整个操作移动了一次 dom 节点，删除和新增一共 2 处节点。

由于 dom 节点的移动操作开销是比较昂贵的，其实对于这种简单的 node text 更改情况，我们不需要再进行类似的 element diff 过程，只需要更改 dom.textContent 即可.

### Vue vs React

**数据绑定**

Vue 在数据绑定上，采取了双向绑定策略.

React 并没有数据和视图之间的双向绑定，它的策略是「局部刷新」。当数据发生变化时，直接重新渲染组件，以得到最新的视图.

**组件化和数据流**

Redux 是 React 应用最常用的解决方案, Redux 和视图无关，它只是提供了数据管理的流程，因此 Vue 使用 Redux 也是完全没有问题的。

Vue 中更常用的是 Vuex，其借鉴了 Redux（Flux），也具有和 Redux 相同的 store 概念，组件不允许直接修改 store state，而是需要 dispatch action 来通知 store 的变化。但是这个过程不同于 Redux 的函数式思想，Vuex 改变 store 的方法支持提交一个 mutation。mutation 类似于事件发布订阅系统：每个 mutation 都有一个字符串来表示事件类型（type）和一个回调函数（handler）以进行对应的修改。

另一个显著区别是：在 Vuex 中，store 是被直接注入到组件实例中的，因此用起来更加方便。而 Redux 需要 connect 方法，把 props 和 dispatch 注入给组件。

- Redux 提倡不可变性，而 Vuex 的数据是可变的，Redux 中 reducer 每次都会生成新的 state 以替代旧的 state，而 Vuex 是直接修改；
- Redux 在检测数据变化的时候，是通过浅比较的方式比较差异的，而 Vuex 其实和 Vue 的原理一样，是通过遍历数据的 getter / setter 来比较。

**渲染和更新**

React 更像 MVC 或者 MVVM 模式中的 view 层，但是搭配 Redux 等，它也是一个完整的 MVVM 类库。Vue 直接是一个典型 MVVM 模式的体现.

React 所有组件的渲染都依靠灵活而强大的 JSX。JSX 并不是一种模版语言，而是 JavaScript 表达式和函数调用的语法糖。在编译之后，JSX 被转化为普通的 JavaScript 对象，用来表示虚拟 DOM。

Vue templates 是典型的模版，这相比于 JSX，表达更加自然。在底层实现上，Vue 模版被编译成 DOM 渲染函数，结合响应系统，进行数据依赖的收集。Vue 渲染的过程如下：

- new Vue，进行实例化
- 挂载 $mount 方法，通过自定义 Render 方法、template、el 等生成 Render 函数，准备渲染内容
- 通过 Watcher 进行依赖收集
- 当数据发生变化时，Render 函数执行生成 VNode 对象
- 通过 patch 方法，对比新旧 VNode 对象，通过 DOM Diff 算法，添加、修改、删除真正的 DOM 元素

**在 React 应用中，当某个组件的状态发生变化时，它会以该组件为根，重新渲染整个组件子树。当然我们可以使用 PureComponent，或是手动实现 shouldComponentUpdate 方法，来规避不必要的渲染。但是这个实现过程要知悉数据状态结构，也需要一定的额外负担。**

**在 Vue 应用中，组件的依赖是在渲染过程中自动追踪的，因此系统能精确知晓哪个组件需要被重渲染。从理论上看，Vue 的渲染更新机制更加细粒度，也更加精确。**

**社区**

这两个框架都具有非常强大的社区，但是对于社区的理念，Vue 和 React 稍有不同。举个例子：路由系统的实现。

Vue 的路由库和状态管理库都是由官方维护的，并且与核心库是同步更新的。而 React 把这件事情交给了社区，比如 React 应用中，需要引入 react-router 库来实现路由系统。

### JQuery vs Vue

jq的数据与视图混在一块，Vue的数据与视图分离

jq直接用js修改视图，Vue以数据驱动视图

### Vue Router 原理

**利用URL中的hash（“#”）**

    window.addEventListener("hashchange", funcRef, false)

hash有历史记录

push 对window.location.hash进行赋值

replace window.location.replace方法将路由进行替换

**利用History interface在 HTML5中新增的方法**

history模式则会将URL修改得就和正常请求后端的URL一样, 在此情况下重新向后端发送请求，如后端没有配置对应/user/id的路由处理，则会返回404错误。官方推荐的解决办法是在服务端增加一个覆盖所有情况的候选资源：如果 URL 匹配不到任何静态资源，则应该返回同一个 index.html 页面，这个页面就是你 app 依赖的页面。同时这么做以后，服务器就不再返回 404 错误页面，因为对于所有路径都会返回 index.html 文件。

### Mockjs原理

模拟XMLHttpRequest

关键属性 readyState、status、statusText、response、responseText、responseXML 是 readonly，所以，试图通过修改这些状态，来模拟响应是不可行的。 因此，唯一的办法是模拟整个 XMLHttpRequest，就像 jQuery 对事件模型的封装。

window.XMLHttpRequest

window.ActiveXObject

### Vue DIff

采取diff算法比较新旧节点的时候，比较只会在同层级进行, 不会跨层级比较

如果两个节点都是一样的，那么就深入检查他们的子节点。如果两个节点不一样那就说明Vnode完全被改变了，就可以直接替换oldVnode。

- 找到对应的真实dom，称为el
- 判断Vnode和oldVnode是否指向同一个对象，如果是，那么直接return
- 如果他们都有文本节点并且不相等，那么将el的文本节点设置为Vnode的文本节点。
- 如果oldVnode有子节点而Vnode没有，则删除el的子节点
- 如果oldVnode没有子节点而Vnode有，则将Vnode的子节点真实化之后添加到el
- 如果两者都有子节点，则执行updateChildren函数比较子节点，这一步很重要

### 实现 window.requestAnimationFrame 的 polyfill

    if (!window.requestAnimationFrame) window.requestAnimationFrame = (callback) => {
       const id = window.setTimeout(() => {
           callback()
       }, 1000 / 60)
       return id
    }
    if (!window.cancelAnimationFrame) window.cancelAnimationFrame = id => {
       clearTimeout(id)
    }

### git merge 和 git rebase

git merge 

- 只处理一次冲突
- 引入了一次合并的历史记录，合并后的所有 `commit` 会按照提交时间从旧到新排列
- 所有的过程信息更多，可能会提高之后查找问题的难度

<img :src="$withBase('/concept-theory/git-merge-0.png')" class="img-s" alt="merge0"/>

<img :src="$withBase('/concept-theory/git-merge-1.png')" class="img-s" alt="merge1"/>

git rebase 

- 改变当前分支从 `master` 上拉出分支的位置
- 没有多余的合并历史的记录，且合并后的 `commit` 顺序不一定按照 `commit` 的提交时间排列可能会多次解决同一个地方的冲突
- 更清爽一些，`master` 分支上每个 `commit` 点都是相对独立完整的功能单元

<img :src="$withBase('/concept-theory/git-rebase-0.png')" class="img-s" alt="rebase0"/>

<img :src="$withBase('/concept-theory/git-rebase-1.png')" class="img-s" alt="rebase1"/>