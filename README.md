# imfe
>:whale: 《我是前端》配套示例代码仓，下载代码仓后需要先执行`npm install`安装依赖。



#### chapter1——mock.js如何与后端潇洒分手

1.`npm install`安装依赖   
2.`npm run start`运行程序   
3.打开浏览器，在地址栏输入`http://localhost:9527/query_orders`即可看到返回的模拟数据



#### chapter4——Require.js 模块演义
1.`requirejs-demo`展示requirejs基本用法, 双击`index.html`可查看效果。
2.`brief-require`为手动实现的简易`requirejs`，双击index.html可查看效果。




#### chapter5——Lodash.js 是工具，也是秘籍
打开终端，进入目录后使用`node XXX`的方式运行。



#### chapter8——Rxjs 老人与海

示例为使用Rxjs实现的ToDoList应用，直接打开html文件即可查看



#### chapter9——Immutable.js 不可变数据的制造艺术

- `shallow_copy.html`——演示JavaScript原生方法的“浅克隆特性”
- `try_immutable.html`——演示基本的Immutable.js的数据类型，可在控制台查看生成的新对象
- `nest_perf_compare.html`——以Map为例，测试嵌套结构Map深层更新函数setIn的性能表现。
- `array_proxy_es5_es6.js`——演示`Proxy`可响应数组方法，而`defineProperty`无法做到，使用`node`命令运行。



#### chapter10——Day.js 算个日期能有多难

示例代码中展示了Dayjs的基本用法，可使用`node`命令运行。



#### chapter11——jsplumb.js 所见即所得的流程图

示例代码中展示了`viz.js`布局引擎的基本用法（网络上有非常多教程可以教你如何利用jsplumb.js绘制流程图），使用`node `命令执行`graphviz.demo.js`，它就可以将DOT定义文件转换为名为`output.svg`的拓扑图，它可以帮助你在自定义绘制后方便地实现自动布局。

