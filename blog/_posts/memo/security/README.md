---
title: 安全
date: 2020-01-01
author: All
tags: 
  - memo
---

## **XSS（Cross-Site Scripting）脚本攻击漏洞**

JavaScript 代码注入, 如编写 JavaScript 代码到公共评论模块中.

    <input type="text" name="address1" value="value1from">
    
    value1from是来自用户的输入，如果用户不是输入value1from,而是输入 "/><script>alert(document.cookie)</script><!- 那么就会变成
    
    <input type="text" name="address1" value=""/><script>alert(document.cookie)</script><!- ">

### XSS修复

将重要的 cookie 标记为 http only

只允许用户输入我们期望的数据。例如：　年龄的 textbox 中，只允许用户输入数字。而数字之外的字符都过滤掉

对数据进行 Html Encode 处理

过滤或移除特殊的 Html 标签

    <script>, <iframe> ,  < for <, > for >, " for

过滤 JavaScript 事件的标签。例如 "onclick=", "onfocus"

## CSRF攻击

在对别的网站就行操作的时候对你之前访问的网站发送请求.

我们先假设支付宝存在CSRF漏洞，我的支付宝账号是aaa，攻击者的支付宝账号是xxx。然后我们通过网页请求的方式 [http://zhifubao.com/withdraw?account=aaa&amount=10000&for=](https://link.jianshu.com/?t=http://zhifubao.com/withdraw?account=lyq&amount=10000&for=lyq2)xxx 可以把我账号aaa的10000元转到我的另外一个账号xxx上去。

### 解决办法

1.增加 token 验证.因为 cookie 发送请求的时候会自动增加上，但是 token 却不会，这样就避免了攻击

2.Referer 验证。页面来源的判断

SameSite 强制不允许cookies

## iframe 安全隐患问题

iframe 安全性我们无法去评估测试，有时候会携带一些第三方的插件啊，或者嵌入了一下不安全的脚本

### 解决办法

1.使用安全的网站进行嵌入；

2.在 iframe 添加一个叫 sandbox 的属性，浏览器会对 iframe 内容进行严格的控制，详细了解可以看看相关的 API 接口文档。

## 本地存储数据问题

一些个人信息不经加密直接存到本地或者 cookie，这样是非常不安全的，黑客们可以很容易就拿到用户的信息

### 解决办法

所有在放到 cookie 中的信息或者 localStorage 里的信息要进行加密，加密可以自己定义一些加密方法或者网上寻找一些加密的插件，或者用 base64 进行多次加密

## 第三方依赖安全隐患

过多的用第三方依赖或者插件，一方面会影响性能问题，另一方面第三方的依赖或者插件存在很多安全性问题

### 解决办法

手动去检查那些依赖的安全性问题基本是不可能的，最好是利用一些自动化的工具进行扫描过后再用，比如 NSP(Node Security Platform)，Snyk

## HTTPS 加密传输数据

所以接口请求以及网站部署等最好进行 HTTPS 加密，这样防止被人盗取数据