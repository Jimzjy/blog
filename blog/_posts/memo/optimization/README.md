---
title: 优化
tags: 
  - memo
---

### WebP 图片优化

WebP是Google开发的一种新的图片格式，它支持有损压缩、无损压缩和透明度，压缩后的文件大小比JPEG、PNG等都要小。所以可以节省带宽，减少页面载入时间，节省用户的流量。

**在浏览器中使用WebP格式**

**1.picture标签**

picture是HTML5中的一个新标签，类似video它也可以指定多个格式的资源，由浏览器选择自己支持的格式进行加载。

    <picture class="picture">
      <source type="image/webp" srcset="image.webp">
      <img class="image" src="image.jpg">
    </picture>

2.**使用JS替换图片的URL**

我们有很多的页面往往会用到图片的“懒加载”——通常是把图片的URL放在img元素的一个自定义属性中，然后用JS在适当的时机将URL赋值给src属性。用类似的原理，我们可以根据浏览器是否支持WebP格式，给img元素赋予不同的src值。

    function checkWebp(callback) {
      var img = new Image();
      img.onload = function () {
        var result = (img.width > 0) && (img.height > 0);
        callback(result);
      };
      img.onerror = function () {
        callback(false);
      };
      img.src = 'data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA';
    }

然后用下面的代码来根据是否支持WebP替换相应的src。

    function showImage(useWebp){
      var imgs = Array.from(document.querySelectorAll('img'));
    
      imgs.forEach(function(i){
        var src = i.attributes['data-src'].value;
    
        if (useWebp){
          src = src.replace(/\.jpg$/, '.webp');
        }
    
        i.src = src;
      });
    }
    
    checkWebp(showImage);

3.**使用JS解码WebP图片**

webpjs

引入这个JS库，就是将所有的WebP图片用JS解码后转换为base64，然后替换掉原来的URL，这样就可以让原本不支持WebP的浏览器正常显示WebP了

### 按需加载优化

babel-plugin-dynamic-import-webpack

### 图片懒加载

把图片的URL放在img元素的一个自定义属性中，然后用JS在适当的时机将URL赋值给src属性

**Intersection Observer**

### 雪碧图

将小图标和背景图像合并到一张图片上，然后利用css的背景定位来显示

### preload 和 prefetch

preload 提供了一种声明式的命令，让浏览器提前加载指定资源(加载后并不执行)，在需要执行的时候再执行。提供的好处主要是

- 将加载和执行分离开，可不阻塞渲染和 document 的 onload 事件
- 提前加载指定资源，不再出现依赖的font字体隔了一段时间才刷出

**使用 preload**

link 标签

    <!-- 使用 link 标签静态标记需要预加载的资源 -->
    <link rel="preload" href="/path/to/style.css" as="style">
    
    <!-- 或使用脚本动态创建一个 link 标签后插入到 head 头部 -->
    <script>
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = '/path/to/style.css';
    document.head.appendChild(link);
    </script>

http头

    Link: <https://example.com/other/styles.css>; rel=preload; as=style

- preload 是告诉浏览器页面**必定**需要的资源，浏览器**一定会**加载这些资源；
- prefetch 是告诉浏览器页面**可能**需要的资源，浏览器**不一定会**加载这些资源。

preload 是确认会加载指定资源，如在我们的场景中，x-report.js 初始化后一定会加载 PcCommon.js 和 TabsPc.js, 则可以预先 preload 这些资源；

prefetch 是预测会加载指定资源，如在我们的场景中，我们在页面加载后会初始化首屏组件，当用户滚动页面时，会拉取第二屏的组件，若能预测用户行为，则可以 prefetch 下一屏的组件。

### tree shaking

1. ES6的模块引入是静态分析的，故而可以在编译时正确判断到底加载了什么代码。
2. 分析程序流，判断哪些变量未被使用、引用，进而删除此代码。

### 动画性能方向

- 一般 CSS3 动画会比基于 JavaScript 实现的动画效率要高，因此优先使用 CSS3 实现效果（这一点并不绝对）
- 在使用 CSS3 实现动画时，考虑开启 GPU 加速（这一点也并不总是正向效果）
- 优先使用消耗最低的 transform 和 opacity 两个属性 (避免 reflow repaint)
- 使用 will-change 属性
- 独立合成层，减少绘制区域
- 对于只能使用 JavaScript 实现动画效果的情况，考虑 requestAnimationFrame、requestIdleCallback API
- 批量进行样式变换，减少布局抖动

**如何开启 GPU 加速**

触发硬件加速的css属性：

- transform
- opacity
- filters
- Will-change

目前下面这些因素都会引起Chrome创建合成层：

1. 3D 或透视变换(perspective，transform) CSS 属性
2. 使用加速视频解码的video元素
3. 拥有 3D (WebGL) 上下文或加速的 2D 上下文的 canvas 元素
4. 混合插件(如 Flash)
5. 对自己的 opacity 做 CSS 动画或使用一个动画 webkit 变换的元素
6. 拥有加速 CSS 过滤器的元素
7. 元素A有一个 z-index 比自己小的元素B，且元素B是一个合成层（换句话说就是该元素在复合层上面渲染），则元素A会提升为合成层

### 事件委托

    window.onload = () => {
       const ul = document.getElementsByTagName('ul')[0]
       const liList = document.getElementsByTagName('li')
    
       ul.onclick = e => {
           const normalizeE = e || window.event
           const target = normalizeE.target || normalizeE.srcElement
    
           if (target.nodeName.toLowerCase() == "li") {
               alert(target.innerHTML)
           }
       }
    }

### 节流和防抖

- 防抖：抖动现象本质就是指短时间内高频次触发。因此，我们可以把短时间内的多个连续调用合并成一次，也就是只触发一次回调函数。
- 节流：顾名思义，就是将短时间的函数调用以一个固定的频率间隔执行，这就如同水龙头开关限制出水口流量。

**防抖**

采取最后一次

    const debounce = (func, wait) => {
       let timeout
       return function () {
           const context = this
           const args = arguments
    
           timeout && clearTimeout(timeout)
           timeout = setTimeout(function() {
               timeout = null
               func.apply(context, args)
           }, wait)
       }
    }

    const debounce = (func, wait, immediate) => {
       let timeout
       return function () {
           const context = this
           const args = arguments
    
           const callNow = immediate && !timeout
    
           timeout && clearTimeout(timeout)
    
           timeout = setTimeout(function() {
               timeout = null
               if (!immediate) func.apply(context, args)
           }, wait)
    
           if (callNow) func.apply(context, args)
       }
    }

**节流**

采取第一次

    const throttle = (func, wait) => {
       let startTime = 0
       return function() {
           let handleTime = +new Date()
           let context = this
           const args = arguments
    
           if (handleTime - startTime >= wait) {
               func.apply(context, args)
               startTime = handleTime
           }
       }
    }

    const throttle = (func, wait) => {
       let timeout
    
       return function () {
           const context = this
           const args = arguments
           if (!timeout) {
               timeout = setTimeout(function() {
                   func.apply(context, args)
                      timeout = null
             }, wait)
           }
       }
    }