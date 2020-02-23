---
title: 网络相关
tags: 
  - memo
---

# 网络相关

### **http状态码301和302**

301 redirect: 301 代表永久性转移(Permanently Moved)

302 redirect: 302 代表暂时性转移(Temporarily Moved )

301会被搜索引擎和浏览器记住

**短网址对应完整网址的映射关系和跳转关系不会发生变化，应该是 301 永久重定向才对。但是更多的短网址生成平台却采用了 302，这是为什么呢？**

如果用了 301，Google、百度等搜索引擎，搜索的时候会直接展示真实地址，那我们就无法统计到短地址被点击的次数了，也无法收集用户的 Cookie、User Agent 等信息，这些信息可以用来做很多有意思的大数据分析，也是短网址服务商的主要盈利来源。

### **同源策略限制内容**

- Cookie、LocalStorage、IndexedDB 等存储性内容
- DOM 节点
- AJAX 请求发送后，结果被浏览器拦截了

### 怎么实现跨域的

有三个标签是允许跨域加载资源：

- `<img src=XXX>`
- `<link href=XXX>`
- `<script src=XXX>`

**1.jsonp**

    function jsonp(req) {
    	var script = document.createElement('script');
      var url = req.url + '?callback=' + req.callback.name;
      script.src = url;
      document.getElementsByTagName('head')[0].appendChild(script);
    }
    
    // 服务端返回
    callback(json)
    
    // 可靠实现
    (function (global) {
        var id = 0,
            container = document.getElementsByTagName("head")[0];
    
        function jsonp(options) {
            if(!options || !options.url) return;
    
            var scriptNode = document.createElement("script"),
                data = options.data || {},
                url = options.url,
                callback = options.callback,
                fnName = "jsonp" + id++;
    
            // 添加回调函数
            data["callback"] = fnName;
    
            // 拼接url
            var params = [];
            for (var key in data) {
                params.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
            }
            url = url.indexOf("?") > 0 ? (url + "&") : (url + "?");
            url += params.join("&");
            scriptNode.src = url;
    
            // 传递的是一个匿名的回调函数，要执行的话，暴露为一个全局方法
            global[fnName] = function (ret) {
                callback && callback(ret);
                container.removeChild(scriptNode);
                delete global[fnName];
            }
    
            // 出错处理
            scriptNode.onerror = function () {
                callback && callback({error:"error"});
                container.removeChild(scriptNode);
                global[fnName] && delete global[fnName];
            }
    
            scriptNode.type = "text/javascript";
            container.appendChild(scriptNode)
        }
    
        global.jsonp = jsonp;
    
    })(this);

**2.cors**

[CORS 简单请求+预检请求（彻底理解跨域） · Issue #62 · amandakelake/blog](https://github.com/amandakelake/blog/issues/62)

使用CORS时，异步请求会被分为简单请求和非简单请求，非简单请求的区别是会先发一次预检请求.

Access-Control-Allow-Origin

Access-Control-Allow-Headers

Access-Control-Allow-Methods

Access-Control-Allow-Credentials

**简单请求条件**

条件1：使用下列方法之一：

- GET
- HEAD
- POST

条件2：Content-Type 的值仅限于下列三者之一：

- text/plain
- multipart/form-data
- application/x-www-form-urlencoded

**3.postMessage**

    otherWindow.postMessage(message, targetOrigin, [transfer]);

**4.websocket**

**5. Node中间件代理**

**同源策略是浏览器需要遵循的标准，而如果是服务器向服务器请求就无需遵循同源策略。** 代理服务器，需要做以下几个步骤：

- 接受客户端请求 。
- 将请求 转发给服务器。
- 拿到服务器 响应 数据。
- 将 响应 转发给客户端。

**6.nginx反向代理**

    server {
        listen       81;
        server_name  www.domain1.com;
        location / {
            proxy_pass   http://www.domain2.com:8080;  #反向代理
            proxy_cookie_domain www.domain2.com www.domain1.com; #修改cookie里域名
            index  index.html index.htm;
    
            # 当用webpack-dev-server等中间件代理接口访问nignx时，此时无浏览器参与，故没有同源限制，下面的跨域配置可不启用
            add_header Access-Control-Allow-Origin http://www.domain1.com;  #当前端只跨域不带cookie时，可为*
            add_header Access-Control-Allow-Credentials true;
        }
    }

**7.iframe**

该方式只能用于二级域名相同的情况下，比如 [a.test.com](http://a.test.com/) 和 [b.test.com](http://b.test.com/) 适用于该方式。 只需要给页面添加 document.domain ='[test.com](http://test.com/)' 表示二级域名都相同就可以实现跨域。

两个页面都通过js强制设置document.domain为基础主域，就实现了同域

### HTTP content

    GET / HTTP/1.1
    Host: hackr.jp
    User-Agent: Mozilla/5.0 (Windows NT 6.1; WOW64; rv:13.0) Gecko/20100101 Firefox/13.0
    Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*; q=0.8
    Accept-Language: ja,en-us;q=0.7,en;q=0.3
    Accept-Encoding: gzip, deflate
    DNT: 1
    Connection: keep-alive
    If-Modified-Since: Fri, 31 Aug 2007 02:02:20 GMT
    If-None-Match: "45bae1-16a-46d776ac"
    Cache-Control: max-age=0

在 HTTP 协议通信交互中使用到的首部字段，不限于 RFC2616 中定义的 47 种首部字段。还有 Cookie、Set-Cookie 和 Content-Disposition 等在其他 RFC 中定义的首部字段，它们的使用频率也很高。

<!-- **通用首部字段**

[Untitled](https://www.notion.so/d1b1aea22100441c8f3446fee5e4a78b)

**请求首部字段**

[Untitled](https://www.notion.so/1909319297f7491ca5c93a76addd5bd5)

**响应首部字段**

[Untitled](https://www.notion.so/5147dc57de434a87a76fa4ce6fc6071f)

**实体首部字段**

[Untitled](https://www.notion.so/3278c35e4cec481191e243b7fc61e7cf) -->

**端到端首部（End-to-end Header）**

分在此类别中的首部会转发给请求 / 响应对应的最终接收目标，且必须保存在由缓存生成的响应中，另外规定它必须被转发。

**逐跳首部（Hop-by-hop Header）**

分在此类别中的首部只对单次转发有效，会因通过缓存或代理而不再转发。HTTP/1.1 和之后版本中，如果要使用 hop-by-hop 首部，需提供 Connection 首部字段。

下面列举了 HTTP/1.1 中的逐跳首部字段。除这 8 个首部字段之外，其他所有字段都属于端到端首部。

- **Connection**
- **Keep-Alive**
- **Proxy-Authenticate**
- **Proxy-Authorization**
- **Trailer**
- **TE**
- **Transfer-Encoding**
- **Upgrade**

### HTTP code

- 100-199：表示成功接收请求, 要求客户端继续提交下一次请求才能完成整个处理过程，常见的有 101（客户要求服务器转换 HTTP 协议版本）、100（客户必须继续发出请求）
- 200-299：表示成果接收请求并已完成整个处理过程
- 300-399：需要客户进一步细化需求，以进一步完成请求，常用的有 301（永久重定向）、302（临时重定向）、304（缓存相关）
- 400-499：请求出错，包含语法错误或者无法正确执行逻辑，常用的有 404（无对应资源）、401（权限问题）、403 （服务器拒绝请求）
- 500-599：服务器端程序处理出现错误，常见的有 502（错误网关）、504（网关超时）、505（HTTP 版本不受支持）

    100     //继续 请求者应当继续提出请求。服务器返回此代码表示已收到请求的第一部分，正在等待其余部分
    101     //切换协议  请求者已要求服务器切换协议，服务器已确认并准备切换
    
    200     //成功  服务器已经成功处理了请求，通常，这表示服务器提供了请求的网页
    201     //已创建  请求成功并且服务器创建了新的资源
    202     //已接受  服务器已接受请求，但尚未处理
    203     //非授权信息  服务器已经成功处理了请求，但返回的信息可能来自另一来源
    204     //无内容  服务器成功处理了请求，但没有返回任何内容
    205     //重置内容  服务器成功处理了请求，但没有返回任何内容
    206     //部分内容  服务器成功处理了部分 GET 请求
    
    300     //多种选择  针对请求，服务器可执行多种操作。服务器可根据请求者（user agent）选择一项操作，或提供操作列表供请求者选择
    301     //永久移动  请求的网页已永久移动到新位置。服务器返回此响应（对 GET 或 HEAD 请求的响应）时，会自动将请求者转到新位置
    302     //临时移动  服务器目前从不同位置的网页响应请求，但请求者应继续使用原有位置来进行以后的请求
    303     //查看其他位置  请求者应当对不同的位置使用单独的 GET 请求来检索响应时，服务器返回此代码
    304     //未修改  自动上次请求后，请求的网页未修改过。服务器返回此响应，不会返回网页的内容
    305     //使用代理  请求者只能使用代理访问请求的网页。如果服务器返回此响应，还表示请求者应使用代理
    307     //临时性重定向  服务器目前从不同位置的网页响应请求，但请求者应继续使用原有的位置来进行以后的请求
    
    
    400     //错误请求  服务器不理解请求的语法
    401     //未授权  请求要求身份验证。对于需要登录的网页，服务器可能返回此响应
    403     //禁止  服务器拒绝请求
    404     //未找到  服务器找不到请求的网页
    405     //方法禁用  禁用请求中指定的方法
    406     //不接受  无法使用请求的内容特性响应请求的网页
    407     //需要代理授权  此状态码与 401（未授权）类似，但指定请求者应当授权使用代理
    408     //请求超时  服务器等候请求时发生超时
    409     //冲突  服务器在完成请求时发生冲突。服务器必须在响应中包含有关冲突的信息
    410     //已删除  如果请求的资源已永久删除，服务器就会返回此响应
    411     //需要有效长度  服务器不接受不含有效内容长度标头字段的请求
    412     //未满足前提条件  服务器未满足请求者在请求者设置的其中一个前提条件
    413     //请求实体过大  服务器无法处理请求，因为请求实体过大，超出了服务器的处理能力
    414     //请求的 URI 过长  请求的 URI（通常为网址）过长，服务器无法处理
    415     //不支持媒体类型  请求的格式不受请求页面的支持
    416     //请求范围不符合要求  如果页面无法提供请求的范围，则服务器会返回此状态码
    417     //未满足期望值  服务器未满足「期望」请求标头字段的要求
    
    500     //服务器内部错误  服务器遇到错误，无法完成请求
    501     //尚未实施  服务器不具备完成请求的功能。例如，服务器无法识别请求方法时可能会返回此代码
    502     //错误网关  服务器作为网关或代理，从上游服务器无法收到无效响应
    503     //服务器不可用  服务器目前无法使用（由于超载或者停机维护）。通常，这只是暂时状态
    504     //网关超时  服务器作为网关代理，但是没有及时从上游服务器收到请求
    505     //HTTP 版本不受支持  服务器不支持请求中所用的 HTTP 协议版本

### 为什么要三次握手四次挥手

**三次握手**

![TCP连接](/network/tcp-connect.png)

第一次客户端发送

第二次服务端发送

第三次客户端发送并进入建立状态

服务端收到后进入建立状态

**四次挥手**

![TCP关闭](/network/tcp-close.png)

第一次客户端发送

第二次服务端发送(确认收到客户端的发送, 如果服务端有需要发送的现在还可以发送)

第三次服务端发送(服务端没有要发的了)

第四次客户端发送并进入等待(等待可能出现的要求重传的 ACK 包)

服务端收到后关闭连接

客户端等待两个最大段生命周期(2MSL)后关闭

### 为什么需要TIME_WAIT状态

假设最后的ACK丢失，server将重发FIN，client必须维护TCP状态信息以便可以重发最后的ACK，否则将会发送RST，结果server认为发生错误。TCP实现必须可靠地终止连接的两个方向，所以client必须进入TIME_WAIT, TIME_WAIT 状态下服务端的端口不能使用.

TCP实现可能面临着先后两个相同的五元组。如果前一个连接处于TIME_WAIT状态，而允许另一个拥有相同五元组连接出现，可能处理TCP报文时，两个连接互相干扰。

五元组: 源IP地址，源端口，目的IP地址，目的端口，和传输层协议

### 如何避免time_wait状态占用资源

通过socket的选项SO_REUSEADDR来强制进程立即使用处于time_wait状态的连接占用的端口

### 什么是2MSL

Maximum Segment Lifetime, 他是任何报文在网络上存在的最长时间，超过这个时间报文将被丢弃。

### GET和POST

**GET**

没有副作用被称为“幂等“（Idempotent), 因为GET因为是读取，就可以对GET请求的数据做缓存。这个缓存可以做到浏览器本身上（彻底避免浏览器发请求），也可以做到代理上（如nginx），或者做到server端（用Etag，至少可以减少带宽消耗）

**POST**

有副作用的，不幂等的, 不能缓存, https可以加密隐藏数据, GET的参数只能支持ASCII，而POST能支持任意binary

### URI VS URL

- URL，统一资源定位符
- URI，统一资源标识符

通俗来说，URL 像是一个邮政编码，URI 就是收件地址。因此可知，URL 的范围大于 URI。我们以淘宝的例子来说，[https://www.taobao.com/](https://www.taobao.com/) 这个域名就是 URL，而每个商品的地址就是一个 URI。

很多 Ajax 请求库的参数都设计成叫做 url，表示请求地址。但实际上，更准确的表达是 URI。

### DNS

- 先过浏览器搜索自己的 DNS 缓存（可以使用 chrome://net-internals/#dns 来进行查看）
- 上一步未找到对应缓存的 IP 地址时，搜索操作系统中的 DNS 缓存
- 上一步未找到对应缓存的 IP 地址时，操作系统将域名发送至 LDNS（本地区域名服务器），LDNS 查询 自己的 DNS 缓存（一般查找成功率在 80% 左右），查找成功则返回结果，失败则发起一个迭代 DNS 解析请求，为什么说这是迭代的 DNS 解析请求呢？这个过程
    - LDNS 向 Root Name Server（根域名服务器，如 com、net、org 等解析顶级域名服务器的地址）发起请求，此处，Root Name Server 返回 com 域的顶级域名服务器地址
    - LDNS 向 com 域的顶级域名服务器发起请求，返回 baidu.com 域名服务器地址
    - LDNS 向 baidu.com 域名服务器发起请求，得到 www.baidu.com 的 IP 地址 LDNS 将得到的 IP 地址返回给操作系统，同时自己也将 IP 地址缓存起来
- 操作系统将 IP 地址返回给浏览器，同时自己也将 IP 地址缓存起来

### 断点续传原理

依靠 HTTP1.1 协议（RFC2616），该协议版本开始支持获取文件的部分内容

在前端发送请求时，需要在 Header 里加入 Range 参数，同时服务器端响应时返回带有 Content-Range 的 Header，也就是说 Range 和 Content-Range 是一对对应的 Header 头。

    Range: bytes=500-999

就表示上传第 500-999 字节范围的内容，而浏览器在发出带 Range 的请求后，服务器会在 Content-Range 头部返回当前接受的范围和文件总大小，比如：

    Content-Range: bytes 0-499/22400

就指当前发送数据的范围是 0-499，22400 则是文件的总 size。

- 浏览器下载一个 1024K 的文件，当前已经下载了 512K
- 这时候不幸网络故障，稍后浏览器请求续传，这时候带有 Range:bytes=512000 的 Header 头，表明本次需要续传的片段
- 服务端接收到断点续传的请求，从文件的 512K 位置开始传输，并返回 Header 头： Content-Range:bytes 512000-/1024000，注意这时候的 HTTP status code 是 206，而非 200，206 表示：206 Partial Content（使用断点续传方式）

服务端在校验一致时返回 206 的续传回应校验不通过时，服务端则返回 200 回应，回应的内容为新的文件的全部数据。

### HTTP管道化

![pipelinling](/network/pipelinling.png)

### HTTP 连接分为长连接和短连接，而我们现在常用的都是 HTTP 1.1，因此我们用的都是长连接?。

我们现在大多应用 HTTP 1.1，因此用的都是长连接，这种说法勉强算对，因为 HTTP 1.1 默认 Connection 为 keep-alive。但是 HTTP 协议并没有长连接、短连接之分，所谓的长短连接都是在说 TCP 连接，TCP 连接是一个双向的通道，它是可以保持一段时间不关闭的，因此 TCP 连接才有真正的长连接和短连接这一说。

HTTP 协议说到底是应用层的协议，而 TCP 才是真正的传输层协议，只有负责传输的这一层才需要建立连接

### 长连接是一种永久连接吗？

事实上，长连接并不是永久连接的，在长连接建立以后，如果一段时间内没有 HTTP 请求发出，这个长连接就会断掉。这个超时的时间可以在 header 中进行设置。

    Keep-Alive: timeout=5, max=1000

### 现代浏览器在与服务器建立了一个 TCP 连接后是否会在一个 HTTP 请求完成后断开？什么情况下会断开？

在 HTTP 1.0 中，一个服务器在发送完一个 HTTP 响应后，会断开 TCP 链接。但 HTTP 1.1 中，默认开启 Connection：keep-alive，浏览器和服务器之间是会维持一段时间的 TCP 连接，不会一个请求结束就断掉。除非显式声明：Connection: close。

### 一个 TCP 连接可以对应几个 HTTP 请求，这些 HTTP 请求发送是否可以一起发送？

不管是 HTTP 1.0 还是 HTTP 1.0，单个 TCP 连接在同一时刻只能处理一个请求，意思是说：两个请求的生命周期不能重叠，任意两个 HTTP 请求从开始到结束的时间在同一个 TCP 连接里不能重叠。也就是「队头阻塞」。

### HTTPS

[https](/network/https.jpg)

1. 证书验证阶段
- 浏览器发起 HTTPS 请求
- 服务端返回 HTTPS 证书
- 客户端验证证书是否合法，如果不合法则提示告警
1. 数据传输阶段
- 当证书验证合法后，在本地生成随机数
- 通过公钥加密随机数，并把加密后的随机数传输到服务端
- 服务端通过私钥对随机数进行解密
- 服务端通过客户端传入的随机数构造对称加密算法，对返回结果内容进行加密后传输

### TCP拥塞控制

TCP的拥塞控制采用的是窗口机制, 拥塞窗口调整的原则是：只要网络没有出现拥塞，就可以增大拥塞窗口，以便将更多的数据发送出去，相当于提高发送速率；一旦网络出现拥塞，拥塞窗口就减小一些，减少注入网络的数据量，从而缓解网络的拥塞。

TCP的拥塞控制算法包括了慢启动 拥塞避免 快速重传 快速恢复.

### POST数据格式

- application/x-www-form-urlencoded
    - 浏览器的原生form表单，如果不设置 enctype 属性，则默认以 application/x-www-form-urlencoded 方式传输数据。

    POST http://www.example.com HTTP/1.1
    Content-Type: application/x-www-form-urlencoded;charset=utf-8
    
    title=test&sub%5B%5D=1&sub%5B%5D=2&sub%5B%5D=3（url编码）

- multipart/form-data
    - 使用表单上传文件时，必须让 表单的 enctype 等于 multipart/form-data。
    - 支持传输多种文件格式，关于 multipart/form-data 的详细定义，查看 [rfc1867](http://www.ietf.org/rfc/rfc1867.txt)

    POST http://www.example.com HTTP/1.1
    Content-Type:multipart/form-data; boundary=----WebKitFormBoundaryrGKCBY7qhFd3TrwA
    
    ------WebKitFormBoundaryrGKCBY7qhFd3TrwA
    Content-Disposition: form-data; name="text"
    
    title
    ------WebKitFormBoundaryrGKCBY7qhFd3TrwA
    Content-Disposition: form-data; name="file"; filename="chrome.png"
    Content-Type: image/png
    
    ... content of chrome.png(省略) ...
    ------WebKitFormBoundaryrGKCBY7qhFd3TrwA--

- application/json
    - 也是现在用得比较多的一种方式JSON字符串，支持结构化的数据。

    POST http://www.example.com HTTP/1.1 
    Content-Type: application/json;charset=utf-8
    
    {"title":"test","sub":[1,2,3]}

- text/xml

    一般用于传输xml格式的数据，这种数据格式相比于json稍微复杂，臃肿，但还常用来作为配置文件。

        POST http://www.example.com HTTP/1.1 
        Content-Type: text/xml
        <?xml version="1.0"?>
        <methodCall>
            <methodName>examples.getStateName</methodName>
            <params>
                <param>
                    <value><i4>41</i4></value>
                </param>
            </params>
        </methodCall>