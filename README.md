# 《我是前端》示例代码
>:whale: 《我是前端》配套示例代码仓，下载代码仓后需要先执行`npm install`安装依赖。



## chapter1——mock.js如何与后端潇洒分手

1.`npm install`安装依赖   
2.`npm run start`运行程序   
3.打开浏览器，在地址栏输入`http://localhost:9527/query_orders`即可看到返回的模拟数据



## chapter4——Require.js 模块演义
1.`requirejs-demo`展示requirejs基本用法, 双击`index.html`可查看效果。
2.`brief-require`为手动实现的简易`requirejs`，双击index.html可查看效果。




## chapter5——Lodash.js 是工具，也是秘籍
打开终端，进入目录后使用`node XXX`的方式运行。



## chapter8——Rxjs 老人与海

示例为使用Rxjs实现的ToDoList应用，直接打开html文件即可查看



## chapter9——Immutable.js 不可变数据的制造艺术

- `shallow_copy.html`——演示JavaScript原生方法的“浅克隆特性”
- `try_immutable.html`——演示基本的Immutable.js的数据类型，可在控制台查看生成的新对象
- `nest_perf_compare.html`——以Map为例，测试嵌套结构Map深层更新函数setIn的性能表现。
- `array_proxy_es5_es6.js`——演示`Proxy`可响应数组方法，而`defineProperty`无法做到，使用`node`命令运行。



## chapter10——Day.js 算个日期能有多难

示例代码中展示了Dayjs的基本用法，可使用`node`命令运行。



## chapter11——jsplumb.js 所见即所得的流程图

示例代码中展示了`viz.js`布局引擎的基本用法（网络上有非常多教程可以教你如何利用jsplumb.js绘制流程图），使用`node `命令执行`graphviz.demo.js`，它就可以将DOT定义文件转换为名为`output.svg`的拓扑图，它可以帮助你在自定义绘制后方便地实现自动布局。




## chapter12——easel.js 一个标签 一个世界
使用`easel.js`常用API实现了简易动画，双击`index.html`可查看效果。



## chapter13——Echarts.js 看见
目录中已包含`echarts.min.js`的完整库，双击`index.html`即可打开查看使用`echarts`绘制图表的基本用例。

- 示例Demo包括基本示例、响应式、图表动画的基本实现
  - 1.基本用法示例
  - 2.用脚本改变容器宽度尺寸
  - 3.为图表展示增加动画
  - 4.响应视口尺寸变化
- `data-vis.jpg`提供了基本的图表选型参考
- `data-visualization.png`提供了更加完整的可视化图表选型参考



## chapter14——Snap.svg 变形记

![svg动画示例](https://github.com/dashnowords/imfe/blob/main/assets/ch14-animation.gif)

进入目录后执行`npm run install`安装依赖，然后通过`npm run start`启动示例服务，在浏览器中通过`localhost:3000`访问。示例包括：

- svg元素特性-添加事件监听
- svg元素特性-添加viewBox视口
- svg元素特性-剪裁路径&蒙层
- svg元素特性-元素复用
- svg元素特性-多种方式实现滤镜效果
- svg元素特性-变形动画的实现
- Snap.svg使用示例



## chapter15——Three.js 第三个维度

![3D模型示例](https://github.com/dashnowords/imfe/blob/main/assets/ch15-main.png)

进入目录后执行`npm run install`安装依赖，然后通过`npm run start`启动示例服务，在浏览器中通过`localhost:3000`访问。示例包括：

- `plane`-平面渐离
  
  - `plane-perspectiveCamera`-使用透视相机观察动画
  - `plane-orthographicCamera`-使用正交相机观察动画
  - `plane-perspectiveCamera-withFog`-使用透视相机观察有雾场景
  
- `plane-orthographicCamera-withFog`-使用正交相机模拟有雾场景

- `textGeometry`-字体模型
  - `textGeometry-shape`-先生成带孔平面模型，再拉伸为凹浮雕模型
  - `textGeometry-loader`-从外部加载`gltf`格式的模型
  - `textGeometry-bsp`-演示**ThreeCSG.js**进行求差集操作【！！不推荐再使用此方式】

- `texture`-纹理贴图
  - `texture-wrong-order`- 纹理素材顶点顺序错误效果对比
  - `texture-partial-face`- 为选定的局部表面贴图
  
- 实战
  - [用Three.js制作简易的MARVEL片头动画（上）](https://www.cnblogs.com/dashnowords/p/11216540.html)

  - [用Three.js制作简易的MARVEL片头动画（下）](https://www.cnblogs.com/dashnowords/p/11234360.html)

