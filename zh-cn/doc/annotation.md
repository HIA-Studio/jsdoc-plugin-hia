---
title: 标识符

layout: page
---
## 目录

| 标识符 | 说明 | 别名 |
| --- | --- | --- |
| [@coderef](#coderef) | 将对应的 @codeblock 所包裹的代码块导入文档注释中当前 @coderef 所处的位置 | — |


## @coderef

通过标识名称引入指定代码

### 语法
```
@codref <blockName>
```

### 概述
将对应的 @codeblock 所包裹的代码块导入文档注释中当前 @coderef 所处的位置

### 示例
- 在 @desc 中使用
    ```js
    /**
     * Book类，代表一个书本.
     * An example of the Book are as follows:(一个Book的例子为：) @coderef 2018-11-19 18:32:33
     * @constructor
     * @param {string} title - 书本的标题.
     * @param {string} author - 书本的作者.
     */
    var Book = function (title, author) {
        this.title = title;
        this.author = author;
    };
    ```
- 在 @example 中使用
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
- 在 @property 中使用
    ```js
    /**
    * @namespace
    * @property {object  } transform          - transform handler.
    * @property {function} transform.mdToHtml - function of thansform md file to html. @coderef mdtohtml_example
    */
    var handlers = {
        transform: {
            mdToHtml:function(sources,opt){
                //some code
            }
        }
    };
    ```
### 注意事项
- 标识名称不能包含<符号,也不能包含需要正则转义的字符。
- 对应的@coderef标记在@example中使用时，必须独占一行，如果不在第一行则需要前置//。
- 对应的@coderef标记在@desc或@property中使用时，只能出现在行尾或者独占一行
- @codeblock标识名称推荐使用：标准命名（字母数字组合）、时间戳
