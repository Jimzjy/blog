---
title: JS 技巧
date: 2020-01-01
author: All
tags: 
  - memo
---

### 取整

    // 位运算
    var a = ~~2.33   ----> 2
    var b = 2.33 | 0   ----> 2
    var c = 2.33 >> 0   ----> 2

### 生成随机ID

    Math.random().toString(36).substring(2);

### 获取URL参数

    // 1
    var url_string = "http://www.example.com/t.html?a=1&b=3&c=m2-m3-m4-m5";
    var url = new URL(url_string);
    var c = url.searchParams.get("c");
    
    // 2
    function getQueryString(name) {
      var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
      var r = window.location.search.substr(1).match(reg)
      if (r != null) return unescape(r[2])
      return null
    }

### 判断对象是否为空

    for (var i in obj) { // 如果不为空，则会执行到这一步，返回true
        return true
    }
    return false // 如果为空,返回false
    
    if (JSON.stringify(data) === '{}') {
        return false // 如果为空,返回false
    }
    return true
    
    Object.keys(obj).length === 0

### 数字加千分号

    Number(123456).toLocaleString('en-US')