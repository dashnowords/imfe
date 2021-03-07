# 《我是前端》示例代码
>:whale: 《我是前端》配套示例代码仓，下载代码仓后需要先执行`npm install`安装依赖。



## Ch1  mock.js如何与后端潇洒分手

1.`npm install`安装依赖   
2.`npm run start`运行程序   
3.打开浏览器，在地址栏输入`http://localhost:9527/query_orders`即可看到返回的模拟数据



## Ch4  Require.js 模块演义
1.`requirejs-demo`展示requirejs基本用法, 双击`index.html`可查看效果。
2.`brief-require`为手动实现的简易`requirejs`，双击index.html可查看效果。




## Ch5  Lodash.js 是工具，也是秘籍
打开终端，进入目录后使用`node XXX`的方式运行。



## Ch8  Rxjs 老人与海

示例为使用Rxjs实现的ToDoList应用，直接打开html文件即可查看



## Ch9  Immutable.js 不可变数据的制造艺术

- `shallow_copy.html`——演示JavaScript原生方法的“浅克隆特性”
- `try_immutable.html`——演示基本的Immutable.js的数据类型，可在控制台查看生成的新对象
- `nest_perf_compare.html`——以Map为例，测试嵌套结构Map深层更新函数setIn的性能表现。
- `array_proxy_es5_es6.js`——演示`Proxy`可响应数组方法，而`defineProperty`无法做到，使用`node`命令运行。



## Ch10  Day.js 算个日期能有多难

示例代码中展示了Dayjs的基本用法，可使用`node`命令运行。



## Ch11  jsplumb.js 所见即所得的流程图

示例代码中展示了`viz.js`布局引擎的基本用法（网络上有非常多教程可以教你如何利用jsplumb.js绘制流程图），使用`node `命令执行`graphviz.demo.js`，它就可以将DOT定义文件转换为名为`output.svg`的拓扑图，它可以帮助你在自定义绘制后方便地实现自动布局。




## Ch12  easel.js 一个标签 一个世界
使用`easel.js`常用API实现了简易动画，双击`index.html`可查看效果。



## Ch13  Echarts.js 看见
目录中已包含`echarts.min.js`的完整库，双击`index.html`即可打开查看使用`echarts`绘制图表的基本用例。

- 示例Demo包括基本示例、响应式、图表动画的基本实现
  - 1.基本用法示例
  - 2.用脚本改变容器宽度尺寸
  - 3.为图表展示增加动画
  - 4.响应视口尺寸变化
- `data-vis.jpg`提供了基本的图表选型参考
- `data-visualization.png`提供了更加完整的可视化图表选型参考



## Ch14  Snap.svg 变形记

![svg动画示例](https://github.com/dashnowords/imfe/blob/main/assets/ch14-animation.gif)

进入目录后执行`npm run install`安装依赖，然后通过`npm run start`启动示例服务，在浏览器中通过`localhost:3000`访问。示例包括：

- svg元素特性-添加事件监听
- svg元素特性-添加viewBox视口
- svg元素特性-剪裁路径&蒙层
- svg元素特性-元素复用
- svg元素特性-多种方式实现滤镜效果
- svg元素特性-变形动画的实现
- Snap.svg使用示例



## Ch15  Three.js 第三个维度

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



## Ch16 impress.js 网页里的PPT
`index.html`中手动实现了基本的变换原理，双击打开即可。

## Ch17 velocity.js 高性能动画之谜
`index.html`中提供了示例代码目录，双击打开即可。其中包括`transition`和`animation`动画的基本比较，`velocity.js`在不同场景下使用时的示例代码，以及不同CSS属性在动画过程中的FPS情况，合成层的隐式提升示例等。



## Ch19 Record.js 语音信号处理

`index.html`中提供了示例代码目录，双击打开即可，示例包括:

- 1.使用`recorder.js`录制采样率为`16000Hz`的<b>单声道</b>音频

![录制结果参数](https://github.com/dashnowords/imfe/blob/main/assets/ch19-result.png)

- 2.在JS中添加处理音频信号的脚本节点
- 3.使用MediaRecorder对象录制音频


## Ch20 jsmpeg.js 流媒体播放器
![第20章目录截图](https://github.com/dashnowords/imfe/blob/main/assets/ch20-abstract.png)
进入目录后执行`npm run install`安装依赖，然后通过`npm run start`启动示例服务，在浏览器中通过`localhost:3000`访问。示例包括：

- TS流编码标准ISO/IEC13818-1——《Information_technology_Generic_coding》
- 使用`video.js`配合插件或其他库播放各种不同格式的视频文件
- 使用`video.js`播放基于`HLS`的`rtmp`视频流
  - ![基于hls](https://github.com/dashnowords/imfe/blob/main/assets/ch20-rtmp-stream.png)
  - 下载自己电脑系统支持的`ffmpeg`，并添加`ffmpeg`命令至全局环境变量`path`中
  - 解压缩`chapter20/nginx.zip`(其中已添加`nginx-rtmp-module`扩展，并配置相应端口地址)
  - 将解压后的地址添加到系统环境变量`path`中（以便在任何目录下可以使用`nginx`命令行）
  - 点击解压缩文件中的`start.cmd`即可启动一个简易的流媒体服务器
  - 打开命令行，进入`chapter20/rtmp_server`目录，输入`py webcam_rtmp.py`开始将笔记本电脑前置摄像头采集的视频推流至刚才启动的服务器（代码中使用了`ffmpeg`实现推流）
  - 在浏览器访问`localhost:3000`，打开【示例8】，等待约3-4秒后即可看到由摄像头拍摄到的画面。
- 使用`jsmpeg.js`播放视频流画面（下图中最外侧鼠标为本地屏幕，其他均为使用ffmpeg捕获的桌面渲染结果，可以延迟很低）
  - ![基于hls](https://github.com/dashnowords/imfe/blob/main/assets/ch20-jsmpeg.gif)
  - 下载自己电脑系统支持的`ffmpeg`，并添加`ffmpeg`命令至全局环境变量`path`中
  - 打开命令行，进入`chapter20/jsmpeg_server`目录，先双击`start-ws-server.cmd`启动流媒体服务器
    - 双击`push-webcam.cmd`会使用`ffmpeg`推送本地摄像头采集的视频信号至`http://localhost:8081/live`
    - 双击`push-desktop.cmd`会使用`ffmpeg`推送本地桌面画面的视频信号至`http://localhost:8081/live`
  - 访问`localhost:3000`，打开【示例9】，即可看到低延迟demo效果。


## Ch21 Commander.js “懒”是第一生产力
![第21章inquirer](https://github.com/dashnowords/imfe/blob/main/assets/ch21-inquirer.png)
进入目录后执行`npm run install`安装依赖。

- `node inquirer-demo.js `展示了交互式风格的命令行工具
- 打开终端，进入`cmds`文件夹，`node dash`展示了git风格的命令行工具，`node dash install`展示了子命令的使用