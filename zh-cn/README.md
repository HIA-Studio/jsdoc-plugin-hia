<!--@label logo & title-->
# <img src="http://hia.g56.me/hia-utils/jsdoc-plugin-hia/logo.png" width=100 height=100 align=absmiddle> jsdoc-plugin-hia
---

<!--@todo 添加一些徽章-->

## English
- [project site](http://hia.g56.me/hia-utils/jsdoc-plugin-hia/)
- [github](https://github.com/mandolin/jsdoc-plugin-hia/)

## [github地址](https://github.com/mandolin/jsdoc-plugin-hia/)

<!--@label 简介-->
jsdoc-plugin-hia是一个jsdoc插件，包含一些标识符和特性，如@coderef（将代码块导入文档）。

<!--@label Why 开发此项目的缘由-->
## Why
[jsdoc](https://github.com/jsdoc3/jsdoc)是一个常用的js文档生成器，虽然最近一年来(2017~)的开发近乎于停滞状态，而后起之秀如[esdoc](https://github.com/esdoc/esdoc)等大有赶超之势，但基于我个人的观察和判断，jsdoc仍然是此类工具的首选，因此我选用了jsdoc作为开源项目的文档生成器。当然随着时间的推移，也不排除今后换用其它工具（如esdoc）。

在使用jsdoc的过程中，我发现了一个问题，那就是使用 @example 来引入一些示例代码时，只能手动写上去，而实际上，我们往往只需要引入项目本身的一些已有的代码片段即可，于是我不得不把同样的代码再拷贝一边，这显然是一件不愉快的事。因此我希望能解决这个问题，首先仔细研读了jsdoc的整个文档，没有发现官方有对此需求的相应的标识符或api，在官方的issue中也没有发现有类似的需求提交，然后搜了一些github，也没发现有这样的插件来满足我的需求。本想着也提一个issue吧，但看官方这开发的进度，多半希望不大。最终我决定研究一下jsdoc的插件机制，自行实现一个。这就是 jsdoc-plugin-hia 诞生的前后始末。

有了 jsdoc-plugin-hia 后，就可以在需要被引用的代码块前后用 @codeblock 将其包裹起来，然后在需要引用的文档注释处用 @coderef 引用即可。

<!--@label 安装说明-->
## 安装说明
<!--npm方式-->
- 直接将jsdoc-plugin-hia.js拷贝至你的项目中，同时将所需要的依赖添加进package.json文件。
- npm 安装（最好同时安装docdash-hia）
    ```bash
    npm i jsdoc-plugin-hia -D
    ```

<!--@label 设置相关-->
## 设置
在jsdoc-conf.json中设置plugins和markdown属性
```js
"plugins": [
    "plugins/markdown",
    "jsdoc-plugin-hia"
],
"markdown": {
    "hardwrap": true,
    "idInHeadings":true,
    "tags": ["file","overview","property","todo"]
},
"opts": {
    "template"    : "./node_modules/docdash-hia"
},
```
<!--（分别对应 github&项目文档）-->
## 教程
#### 开始使用:
- [主站文档](http://hia.g56.me/hia-utils/jsdoc-plugin-hia/zh-cn/doc/)
- [github](https://github.com/mandolin/jsdoc-plugin-hia/tree/master/zh-cn/doc)

<!--@label API文档链接-->
## API
[API文档链接](http://hia.g56.me/hia-utils/jsdoc-plugin-hia/api/)

<!--@label 最新版说明-->
## 当前版本: 1.0.3
仅实现了 @coderef 功能。

<!--@label 后期考虑实现的特性-->
## Todo
1. preview source 代码预览，对于每个文件总体、成员、类、方法、模块等，实现其对应的代码预览。
类似于[sassdoc](https://github.com/SassDoc/sassdoc)的代码预览功能。
2. i18n 多语言文档功能，建立一套机制，使得可以结构化的方便的建立多语言文档注释。

<!--@label Thanks-->
## Thanks
- [jsdoc](https://github.com/jsdoc3/jsdoc)
- [docdash](https://github.com/clenemt/docdash)

<!--@label License-->
## License: MIT
<!-- md LICENSE -->