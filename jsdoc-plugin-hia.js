/*global
    clearInterval, clearTimeout, console, exports, module, process, require, setImmediate, setInterval, setTimeout, URL, URLSearchParams, __dirname, __filename,
    alert, confirm, prompt
*/
/*eslint-env node*/
/*eslint no-console: "off"*/
/**
 * @file jsdoc hia plugin（hia jsdoc辅助插件）

Currently, only one feature has been implemented: Implementing instructional code embedding display through *@coderef* and *@codeblock* Tags
当前只实现了一个功能：通过 *@coderef* 和 *@codeblock* 标签 实现指令式代码嵌入显示

NOTE: When using in @example, add // in the front.(@example中使用时，前面要加上//)
The following example is to show how to use @coderef. Check the corresponding display results in the following "Example":(以下为使用示例，对应的显示结果请在下面的"Example"中查看：)
<pre class="prettyprint codewithjsdoc"><code>&#x2F;&ast;&ast;
&ast; ......
&ast; &commat;example &lt;caption&gt;Embedded two code references(嵌入两个代码引用)&lt;&#x2F;caption&gt;
&ast; &#x2F;&#x2F;&commat;coderef 2018-11-19 22:38:59
&ast; &#x2F;&#x2F;&commat;coderef A
&ast; ......
&ast;&#x2F;
</code></pre>
 * @module jsdoc/plugin/hia
 * @version 1.0.0
 * @copyright mandolin 2018-2019
 * @license MIT
 * @author mandolin <mandolin.mdy@gmail.com>
 * @example <caption>Embedded two code references(嵌入两个代码引用)</caption>
 * //@coderef 2018-11-19 22:38:59
 * //@coderef A
 * @todo    todo2 preview source 对于每个文件总体、成员、类、方法、模块等，实现其对应的代码预览<br>
 * @todo    todo2 i18n 多语言文档功能<br>
 * @todo    todo2 plugin or extension for other doc generators such as esdoc 对其它文档生成器也可以考虑实现类似的插件或扩展，比如esdoc、typedoc等<br>
 */

var fs   = require('fs'  );

var jsdocPath = require('jsdoc/path');

var vars    = require('./vars'        );
var coderef = require('./tag/coderef' );

var EnumFormats      = vars.EnumFormats         ;
var TransformCoderef = coderef.TransformCoderef ;

/**@codeblock 2018-11-19 22:38:59*/
//Define global store, convenient late unified handling(定义全局存储器，方便后期统一处理)
if (!global.jsdoc) {
    global.jsdoc = {};
}
if (!global.jsdoc.codeblocks) {
    global.jsdoc.codeblocks = {};
}
if (!global.jsdoc.codeurls) {
    global.jsdoc.codeurls = {};
}
if (!global.jsdoc.sources) {
    global.jsdoc.sources = {};
}

var gjc  = global.jsdoc.codeblocks;
var gjcu = global.jsdoc.codeurls  ;
var gjs  = global.jsdoc.sources   ;

var files = {};
/**@codeblockend 2018-11-19 22:38:59*/

/**@codeblock 2018-11-16 23:16:16 */
/**
 * @desc Tags define function（标签定义函数）@coderef 2018-11-16 23:16:16

    var test=123456;//inline sample code
 * @function defineTags
 * @instance
 * @param {object} dictionary - A dictionary used to define the tag.（一个可用于定义标签的字典）
 */
exports.defineTags = function (dictionary) {
    dictionary.defineTag('codeblock', {
        //@note Identity names of codeblock cannot contain < symbols nor characters requiring regular escape.
        //@note 标识名称不能包含<符号,也不能包含需要正则转义的字符。
        //@note The corresponding @coderef tag must have an exclusive line, if not in the first line it need to lead with //, when used in @example.
        //@note 对应的@coderef标记在@example中使用时，必须独占一行，如果不在第一行则需要前置//。
        //@note The corresponding @coderef tag can only appear at the tail or have an exclusive line, when used in @desc or @property.
        //@note 对应的@coderef标记在@desc或@property中使用时，只能出现在行尾或者独占一行
        //@note Recommended use of @codeblock identity name: standard naming (alphanumeric combination) and timestamp.
        //@note @codeblock标识名称推荐使用：标准命名（字母数字组合）、时间戳
        onTagged: (doclet, tag) => {
            var codeblock = {};
            //获取文件名、路径、行号
            codeblock.filename = doclet.meta.filename;
            codeblock.path     = doclet.meta.path    ;
            codeblock.lineno   = doclet.meta.lineno  ;

            var file_path = codeblock.filepath = codeblock.path + '\\' + codeblock.filename;

            var sign = tag.text.trim();

            //获取代码块代码，并格式化为方便嵌入的格式
            var file_content = fs.readFileSync(file_path, 'utf-8');
            var code = file_content.match(new RegExp(`/\\*\\*@codeblock\\s+${sign}\\s*\\*/[\\w\\W]*/\\*\\*@codeblockend\\s+${sign}\\s*\\*/`))[0];

            //获取整体缩进偏移
            var indent = code.match(/^(\s+)(?=\S)/mg)[0];
            if (indent !== '') { //如果存在整体缩进，则整体左移
                code = code.replace(/^\s+(?=\S)/mg, ($) => $.replace(indent, '\n'));
            }

            codeblock.code = code;
            //存到全局变量中
            global.jsdoc.codeblocks[sign] = codeblock;

        }
    });
};
/**@codeblockend 2018-11-16 23:16:16 */

/**
 * @desc Handlers（事件处理集对象）
 * @name handlers
 * @type {object}
 * @property {function} parseComplete - Processing actions after all files parsed（全部文件都解析后的处理动作） @coderef 2018-11-16 23:56:16
 * @property {function} virtualProperty - virtualProperty
 * @instance

 */
exports.handlers = {
    newDoclet: (e) => {

    },

    /**@codeblock 2018-11-16 23:56:16 */
    /**
     * @desc Processing actions after all files parsed（全部文件都解析后的处理动作）
     * @param {event} e - event object,contains sourcefiles and doclets.（事件对象，包含sourcefiles和doclets。）
     */
    parseComplete: (e) => {
        global.jsdoc.commonPrefix = jsdocPath.commonPrefix(e.sourcefiles);

        e.doclets.forEach((doclet) => {
            //遍历文档块，如果包含@desc、@example、@property，则将其中的@coderef替换为相应的代码文本
            if (doclet.description) {
                doclet.description = TransformCoderef(doclet.description, EnumFormats.htm, global.jsdoc, files);
            }
            if (doclet.properties) {

                doclet.properties.forEach((property) => {
                    if (property.description) {
                        property.description = TransformCoderef(property.description, EnumFormats.htm, global.jsdoc, files)
                    }
                })
            }
            if (doclet.examples) {
                var des = doclet.examples;
                var l = des.length;

                for (let i = 0; i < l; i++) {
                    des[i] = TransformCoderef(des[i], EnumFormats.txt, global.jsdoc, files);
                }
            }
        });
    },
    /**@codeblockend 2018-11-16 23:56:16 */

    beforeParse: (e) => {
        gjs[e.filename] = e.source;
        //console.log( "​beforeParse", e )

    },


};

/**@desc <div class="preview-source"><span unselectable="on" class="toggle-preview" onclick="javascript:if(this.className=='toggle-preview'){this.className='toggle-preview toggle-preview-unfolding';this.nextElementSibling.className='prettyprint preview-pre';}else{this.className='toggle-preview';this.nextElementSibling.className='prettyprint preview-pre preview-pre-hidden';}">preview source</span><pre class="prettyprint preview-pre preview-pre-hidden"><code>//todo preview source</code></pre></div>testPreview
 * @static
 * @property xxxxx1{object} - xxxxx1
*/
var testPreview={
    /**
     */
    xxxxx:{
        yyy:1
    }
}
