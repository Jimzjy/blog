---
title: Notice
date: 2020-01-01
author: All
tags: 
  - memo
---

### 不使用 useState 来保存不会影响视图的数据

因为 setState 会进行更新. 可以使用 useRef, 在class组件中使用实例变量. 也可以将变量写在函数或者class外部, 但是这样要考虑不同实例之间的数据共享问题.