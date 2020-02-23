---
title: H5&CSS
tags: 
  - memo
---

# H5&CSS

### link 和 @import 的区别

1.@import是 CSS 提供的语法规则，只有导入样式表的作用；link是HTML提供的标签，不仅可以加载 CSS 文件，还可以定义 RSS、rel 连接属性等.

2.加载页面时，link标签引入的 CSS 被同时加载；@import引入的 CSS 将在页面加载完毕后被加载.

3.@import是 CSS2.1 才有的语法，故只可在 IE5+ 才能识别；link标签作为 HTML 元素，不存在兼容性问题.

4.可以通过 JS 操作 DOM ，插入link标签来改变样式；由于DOM方法是基于文档的，无法使用@import的方式插入样式.

### css的权重优先级

```
!important > 行内样式 > ID > 类、伪类、属性 > 标签名 > 继承 > 通配符
```

### :root

```
:root 这个 CSS 伪类匹配文档树的根元素。对于 HTML 来说，:root 表示 <html> 元素，除了优先级更高之外，与 html 选择器相同.
```

### rem

rem 相对于根节点（html）的字体大小，根节点一个大写字母 M 的宽度

### em

一个大写字母 M 的宽度

对于 font-size 来说，em 相对于父元素的字体大小；line-height 中，em 却相对于自身字体的大小

### vmin vmax

vmin 视口高度和宽度之间的最小值的 1/100

vmax 视口高度和宽度之间的最大值的 1/100

### % 相对于谁

**position: absolute 中的 %**

这个元素的祖先元素中第一个存在定位属性的元素

**position: relative 中的 %**

相对与自身的

**position: fixed 中的 %**

相对于视口的

**margin 和 padding 的 %**

相对于父元素的宽度

**border-radius 的 % , transform： translate , background-size 的 %**

相对于自身宽高

**text-indent 的 %**

相对于父元素的 width

**font-size 的 %**

相对于父元素的字体大小

**line-height 的 %**

相对于该元素的 font-size 数值

### css两列布局

.left bfc

flex

### css3新增选择器

**新增属性选择器:**

E[foo^="bar"]

选择匹配E的元素，且该元素定义了foo属性，foo属性值以“bar”开始。E选择符可以省略，表示可匹配任意类型的元素。

E[foo$="bar"]

选择匹配E的元素，且该元素定义了foo属性，foo属性值以“bar”结束。E选择符可以省略，表示可匹配任意类型的元素。

E[foo*="bar"]

选择匹配E的元素，且该元素定义了foo属性，foo属性值包含“bar”。E选择符可以省略，表示可匹配任意类型的元素。

**老的容易忘记的属性选择器**

E[foo~="bar"]

选择匹配E的元素，且该元素定义了foo属性，foo属性值是一个以空格符分隔的列表，其中一个列表的值为“bar”，E选择符可以省略。

E[foo!="en"]

选择匹配E的元素，且该元素定义了foo属性，foo属性值是一个用连字符（-）分隔的列表，值以“en”开头。

**新增结构伪类选择器：**

1. E:root 匹配文档所在的根元素
2. E:nth-child(n) 匹配E所在父元素第n个匹配E的元素，非E的子元素也参与排序，若第n个子元素不是E元素，则该语句没有效果（注意这里的n从1开始）
3. E:nth-last-child(n) 匹配E所在父元素倒数第n个匹配E的元素
4. E:nth-of-type(n) 匹配E所在父元素第n个匹配E的元素，非E的子元素不参与排序(n同样是从1开始）注意区别nth-child(n)
5. E:last-child
6. E:first-of-type
7. E:last-of-type
8. E:only-child
9. E:only-of-type
10. E:empty

### CSS动画 transition-timing-function

1. `linear`：匀速
2. `ease`：先加速后减速，速度变化大
3. `ease-in`：加速
4. `ease-out`：减速
5. `ease-in-out`：先加速后减速，但是速度变化小
6. `cubic-bezier(n,n,n,n)`：三次贝塞尔曲线可以实现更复杂的渡效果的速度变化
7. `step-start`：直接跳到最终状态
8. `step-end`：保持初始状态，到达持续时间时，立刻变成最终状态
9. `steps(number,start)`：分几步完成过渡，变化发生在间隔开始时
10. `steps(number,end)`：变化发生在间隔结束时

### H5新特性

**新增元素**

结构元素：article、aside、header、hgroup、footer、figure、section、nav

其他元素：video、audio、canvas、embed、mark、progress、meter、time、command、details、datagrid、keygen、output、source、menu、ruby、wbr、bdi、dialog、

**废除的元素**

纯表现元素：basefont、big、center、font、s、strike、tt、u 

用css代替部分浏览器支持的元素：applet、bgsound、blink、marquee

对可用性产生负面影响的元素：frameset、frame、noframes,在html5中不支持frame框架，只支持iframe框架

**新增的API**

1.Canvas, 2.SVG, 3.音频和视频

4.Geolocation

```javascript
navigator.geolocation.getCurrentPosition(updateLocation,handleLocationError);
//更新位置信息
function updateLocation(position){
  //纬度
  var latitude = position.coords.latitude.
  //经度
  var longitude = position.coords.longitude.
  //准确度
  var accuracy = position.coords.accuracy.
  //时间戳
  var timestamp = position.coords.timestamp.
  }
//处理错误信息
function handleLocationError(error){
  console.log(error);
}
//监听位置更新
var watchId=navigator.geolocation.watchPostion(updateLocation,handleLocationError);
//不再接收位置更新
navigator.geolocation.clearWatch(watchId);
```

5.Communication

```javascript
//发送消息
window.postMessage('hello,world','http://www.example.com');
//接收消息
window.addEventListener('message',messageHandler,true);
function messageHandler(e){
  switch(e.origin){
    case 'friend.example.com':
      //处理消息
      processMessage(e.data);
    break;
    default:
    break;
  }
}
```

6.XMLHttpRequest Level2：改进了跨源XMLHttpRequest和进度事件

7.WebSockets

8.Forms：新表单元素tel、email、url、search、range、number 未来的表单元素color、datetime、datetime-local、time、date、week、month

9.新表单特性和函数：placeholder、autocomplete、autofocus、spellcheck、list特性、datalist元素、min和max、step、required

10.拖放API：draggable属性、拖放事件(dragstart、drag、dragenter、dragleave、dragover、drap、dragend)、dataTransfer对象

```javascript
<div id="draggable" draggable="true">Draggable Div</div>
<script>
  var draggableElement = document.getElementById("draggable");
  draggableElement.addEventListener('dragstart',function(event){
    console.log("拖动开始！");
    event.dataTransfer.setData('text','hello world!');
  })
</script>
```

11.Web Workers API：Web Workers可以让Web应用程序具备后台处理能力，对多线程的支持性非常好。但是在Web Workers中执行的脚本不能访问该页面的window对象，也就是Web Workers不能直接访问Web页面和DOM API。虽然Web Workers不会导致浏览器UI停止响应，但是仍然会消耗CPU周期，导致系统反应速度变慢。

12.Web Storage API：sessionStorage(保存在session中，浏览器关闭，数据消失)、localStorage(保存在客户端本地，除非手动删除，否则一直保存)

![大小限制](/h5-css/storage-size.png)

### CSS3新特性

**Transition**

**Transform**

**Animation**

**边框**

border-radius、box-shadow和border-image

**背景**

background-clip、background-origin、background-size和box-decoration-break

**文字效果**

word-wrap, text-overflow, text-shadow, text-decoration

**渐变**

linear-gradient(线性渐变)和radial-gradient(径向渐变)

**@font-face特性**

```css
@font-face {
  font-family: "Open Sans";
  src: url("/fonts/OpenSans-Regular-webfont.woff2") format("woff2"),
        url("/fonts/OpenSans-Regular-webfont.woff") format("woff");
}
```

**多列布局**

1. column-count: 规定元素应该被分隔的列数。
2. column-gap: 规定列之间的间隔。
3. column-rule: 设置列之间的宽度、样式和颜色规则

**用户界面**

resize, box-sizing, outline-offset

### defer 和 async

**1. `<script src="script.js">`**

没有 defer 或 async,浏览器会立即加载并执行指定的脚本,“立即”指的是在渲染该 script 标签之下的文档元素之前,也就是说不等待后续载入的文档元素,读到就加载并执行。

**2. `<script async src="script.js">`**

有 async,加载和渲染后续文档元素的过程将和 script.js 的加载与执行并行进行（异步）。

**3. `<script defer src="myscript.js">`**

有 defer,加载后续文档元素的过程将和 script.js 的加载并行进行（异步）,但是 script.js 的执行要在所有元素解析完成之后,DOMContentLoaded 事件触发之前完成。

从实用角度来说,首先把所有脚本都丢到 </body> 之前是最佳实践,因为对于旧浏览器来说这是唯一的优化选择,此法可保证非脚本的其他一切元素能够以最快的速度得到加载和解析。

![defer-async](/h5-css/defer-async.png)

### meta

    //声明文档使用的字符编码
    <meta charset="utf-8">
    
    //优先使用 IE 最新版本和 Chrome
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
    
    //页面描述
    <meta name="description" content="网页描述"/>
    
    //页面关键词
    <meta name="keywords" content=""/>
    
    //网页作者
    <meta name="author" content="name, email@gmail.com"/>
    
    //搜索引擎抓取
    <meta name="robots" content="index,follow"/>
    
    //为移动设备添加 viewport
    <meta name="viewport" content="initial-scale=1, maximum-scale=3, minimum-scale=1, user-scalable=no">
    
    //添加智能 App 广告条 Smart App Banner（iOS 6+ Safari）
    <meta name="apple-itunes-app" content="app-id=myAppStoreID, affiliate-data=myAffiliateData, app-argument=myURL">
    
    //设置苹果工具栏颜色
    <meta name="apple-mobile-web-app-status-bar-style" content="black"/>
    
    //启用360浏览器的极速模式(webkit)
    <meta name="renderer" content="webkit">
    
    //避免IE使用兼容模式
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    
    //不让百度转码
    <meta http-equiv="Cache-Control" content="no-siteapp" />
    
    //针对手持设备优化，主要是针对一些老的不识别viewport的浏览器，比如黑莓
    <meta name="HandheldFriendly" content="true">
    
    //微软的老式浏览器
    <meta name="MobileOptimized" content="320″>
    
    //uc强制竖屏
    <meta name="screen-orientation" content="portrait">
    
    //QQ强制竖屏
    <meta name="x5-orientation" content="portrait">
    
    //UC强制全屏
    <meta name="full-screen" content="yes">
    
    //QQ强制全屏
    <meta name="x5-fullscreen" content="true">
    
    //UC应用模式
    <meta name="browsermode" content="application">
    
    //QQ应用模式
    <meta name="x5-page-mode" content="app">
    
    //windows phone 点击无高光
    <meta name="msapplication-tap-highlight" content="no">
    
    //设置页面不缓存
    <meta http-equiv="pragma" content="no-cache">
    <meta http-equiv="cache-control" content="no-cache">
    <meta http-equiv="expires" content="0">

### input type="file"

    <input type="file" accept="image/" capture="camera" onchange="previewFile()">
    <img src="" height="200" alt="Image preview...">

    function previewFile() {
      const preview = document.querySelector('img');
      const file = document.querySelector('input[type=file]').files[0];
      const reader = new FileReader();
    
      reader.addEventListener("load", function () {
        // convert image file to base64 string
        preview.src = reader.result;
      }, false);
    
      if (file) {
        reader.readAsDataURL(file);
      }
    }

### chrome的字体最小为12px，如何设置10px的字体

transform:scale()

### font-weight是数字有可能会失效

一些特殊的字体，它们没有实现该粗细的字体

### BFC,IFC

**BFC**

块级格式化上下文, 页面上的一个隔离的渲染区域，容器里面的子元素不会在布局上影响到外面的元素,

反之也是如此.

**IFC**

内联格式化上下文, IFC的line box（线框）高度由其包含行内元素中最高的实际高度计算而来（不受到竖直方向的padding/margin影响) .

水平居中：当一个块要在环境中水平居中时，设置其为inline-block则会在外层产生IFC，通过text-align则可以使其水平居中。

垂直居中：创建一个IFC，用其中一个元素撑开父元素的高度，然后设置其vertical-align:middle，其他行内元素则可以在此父元素下垂直居中。

    <div style="border: 1px solid #000;">
      <span style="height: 100px; display: inline-block; vertical-align: middle; border: 1px solid #000;">000</span>
      <span>111</span>
      <span>222</span>
      <span>333</span>
    </div>

![ifc](/h5-css/ifc.png)

### 文本截断

单行

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

多行

    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;

### inline-block/inline 间隙问题

![inline间隙问题](/h5-css/inline.png)

    <div class="wrapper">
      <div class="inner">111</div>
      <div class="inner">222</div>
      <div class="inner">333</div>
    </div>
    
    .inner {
      display: inline-block; // 或者inline
      padding: 20px;
      background: black;
      color: #fff;
    }

    // 1
    .wrapper { font-size: 0; }
    .inner { font-size: 16px; }
    
    // 2
    <div class="wrapper">
    	<div class="inner">111</div><div class="inner">222</div><div class="inner">333</div>
    </div>
    
    // 3
    .wrapper { display: flex; }