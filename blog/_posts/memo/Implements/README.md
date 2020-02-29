---
title: 实现
date: 2020-01-01
author: All
tags: 
  - memo
---

## Ajax Promise封装

    function fetchRequest (param) {
        const type = param.type || 'GET',
        const url = param.url;
        if (!url) {
            new TypeError('param url must be set...')
        }
        return new Promise( (resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open(type, url, true);
            // 1. 监听状态
            xhr.onreadystatechange = function () {
                // 2. readyState = 4， status = 200 是请求成功的标识
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(xhr.responseText, xhr);
                    } else {
                        reject({
                            code: xhr.status, 
                            message: xhr.response 
                        }, xhr);
                    }
                }
            }
            xhr.send();
        })
    }