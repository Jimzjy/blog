---
title: 浏览器相关
date: 2020-01-01
author: All
tags: 
  - memo
---

### 执行过程

**加载：** 根据请求的url进行域名解析，然后向服务器发送请求，接收响应文件（如HTML、CSS、JS、图片等）.

**解析：** 对加载到的资源（HTML、CSS、JS等）进行语法解析，构建响应的内部数据结构（如HTML的DOM树，JS对象的属性表，css样式规则等）.

**渲染：** 构建渲染树，对各个元素进行位置计算、样式计算等，然后根据渲染书完成页面的布局及绘制的过程（产生页面的元素）.

1. 解析 HTML 文件,构建 DOM 树,同时浏览器主进程负责下载 CSS 文件
2. CSS 文件下载完成,解析 CSS 文件成树形的数据结构,然后结合 DOM 树合并成 RenderObject 树
3. 布局 RenderObject 树 （Layout/reflow）,负责 RenderObject 树中的元素的尺寸,位置等计算
4. 绘制 RenderObject 树 （paint）,绘制页面的像素信息
5. 浏览器主进程将默认的图层和复合图层交给 GPU 进程,GPU 进程再将各个图层合成（composite）,最后显示出页面

<img :src="$withBase('/broswer/run.png')" alt="run"/>

### 浏览器线程

浏览器是拥有多个线程的比如：gui渲染线程、JS引擎线程、事件触发线程、异步http请求线程

### Event Loop

**JavaScript的运行机制**

（1）所有同步任务都在主线程上执行，形成一个执行栈（execution context stack）。

（2）主线程之外，还存在"任务队列"(task queue)。只要异步任务有了运行结果，就在"任务队列"之中放置一个事件。

（3）一旦"执行栈"中的所有同步任务执行完毕，系统就会读取"任务队列"，看看里面有哪些事件。那些对应的异步任务，于是结束等待状态，进入执行栈，开始执行。

（4）主线程不断重复上面的第三步

**宏任务**: script（整体代码）, setTimeout, setInterval, setImmediate, I/O, UI rendering

**微任务**: process.nextTick（Nodejs）, Promises, Object.observe, MutationObserver;

**事件循环(event-loop)是什么**

<img :src="$withBase('/broswer/event-loop.png')" class="img-s" alt="event-loop">

主线程从"任务队列"中读取执行事件，这个过程是循环不断的，这个机制被称为事件循环。此机制具体如下:主线程会不断从任务队列中按顺序取任务执行，每执行完一个任务都会检查microtask队列是否为空（执行完一个任务的具体标志是函数执行栈为空），如果不为空则会一次性执行完所有microtask。然后再进入下一个循环去任务队列中取下一个任务执行.

    console.log('script start');
    
    setTimeout(function () {
        console.log('setTimeout---0');
    }, 0);
    
    setTimeout(function () {
        console.log('setTimeout---200');
        setTimeout(function () {
            console.log('inner-setTimeout---0');
        });
        Promise.resolve().then(function () {
            console.log('promise5');
        });
    }, 200);
    
    Promise.resolve().then(function () {
        console.log('promise1');
    }).then(function () {
        console.log('promise2');
    });
    Promise.resolve().then(function () {
        console.log('promise3');
    });
    console.log('script end');

    script start
    script end
    promise1
    promise3
    promise2
    setTimeout---0
    setTimeout---200
    promise5
    inner-setTimeout---0

**为什么会需要event-loop**

因为 JavaScript 是单线程的。单线程就意味着，所有任务需要排队，前一个任务结束，才会执行后一个任务。如果前一个任务耗时很长，后一个任务就不得不一直等着。为了协调事件（event），用户交互（user interaction），脚本（script），渲染（rendering），网络（networking）等，用户代理（user agent）必须使用事件循环（event loops）。

### 回流和重绘

浏览器使用流式布局模型 (Flow Based Layout)。

浏览器会把`HTML`解析成`DOM`，把`CSS`解析成`CSSOM`，`DOM`和`CSSOM`合并就产生了`RenderTree`。

有了`RenderTree`，我们就知道了所有节点的样式，然后计算他们在页面上的大小和位置，最后把节点绘制到页面上。

由于浏览器使用流式布局，对`RenderTree`的计算通常只需要遍历一次就可以完成，但`table`及其内部元素除外，他们可能需要多次计算，通常要花3倍于同等元素的时间，这也是为什么要避免使用`table`布局的原因之一。

**回流必将引起重绘，重绘不一定会引起回流**

**回流**

当Render Tree中部分或全部元素的尺寸、结构、或某些属性发生改变时，浏览器重新渲染部分或全部文档的过程称为回流。

会导致回流的操作：

- 页面首次渲染
- 浏览器窗口大小发生改变
- 元素尺寸或位置发生改变
- 元素内容变化（文字数量或图片大小等等）
- 元素字体大小变化
- 添加或者删除**可见**的`DOM`元素
- 激活`CSS`伪类（例如：`:hover`）
- 查询某些属性或调用某些方法

一些常用且会导致回流的属性和方法：

- `clientWidth`、`clientHeight`、`clientTop`、`clientLeft`
- `offsetWidth`、`offsetHeight`、`offsetTop`、`offsetLeft`
- `scrollWidth`、`scrollHeight`、`scrollTop`、`scrollLeft`
- `scrollIntoView()`、`scrollIntoViewIfNeeded()`
- `getComputedStyle()`
- `getBoundingClientRect()`
- `scrollTo()`

**重绘**

当页面中元素样式的改变并不影响它在文档流中的位置时（例如：color、background-color、visibility等），浏览器会将新样式赋予给元素并重新绘制它，这个过程称为重绘。

**性能**

浏览器会维护一个队列，把所有引起回流和重绘的操作放入队列中，如果队列中的任务数量或者时间间隔达到一个阈值的，浏览器就会将队列清空，进行一次批处理，这样可以把多次回流和重绘变成一次。

当你访问以下属性或方法时，浏览器会立刻清空队列：

- `clientWidth`、`clientHeight`、`clientTop`、`clientLeft`
- `offsetWidth`、`offsetHeight`、`offsetTop`、`offsetLeft`
- `scrollWidth`、`scrollHeight`、`scrollTop`、`scrollLeft`
- `width`、`height`
- `getComputedStyle()`
- `getBoundingClientRect()`

**如何避免**

触发硬件加速的css属性：

- transform
- opacity
- filters
- will-change

**CSS**

- 避免使用`table`布局。
- 尽可能在`DOM`树的最末端改变`class`。
- 避免设置多层内联样式。
- 将动画效果应用到`position`属性为`absolute`或`fixed`的元素上。
- 避免使用`CSS`表达式（例如：`calc()`）。

**JavaScript**

- 避免频繁操作样式，最好一次性重写`style`属性，或者将样式列表定义为`class`并一次性更改`class`属性。
- 避免频繁操作`DOM`，创建一个`documentFragment`，在它上面应用所有`DOM操作`，最后再把它添加到文档中。
- 也可以先为元素设置`display: none`，操作结束后再把它显示出来。因为在`display`属性为`none`的元素上进行的`DOM`操作不会引发回流和重绘。
- 避免频繁读取会引发回流/重绘的属性，如果确实需要多次使用，就用一个变量缓存起来。
- 对具有复杂动画的元素使用绝对定位，使它脱离文档流，否则会引起父元素及后续元素频繁回流。

### 缓存

优先级:

1. Service Worker
2. Memory Cache
3. Disk Cache

浏览器的资源缓存分为 from disk cache 和 from memory cache 两类。当首次访问网页时，资源文件被缓存在内存中，同时也会在本地磁盘中保留一份副本。当用户刷新页面，如果缓存的资源没有过期，那么直接从内存中读取并加载。当用户关闭页面后，当前页面缓存在内存中的资源被清空。当用户再一次访问页面时，如果资源文件的缓存没有过期，那么将从本地磁盘进行加载并再次缓存到内存之中。

<img :src="$withBase('/broswer/cache.png')"/>

**强缓存**

强缓存是指客户端在第一次请求后，有效时间内不会再去请求服务器，而是直接使用缓存数据。

HTTP 1.0 版本规定响应头字段 Expires

    Expires:Tue, 13 May 2020 09:33:34 GMT

上述 Expires 信息告诉浏览器：在 2020.05.13 号之前,可以直接使用该文本的缓存副本。

Expires 为负数，那么就等同于 no-cache，正数或零同 max-age 的表意是相同的。

使用 Expires 响应头存在一些小的瑕疵，比如：

- 可能会因为服务器和客户端的 GMT 时间不同，出现偏差
- 如果修改了本地时间，那么客户端端日期可能不准确
- 写法太复杂，字符串多个空格，少个字母，都会导致非法属性从而设置失效

在 HTTP 1.1 版本中，服务端使用 Cache-control 这个响应头

    Cache-Control:private, max-age=0, must-revalidate
    // 它表示：该资源只能被浏览器缓存，而不能被代理缓存。max-age 标识为 0，说明该缓存资源立即过期，must-revalidate 告诉浏览器，需要验证文件是否过期，接下来可能会使用协商缓存进行判断。

- private：表示私有缓存，不能被共有缓存代理服务器缓存，不能在用户间共享，可被用户的浏览器缓存。
- public：表示共有缓存，可被代理服务器缓存，比如 CDN，允许多用户间共享
- max-age：值以秒为单位，表示缓存的内容会在该值后过期
- no-cache：需要使用协商缓存，协商缓存的内容我们后面介绍。注意这个字段并不表示不使用缓存
- no-store：所有内容都不会被缓存
- must-revalidate：告诉浏览器，你这必须再次验证检查信息是否过期, 返回的代号就不是 200 而是 304 了

**HTTP 规定，如果 Cache-control 的 max-age 和 Expires 同时出现，那么 max-age 的优先级更高，他会默认覆盖掉 expires。**

**协商缓存**

在浏览器端，当对某个资源的请求没有命中强缓存时，浏览器就会发一个请求到服务器，验证协商缓存是否命中，如果协商缓存命中，请求响应返回的 HTTP 状态为 304

**Last-Modified，If-Modified-Since**

- 浏览器第一次请求资源，服务端在返回资源的响应头中加入 Last-Modified 字段，这个字段表示这个资源在服务器上的最近修改时间

`Last-Modified: Tue, 12 Jan 2019 09:08:53 GMT`

- 浏览器收到响应，并记录 Last-Modified 这个响应头的值为 T
- 当浏览器再次向服务端请求该资源时，请求头加上 If-Modified-Since 的 header，这个 If-Modified-Since 的值正是上一次请求该资源时，后端返回的 Last-Modified 响应头值 T
- 服务端再次收到请求，根据请求头 If-Modified-Since 的值 T，判断相关资源是否在 T 时间后有变化；如果没有变化则返回 304 Not Modified，且并不返回资源内容，浏览器使用资源缓存值；如果有变化，则正常返回资源内容，且更新 Last-Modified 响应头内容

**ETag、If-None-Match**

- 浏览器第一次请求资源，服务端在返回资源的响应头中加入 Etag，Etag 能够弥补 Last-Modified 的问题，因为 Etag 的生成过程类似文件 hash 值，Etag 是一个字符串，不同文件内容对应不同的 Etag 值

`ETag:"751F63A30AB5F98F855D1D90D217B356"`

- 浏览器收到响应，记录 Etag 这个响应头的值为 E
- 浏览器再次跟服务器请求这个资源时，在请求头上加上 If-None-Match，值为 Etag 这个响应头的值 E
- 服务端再次收到请求，根据请求头 If-None-Match 的值 E，根据资源生成一个新的 ETag，对比 E 和新的 Etag：如果两值相同，则说明资源没有变化，返回 304 Not Modified，同时携带着新的 ETag 响应头；如果两值不同，就正常返回资源内容，这时也更新 ETag 响应头
- 浏览器收到 304 的响应后，就会从缓存中加载资源

Etag 的生成策略，实际上规范并没有强制说明，这就取决于各大厂商或平台的自主实现方式了：Apache 中，ETag 的值，默认是对文件的索引节（INode），大小（Size）和最后修改时间（MTime）进行混淆后得到的；MDN 使用 wiki 内容的十六进制数字的哈希值

**Etag 优先级比 Last-Modified 高**，如果他们组合出现在请求头当中，我们会优先采用 Etag 策略。同时 Etag 也有自己的问题：相同的资源，在两台服务器产生的 Etag 是不是相同的，所以对于使用服务器集群来处理请求的网站来说， Etag 的匹配概率会大幅降低。所在在这种情况下，使用 Etag 来处理缓存，反而会有更大的开销。

**优先级上：Cache-Control > Expires > ETag > Last-Modified**

### Service Worker

不懂

### 提高缓存命中率

命中：可以直接通过缓存获取到需要的数据。

不命中：无法直接通过缓存获取到想要的数据，需要再次查询数据库或者执行其它的操作。原因可能是由于缓存中根本不存在，或者缓存已经过期。

**1.缓存的设计（粒度和策略）**

缓存的粒度越小，命中率会越高.

只有当该对象对应的数据发生变化时，我们才需要更新缓存或者让移除缓存。而当缓存一个集合的时候（例如：所有用户数据），其中任何一个对象对应的数据发生变化时，都需要更新或移除缓存。

**2.缓存容量和基础设施**

缓存的容量有限，则容易引起缓存失效和被淘汰.

### 缓存和浏览器操作

- 当用户 Ctrl + F5 强制刷新网页时，浏览器直接从服务器加载，跳过强缓存和协商缓存
- 当用户仅仅敲击 F5 刷新网页时，跳过强缓存，但是仍然会进行协商缓存过程

<img :src="$withBase('/broswer/cache-broswer.png')"/>

**如何禁止浏览器缓存静态资源**

使用 Chrome 隐私模式，在代码层面可以设置相关请求头：

    Cache-Control: no-cache, no-store, must-revalidate

也可以给请求的资源增加一个版本号

或者meta

    ＜meta http-equiv="Pragma" content="no-cache"＞

### DOMContentLoaded

当 DOMContentLoaded 事件触发时,仅当 DOM 解析完成后,不包括样式表,图片。

**CSS 加载会阻塞 Dom 的渲染和后面 js 的执行,js 会阻塞 Dom 解析**

当文档中没有脚本时,浏览器解析完文档便能触发 DOMContentLoaded 事件。如果文档中包含脚本,则脚本会阻塞文档的解析,而脚本需要等 CSSOM 构建完成才能执行。在任何情况下,DOMContentLoaded 的触发不需要等待图片等其他资源加载完成。

### CRP关键渲染路径

关键渲染路径是浏览器将 HTML CSS JavaScript 转换为在屏幕上呈现的像素内容所经历的一系列步骤。也就是浏览器渲染流程。

- 关键资源的数量: 可能阻止网页首次渲染的资源。
- 关键路径长度: 获取所有关键资源所需的往返次数或总时间。
- 关键字节: 实现网页首次渲染所需的总字节数,等同于所有关键资源传送文件大小的总和。

### 渲染层合并

<img :src="$withBase('/broswer/render-layer.png')"/>

RenderLayers 渲染层,这是负责对应 DOM 子树。

GraphicsLayers 图形层,这是负责对应 RenderLayers 子树。

RenderObjects 保持了树结构,一个 RenderObjects 知道如何绘制一个 node 的内容, 他通过向一个绘图上下文（GraphicsContext）发出必要的绘制调用来绘制 nodes。

每个 GraphicsLayer 都有一个 GraphicsContext,GraphicsContext 会负责输出该层的位图,位图是存储在共享内存中,作为纹理上传到 GPU 中,最后由 GPU 将多个位图进行合成,然后 draw 到屏幕上,此时,我们的页面也就展现到了屏幕上。

GraphicsContext 绘图上下文的责任就是向屏幕进行像素绘制(这个过程是先把像素级的数据写入位图中,然后再显示到显示器),在 chrome 里,绘图上下文是包裹了的 Skia（chrome 自己的 2d 图形绘制库）

某些特殊的渲染层会被认为是合成层（Compositing Layers）,合成层拥有单独的 GraphicsLayer,而其他不是合成层的渲染层,则和其第一个拥有 GraphicsLayer 父层公用一个。

**合成层的优点**

一旦 renderLayer 提升为了合成层就会有自己的绘图上下文,并且会开启硬件加速,有利于性能提升。

- 合成层的位图,会交由 GPU 合成,比 CPU 处理要快 (提升到合成层后合成层的位图会交 GPU 处理,但请注意,仅仅只是合成的处理（把绘图上下文的位图输出进行组合）需要用到 GPU,生成合成层的位图处理（绘图上下文的工作）是需要 CPU。)
- 当需要 repaint 时,只需要 repaint 本身,不会影响到其他的层 (当需要 repaint 的时候可以只 repaint 本身,不影响其他层,但是 paint 之前还有 style, layout,那就意味着即使合成层只是 repaint 了自己,但 style 和 layout 本身就很占用时间。)
- 对于 transform 和 opacity 效果,不会触发 layout 和 paint (仅仅是 transform 和 opacity 不会引发 layout 和 paint,其他的属性不确定。)

一般一个元素开启硬件加速后会变成合成层,可以独立于普通文档流中,改动后可以避免整个页面重绘,提升性能。

注意不能滥用 GPU 加速,一定要分析其实际性能表现。因为 GPU 加速创建渲染层是有代价的,每创建一个新的渲染层,就意味着新的内存分配和更复杂的层的管理。并且在移动端 GPU 和 CPU 的带宽有限制,创建的渲染层过多时,合成也会消耗跟多的时间,随之而来的就是耗电更多,内存占用更多。过多的渲染层来带的开销而对页面渲染性能产生的影响,甚至远远超过了它在性能改善上带来的好处。

### 验证 storage 有效性

类似Etag的方法