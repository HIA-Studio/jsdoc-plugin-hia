/**
 * @module coderef
 */
'use strict';

var util = require('util');

var templateHelper = require('jsdoc/util/templateHelper');

var helper = require('../helper');
var vars   = require('../vars'  );

var createLink  = helper.createLink;
var EnumFormats = vars.EnumFormats ;

/**
 * @desc TransformCoderef
 * @function TransformCoderef
 * @param   {string} txt        - 待转换的原始文本
 * @param   {enum  } enumFormat - 格式参数
 * @returns {string}              The converted text(转换后的文本)
 */
var TransformCoderef = function (txt, enumFormat, global_jsdoc, files) {
    var gjc  = global_jsdoc.codeblocks;
    var gjcu = global_jsdoc.codeurls  ;
    var gjs  = global_jsdoc.sources   ;


    var code_links = '';
    var i = 0;

    //查找所有的@ coderef 并替换为相应代码文本
    var newtxt = txt.replace(/(@coderef\s[^\n\r\<]*)+/g, function ($) {
        var codeblock_key = $.replace('@coderef', '').trim();
        var codeblock     = gjc[codeblock_key];

        var linkpath = codeblock.filepath.replace(global_jsdoc.commonPrefix, '').replace(/\\/g, '/');

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
            codeurl = gjcu[linkpath] = createLink(temp_doclet, files);
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
        if(code_links===''){code_links = ''}
        else{
            code_links = '<caption>' + code_links + '</caption>' + separator;
        }
    }

    return code_links + newtxt;
};

exports.TransformCoderef = TransformCoderef;
