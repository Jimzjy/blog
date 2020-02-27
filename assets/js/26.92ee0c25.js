(window.webpackJsonp=window.webpackJsonp||[]).push([[26],{362:function(e,a,r){"use strict";r.r(a);var t=r(9),n=Object(t.a)({},(function(){var e=this,a=e.$createElement,r=e._self._c||a;return r("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[r("h1",{attrs:{id:"webpack"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#webpack"}},[e._v("#")]),e._v(" webpack")]),e._v(" "),r("h2",{attrs:{id:"webpack工作原理"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#webpack工作原理"}},[e._v("#")]),e._v(" webpack工作原理")]),e._v(" "),r("img",{attrs:{src:e.$withBase("/webpack/theory.png")}}),e._v(" "),r("ul",[r("li",[e._v("首先，webpack 会读取项目中由开发者定义的 webpack.config.js 配置文件，或者从 shell 语句中获得必要的参数。这是 webpack 内部接收业务配置信息的方式。这就完成了配置读取的初步工作。")]),e._v(" "),r("li",[e._v("接着，实例化所需 webpack 插件，在 webpack 事件流上挂载插件钩子，这样在合适的构建过程中，插件具备了改动产出结果的能力。")]),e._v(" "),r("li",[e._v("同时，根据配置所定义的入口文件，以入口文件（可以不止有一个）为起始，进行依赖收集：对所有依赖的文件进行编译，这个编译过程依赖 loaders，不同类型文件根据开发者定义的不同 loader 进行解析。编译好的内容使用 acorn 或其它抽象语法树能力，解析生成 AST 静态语法树，分析文件依赖关系，将不同模块化语法（如 require）等替换为 "),r("code",[e._v("__webpack_require__")]),e._v("，即使用 webpack 自己的加载器进行模块化实现。")]),e._v(" "),r("li",[e._v("上述过程进行完毕后，产出结果，根据开发者配置，将结果打包到相应目录。")])]),e._v(" "),r("p",[e._v("在这整个打包过程中，"),r("strong",[e._v("webpack 和插件采用基于事件流的发布订阅模式，监听某些关键过程，在这些环节中执行插件任务")]),e._v("。到最后，所有文件的编译和转化都已经完成，输出最终资源。")]),e._v(" "),r("p",[e._v("如果深入源码，上述过程用更加专业的术语总结为——模块会经历"),r("strong",[e._v("加载")]),e._v("（loaded）、"),r("strong",[e._v("封存")]),e._v("（sealed）、"),r("strong",[e._v("优化")]),e._v("（optimized）、"),r("strong",[e._v("分块")]),e._v("（chunked）、"),r("strong",[e._v("哈希")]),e._v("（hashed）和"),r("strong",[e._v("重新创建")]),e._v("（restored）这几个经典步骤")]),e._v(" "),r("p",[r("strong",[e._v("loader")])]),e._v(" "),r("ul",[r("li",[e._v("loader 的执行顺序是和配置顺序相反的，即配置的最后一个 loader 最先执行，第一个 loader 最后执行。")]),e._v(" "),r("li",[e._v("第一个执行的 loader 接收源文件内容作为参数，其他 loader 接收前一个执行的 loader 的返回值作为参数。最后执行的 loader 会返回最终结果。")])]),e._v(" "),r("p",[e._v("loader，它是一个转换器，将A文件进行编译成B文件，比如：将A.less转换为A.css，单纯的文件转换过程。")]),e._v(" "),r("p",[e._v("plugin是一个扩展器，它丰富了webpack本身，针对是loader结束后，webpack打包的整个过程，它并不直接操作文件，而是基于事件机制工作，会监听webpack打包过程中的某些节点，执行广泛的任务")]),e._v(" "),r("h3",{attrs:{id:"概括2"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#概括2"}},[e._v("#")]),e._v(" 概括2")]),e._v(" "),r("p",[e._v("Webpack 的运行流程是一个串行的过程,从启动到结束会依次执行以下流程 :")]),e._v(" "),r("ol",[r("li",[e._v("初始化参数：从配置文件和 Shell 语句中读取与合并参数,得出最终的参数。")]),e._v(" "),r("li",[e._v("开始编译：用上一步得到的参数初始化 Compiler 对象,加载所有配置的插件,执行对象的 run 方法开始执行编译。")]),e._v(" "),r("li",[e._v("确定入口：根据配置中的 entry 找出所有的入口文件。")]),e._v(" "),r("li",[e._v("编译模块：从入口文件出发,调用所有配置的 Loader 对模块进行翻译,再找出该模块依赖的模块,再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理。")]),e._v(" "),r("li",[e._v("完成模块编译：在经过第 4 步使用 Loader 翻译完所有模块后,得到了每个模块被翻译后的最终内容以及它们之间的依赖关系。")]),e._v(" "),r("li",[e._v("输出资源：根据入口和模块之间的依赖关系,组装成一个个包含多个模块的 Chunk,再把每个 Chunk 转换成一个单独的文件加入到输出列表,这步是可以修改输出内容的最后机会。")]),e._v(" "),r("li",[e._v("输出完成：在确定好输出内容后,根据配置确定输出的路径和文件名,把文件内容写入到文件系统。")])]),e._v(" "),r("p",[e._v("在以上过程中,Webpack 会在特定的时间点广播出特定的事件,插件在监听到感兴趣的事件后会执行特定的逻辑,并且插件可以调用 Webpack 提供的 API 改变 Webpack 的运行结果。")]),e._v(" "),r("h2",{attrs:{id:"多入口文件如何开发"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#多入口文件如何开发"}},[e._v("#")]),e._v(" 多入口文件如何开发")]),e._v(" "),r("p",[e._v("生成多个html-webpack-plugin实例来解决这个问题")]),e._v(" "),r("div",{staticClass:"language- extra-class"},[r("pre",[r("code",[e._v("const path = require('path');\nconst HtmlWebpackPlugin = require('html-webpack-plugin')\nmodule.exports = {\n    mode:'development', // 开发模式\n    entry: {\n      main:path.resolve(__dirname,'../src/main.js'),\n      header:path.resolve(__dirname,'../src/header.js')\n  }, \n    output: {\n      filename: '[name].[hash:8].js',      // 打包后的文件名称\n      path: path.resolve(__dirname,'../dist')  // 打包后的目录\n    },\n    plugins:[\n      new HtmlWebpackPlugin({\n        template:path.resolve(__dirname,'../public/index.html'),\n        filename:'index.html',\n        chunks:['main'] // 与入口文件对应的模块名\n      }),\n      new HtmlWebpackPlugin({\n        template:path.resolve(__dirname,'../public/header.html'),\n        filename:'header.html',\n        chunks:['header'] // 与入口文件对应的模块名\n      }),\n    ]\n}")])])])])}),[],!1,null,null,null);a.default=n.exports}}]);