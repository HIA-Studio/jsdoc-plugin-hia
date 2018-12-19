<!--@label logo & title-->
# <img src="http://hia.g56.me/hia-utils/jsdoc-plugin-hia/logo.png" width=100 height=100 align=absmiddle> jsdoc-plugin-hia
---

<!--@todo 添加一些徽章-->

## 中文
- [项目主站](http://hia.g56.me/hia-utils/jsdoc-plugin-hia/zh-cn/)
- [github](https://github.com/mandolin/jsdoc-plugin-hia/tree/master/zh-cn)

## [project github](https://github.com/mandolin/jsdoc-plugin-hia/)

<!--@label 简介-->
jsdoc-plugin-hia is a jsdoc plugin, contains some annotations and features, such as @coderef(import a codeblock into doc).

<!--@label Why 开发此项目的缘由-->
## Why
[jsdoc](https://github.com/jsdoc3/jsdoc) is a common JS document generator. Although the development of jsdoc in the past year (2017 ~) is almost stagnant, and the rising stars such as [esdoc](https://github.com/esdoc/esdoc) have a great catch-up potential, but based on my personal observation and judgment, jsdoc is still the first choice of such tools, so I chose jsdoc as the document generator of open source projects. Maybe, with the passage of time, it is not excluded that other tools (such as esdoc) will be used in the future.

When using jsdoc, I found a troublesome issue that is when using @example to introduce some sample code, I can only write it manually, but in fact, we often only need to introduce some existing code fragments of the project itself, so I have to copy the same code again, which is obviously an unpleasant thing. So I hope to solve this problem. First of all, I carefully read the whole document of jsdoc, and found no official identifier or API for this requirement. Neither did I find any similar requirement submission in the official issues. Then I searched some GitHub and found no such plug-in to meet my requirement. I would like to submit an issue, but look at the official progress of this development, most of the hope is not very good. Finally, I decided to study the plug-in mechanism of jsdoc and implement one by myself. This is the beginning and end of the birth of jsdoc-plugin-hia.

With jsdoc-plugin-hia, you can wrap a block of code with @codeblock before and after which needs to be referenced, and then use @coderef annotation in the document that needs to be referenced.

<!--@label 安装说明-->
## Installation instructions
<!--npm方式-->
- Copy jsdoc-plugin-hia.js directly to your project and add the required dependencies to the package.json file.
- npm install(It's better to install docdash-hia at the same time)
    ```bash
    npm i jsdoc-plugin-hia -D
    ```

<!--@label 设置相关-->
## settings
Set "plugins" and "markdown" attributes in jsdoc-conf.json
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
## tutorial
#### Getting started:
- [project site](http://hia.g56.me/hia-utils/jsdoc-plugin-hia/doc/)
- [github](https://github.com/mandolin/jsdoc-plugin-hia/tree/master/doc)

<!--@label API文档链接-->
## API
[API doc link](http://hia.g56.me/hia-utils/jsdoc-plugin-hia/api/)

<!--@label 最新版说明-->
## Current Version: 1.0.3
Only @coderef is implemented.

<!--@label 后期考虑实现的特性-->
## Todo
1. preview source: For each file's members, classes, methods, modules and so on, implement the corresponding code preview functionality.
This is a code preview function similar to [sassdoc](https://github.com/SassDoc/sassdoc).
2. i18n: Multilingual document function, build a set of mechanisms, so that it can be structured to facilitate the establishment of multilingual document annotations.

<!--@label Thanks-->
## Thanks
- [jsdoc](https://github.com/jsdoc3/jsdoc)
- [docdash](https://github.com/clenemt/docdash)

<!--@label License-->
## License: MIT
<!-- md LICENSE -->