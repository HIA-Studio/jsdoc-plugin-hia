/**
 * @module helper
 */
'use strict';

var templateHelper = require('jsdoc/util/templateHelper');
var dictionary     = require('jsdoc/tag/dictionary'     );

var hasOwnProp = Object.prototype.hasOwnProperty;

/**
 * @desc makeUniqueFilename
    NOTE: Because templateHelper.createLink cannot be invoked directly (which will cause naming confusion), there is no better solution for now, so the *makeUniqueFilename*, *getUniqueFilename*, *createLink* are extracted directly from JSDoc and modified slightly.
    (因为不能直接调用templateHelper.createLink(这将造成命名混淆),暂时没有更好的解决方案，因此*makeUniqueFilename*、*getUniqueFilename*、*createLink*都是直接从jsdoc中摘出后稍作修改。)
 *
 * @private
 * @param {string} filename
 * @param {string} str
 * @param {string} files
 * @returns {string} filename
 */
var makeUniqueFilename = function (filename, str, files) {
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
 * @private
 * @param {string} str
 * @param {string} files
 * @returns {string} unique filename
 */
var getUniqueFilename = function (str, files) {
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

    return makeUniqueFilename(basename, str, files) + templateHelper.fileExtension;
};

/**
 *
 *
 * @param {object} doclet
 * @param {string} files
 * @returns {string} fileUrl
 */
var createLink = function (doclet, files) {
    var longname = doclet.longname;

    var filename = getUniqueFilename(longname, files);

    var fileUrl = encodeURI(filename);

    return fileUrl;
};

exports.createLink = createLink;
