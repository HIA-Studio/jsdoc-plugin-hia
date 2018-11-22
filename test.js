/**
 * @file 这是一个测试
 */

/**
 * Book类，代表一个书本.
 * An example of the Book are as follows:(一个Book的例子为：) @coderef 2018-11-19 18:32:33
 * @constructor
 * @param {string} title - 书本的标题.
 * @param {string} author - 书本的作者.
 * @example //Another example of the Book are as follows:(另一个Book的例子为：)
 * //@coderef A
 *
 * var x=1111;y=21;
 *
 */
var Book = function (title, author) {
    this.title = title;
    this.author = author;
};

/**some text **some bold text** some text(一些文本 **粗体文本** 一些文本)
 * @global
 * @property x{number} - x property
 * @property y{number} - y property
 */
var test = {
    x: 1,
    y: 2
};

/**@codeblock 2018-11-19 18:32:33*/
var testBook = new Book('testbook', 'hia');
/**@codeblockend 2018-11-19 18:32:33*/
