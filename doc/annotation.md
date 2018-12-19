---
title: Annotation

layout: page
---
## TABLE OF CONTENT

| Annotation | Description | Aliases |
| --- | --- | --- |
| [@coderef](#coderef) | Import the code block wrapped by the corresponding @codeblock into the current @coderef location in the document comment | — |


## @coderef

Ref the specified existing code block by identity name

### Sytax
```bash
@codref <blockName>
```

### Overview
Import the code block wrapped by the corresponding @codeblock into the current @coderef location in the document comment

### Samples
- used in @desc
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
- used in @example
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
- used in @property
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
### Notes
- Identity names of codeblock cannot contain < symbols nor characters requiring regular escape.
- The corresponding @coderef tag must have an exclusive line, if not in the first line it need to lead with //, when used in @example.
- The corresponding @coderef tag can only appear at the tail or have an exclusive line, when used in @desc or @property.
- Recommended use of @codeblock identity name: standard naming (alphanumeric combination) and timestamp.
