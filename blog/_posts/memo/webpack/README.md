---
title: webpack
date: 2020-01-01
author: All
tags: 
  - memo
---

## webpack工作原理

<img :src="$withBase('/webpack/theory.png')"/>

- 首先，webpack 会读取项目中由开发者定义的 webpack.config.js 配置文件，或者从 shell 语句中获得必要的参数。这是 webpack 内部接收业务配置信息的方式。这就完成了配置读取的初步工作。
- 接着，实例化所需 webpack 插件，在 webpack 事件流上挂载插件钩子，这样在合适的构建过程中，插件具备了改动产出结果的能力。
- 同时，根据配置所定义的入口文件，以入口文件（可以不止有一个）为起始，进行依赖收集：对所有依赖的文件进行编译，这个编译过程依赖 loaders，不同类型文件根据开发者定义的不同 loader 进行解析。编译好的内容使用 acorn 或其它抽象语法树能力，解析生成 AST 静态语法树，分析文件依赖关系，将不同模块化语法（如 require）等替换为 `__webpack_require__`，即使用 webpack 自己的加载器进行模块化实现。
- 上述过程进行完毕后，产出结果，根据开发者配置，将结果打包到相应目录。

在这整个打包过程中，**webpack 和插件采用基于事件流的发布订阅模式，监听某些关键过程，在这些环节中执行插件任务**。到最后，所有文件的编译和转化都已经完成，输出最终资源。

如果深入源码，上述过程用更加专业的术语总结为——模块会经历**加载**（loaded）、**封存**（sealed）、**优化**（optimized）、**分块**（chunked）、**哈希**（hashed）和**重新创建**（restored）这几个经典步骤

**loader**

- loader 的执行顺序是和配置顺序相反的，即配置的最后一个 loader 最先执行，第一个 loader 最后执行。
- 第一个执行的 loader 接收源文件内容作为参数，其他 loader 接收前一个执行的 loader 的返回值作为参数。最后执行的 loader 会返回最终结果。

loader，它是一个转换器，将A文件进行编译成B文件，比如：将A.less转换为A.css，单纯的文件转换过程。

plugin是一个扩展器，它丰富了webpack本身，针对是loader结束后，webpack打包的整个过程，它并不直接操作文件，而是基于事件机制工作，会监听webpack打包过程中的某些节点，执行广泛的任务

### 概括2

Webpack 的运行流程是一个串行的过程,从启动到结束会依次执行以下流程 :

1. 初始化参数：从配置文件和 Shell 语句中读取与合并参数,得出最终的参数。
2. 开始编译：用上一步得到的参数初始化 Compiler 对象,加载所有配置的插件,执行对象的 run 方法开始执行编译。
3. 确定入口：根据配置中的 entry 找出所有的入口文件。
4. 编译模块：从入口文件出发,调用所有配置的 Loader 对模块进行翻译,再找出该模块依赖的模块,再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理。
5. 完成模块编译：在经过第 4 步使用 Loader 翻译完所有模块后,得到了每个模块被翻译后的最终内容以及它们之间的依赖关系。
6. 输出资源：根据入口和模块之间的依赖关系,组装成一个个包含多个模块的 Chunk,再把每个 Chunk 转换成一个单独的文件加入到输出列表,这步是可以修改输出内容的最后机会。
7. 输出完成：在确定好输出内容后,根据配置确定输出的路径和文件名,把文件内容写入到文件系统。

在以上过程中,Webpack 会在特定的时间点广播出特定的事件,插件在监听到感兴趣的事件后会执行特定的逻辑,并且插件可以调用 Webpack 提供的 API 改变 Webpack 的运行结果。

## 多入口文件如何开发

生成多个html-webpack-plugin实例来解决这个问题

    const path = require('path');
    const HtmlWebpackPlugin = require('html-webpack-plugin')
    module.exports = {
        mode:'development', // 开发模式
        entry: {
          main:path.resolve(__dirname,'../src/main.js'),
          header:path.resolve(__dirname,'../src/header.js')
      }, 
        output: {
          filename: '[name].[hash:8].js',      // 打包后的文件名称
          path: path.resolve(__dirname,'../dist')  // 打包后的目录
        },
        plugins:[
          new HtmlWebpackPlugin({
            template:path.resolve(__dirname,'../public/index.html'),
            filename:'index.html',
            chunks:['main'] // 与入口文件对应的模块名
          }),
          new HtmlWebpackPlugin({
            template:path.resolve(__dirname,'../public/header.html'),
            filename:'header.html',
            chunks:['header'] // 与入口文件对应的模块名
          }),
        ]
    }