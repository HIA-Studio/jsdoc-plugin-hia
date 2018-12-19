## 引言

jsdoc提供了一个标识符 @example 用来在文档注释中引入示例代码。

比如当你写好了一段代码并添加了文档注释：
```js
/**
 * Book类，代表一个书本.
 * @constructor
 * @param {string} title - 书本的标题.
 * @param {string} author - 书本的作者.
 */
var Book = function (title, author) {
    this.title = title;
    this.author = author;
};
```

这个时候如果你希望在这个文档注释里增加一段样例代码，可能是这样：

```js
/**
 * Book类，代表一个书本.
 * @constructor
 * @param {string} title - 书本的标题.
 * @param {string} author - 书本的作者.
 * @example var testBook = new Book('testbook', 'hia');
 */
var Book = function (title, author) {
    this.title = title;
    this.author = author;
};
```

<img src="http://hia.g56.me/hia-utils/jsdoc-plugin-hia/img/capture1.png">

如图，通过标识符 @example 生成了相应的示例代码的显示块。

## 使用步骤

如果你的需求仅止于此的话，那么jsdoc本身已经达到了你的目的。但很多时候，我们的项目本身已经包含了很多符合要求的代码可以作为示例用于文档中，那么这种情况下，最佳的办法就是直接将其引用过来。遗憾的是，jsdoc本身并没有提供这样的标识符或功能，因此，插件 jsdoc-plugin-hia 应运而生，下面就说明一下，如何使用这个插件来达到引用示例代码的效果。

1. 首先确保你已经在项目中引入了 jsdoc
1. 然后 npm 安装 jsdoc-plugin-hia 和 docdash-hia（用来配合的主题）
    ```bash
    npm i -D docdash-hia
    npm i -D jsdoc-plugin-hia
    ```
1. 在你的jsdoc配置文件中（假设是jsdco-conf.jsdon）作好相关配置
    ```json
    "plugins": [
        "plugins/markdown",
        "./jsdoc-plugin-hia"
    ],
    "markdown": {
        "hardwrap": true,
        "idInHeadings":true,
        "tags": ["file","overview","property","todo"]
    },
    "opts": {
        "template": "./node_modules/docdash-hia"
    },
    ```
1. 找到你需要引入的代码块，用@codeblock标识符将其包裹起来
    ```js
    /**@codeblock 2018-11-19 18:32:33*/
    var testBook = new Book('testbook', 'hia');
    /**@codeblockend 2018-11-19 18:32:33*/
    ```
    @codeblock 后紧跟标识名称，标识名称推荐使用：标准命名（字母数字组合）、时间戳
1. 在你希望引入代码的文档注释处，使用@coderef
    ```js
    /**
     * Book类，代表一个书本.
     * @constructor
     * @param {string} title - 书本的标题.
     * @param {string} author - 书本的作者.
     * @example @coderef 2018-11-19 18:32:33
     */
    var Book = function (title, author) {
        this.title = title;
        this.author = author;
    };
    ```
1. 项目根目录执行
    ```bash
    jsdoc ./ -c ./jsdoc-conf.json
    ```
    <img src="http://hia.g56.me/hia-utils/jsdoc-plugin-hia/img/capture2.png">

    如图，通过 @coderef 生成了相应的示例代码的显示块。（同时还生成了所引入代码的源链接）

上面这个示例比较简短，可能不是很有说服力，但可以想象一下，如果需要引用的是一大段代码，那么使用@coderef的方式就非常便捷，尤其当你更新所引用的代码块时，就不需要再在文档注释中再调整了。

## 补充说明

@coderef 可以在以下标识符块中使用：
- @desc
- @example
- @property

另外要指出的是，jsdoc-plugin-hia 的@coderef功能是跨文件的，你可以在文件A.js中定义好codeblock，然后在另一个文件B.js的文档注释中引用，只要这个codeblock的标识名称是全局唯一的，并且A.js和B.js都在同一jsdoc生成周期中即可。

@coderef 的进一步说明 见 [@coderef](annotation.md#coderef)