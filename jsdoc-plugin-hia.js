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
var util = require('util');

var templateHelper = require('jsdoc/util/templateHelper');
var jsdocPath      = require('jsdoc/path'               );
var dictionary     = require('jsdoc/tag/dictionary'     );

var hasOwnProp = Object.prototype.hasOwnProperty;

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

//格式枚举
var EnumFormats = {
    txt: 0,
    htm: 1
};

var files = {};
/**@codeblockend 2018-11-19 22:38:59*/

/**
 * @desc makeUniqueFilename
    NOTE: Because templateHelper.createLink cannot be invoked directly (which will cause naming confusion), there is no better solution for now, so the *makeUniqueFilename*, *getUniqueFilename*, *createLink* are extracted directly from JSDoc and modified slightly.
    (因为不能直接调用templateHelper.createLink(这将造成命名混淆),暂时没有更好的解决方案，因此*makeUniqueFilename*、*getUniqueFilename*、*createLink*都是直接从jsdoc中摘出后稍作修改。)
 *
 * @inner makeUniqueFilename
 * @param {string} filename
 * @param {string} str
 * @returns {string} filename
 */
var makeUniqueFilename = function (filename, str) {
    var key = filename.toLowerCase();
    var nonUnique = true;

    // don't allow filenames to begin with an underscore
    if (!filename.length || filename[0] === '_') {
        filename = '-' + filename;
        key = filename.toLowerCase();
    }

    // append enough underscores to make the filename unique
    while (nonUnique) {
        if (hasOwnProp.call(files, key)) {
            filename += '_';
            key = filename.toLowerCase();
        } else {
            nonUnique = false;
        }
    }

    files[key] = str;

    return filename;
}
/**
 *
 *
 * @param {string} str
 * @returns {string} unique filename
 */
var getUniqueFilename = function (str) {
    var namespaces = dictionary.getNamespaces().join('|');
    var basename = (str || '')
        // use - instead of : in namespace prefixes
        .replace(new RegExp('^(' + namespaces + '):'), '$1-')
        // replace characters that can cause problems on some filesystems
        .replace(/[\\/?*:|'"<>]/g, '_')
        // use - instead of ~ to denote 'inner'
        .replace(/~/g, '-')
        // use _ instead of # to denote 'instance'
        .replace(/#/g, '_')
        // use _ instead of / (for example, in module names)
        .replace(/\//g, '_')
        // remove the variation, if any
        .replace(/\([\s\S]*\)$/, '')
        // make sure we don't create hidden files, or files whose names start with a dash
        .replace(/^[.-]/, '');

    // in case we've now stripped the entire basename (uncommon, but possible):
    basename = basename.length ? basename : '_';

    return makeUniqueFilename(basename, str) + templateHelper.fileExtension;
};
/**
 *
 *
 * @param {object} doclet
 * @returns {string} fileUrl
 */
var createLink = function (doclet) {
    var longname = doclet.longname;

    var filename = getUniqueFilename(longname);

    var fileUrl = encodeURI(filename);

    return fileUrl;
};

/**
 * @desc TransformCoderef
 * @function TransformCoderef
 * @param   {string} txt        - 待转换的原始文本
 * @param   {enum  } enumFormat - 格式参数
 * @returns {string}              The converted text(转换后的文本)
 */
var TransformCoderef = function (txt, enumFormat) {
    var code_links = '';
    var i = 0;

    //查找所有的@ coderef 并替换为相应代码文本
    var newtxt = txt.replace(/(@coderef\s[^\n\r\<]*)+/g, function ($) {
        var codeblock_key = $.replace('@coderef', '').trim();
        var codeblock     = gjc[codeblock_key];

        var linkpath = codeblock.filepath.replace(global.jsdoc.commonPrefix, '').replace(/\\/g, '/');

        //定义一个临时的doclet方便传参
        var temp_doclet = {
            longname: linkpath,
            memberof: null,
            kind: 'class'
        };
        var codeurl;

        if (gjcu[linkpath]) {
            codeurl = gjcu[linkpath];//如果已经缓存过，则直接从缓存取
        } else {
            codeurl = gjcu[linkpath] = createLink(temp_doclet);
            templateHelper.registerLink(linkpath, codeurl);
        }

        var codefilelink = util.format('<a href="%s"%s>%s</a>', encodeURI(codeurl), ' class="codefilelink"', codeblock.filename);
        var codelinelink = util.format('<a href="%s"%s>%s</a>', encodeURI(codeurl + '#line' + codeblock.lineno), ' class="codelinelink"', `line ${codeblock.lineno}`);
        var code = codeblock.code;
        var code_link = `${codefilelink},${codelinelink}`;
        if (enumFormat === EnumFormats.txt) {
            code_links += (i ? '<br>' : '') + code_link;
        }
        var codetxt = enumFormat === EnumFormats.htm ? `<br>${code_link}<pre class="prettyprint source"><code>${code}</code></pre>` : `//${codeurl}, line ${codeblock.lineno}\n${code}`;

        i++;

        return codetxt;
    });

    //分隔符
    var separator = '\n';
    if (newtxt.startsWith('<caption>')) {
        separator = '<br>';
    }
    if (enumFormat === EnumFormats.txt) {
        code_links = '<caption>' + code_links + '</caption>' + separator;
    }

    return code_links + newtxt;
};

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
        //@note The corresponding @coderef tag must have an exclusive line and cannot contain <i>&lt;</i> symbols nor characters requiring regular escape.
        //@note 对应的@coderef标记必须独占一行，并且不能包含<符号,不能包含需要正则转义的字符。
        //@note Recommended use of @coderef Tags: standard naming (alphanumeric combination) and timestamp.
        //@note @coderef标记推荐使用：标准命名（字母数字组合）、时间戳
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
                doclet.description = TransformCoderef(doclet.description, EnumFormats.htm);
            }
            if (doclet.properties) {

                doclet.properties.forEach((property) => {
                    if (property.description) {
                        property.description = TransformCoderef(property.description, EnumFormats.htm)
                    }
                })
            }
            if (doclet.examples) {
                var des = doclet.examples;
                var l = des.length;

                for (let i = 0; i < l; i++) {
                    des[i] = TransformCoderef(des[i], EnumFormats.txt);
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
