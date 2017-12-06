var express = require('express');
var router = express.Router();
var OpenCC = require('opencc');
var getLangPath = require('../../lib/get-lang-path');
var siteName = require('../../config.js').site.siteName;

var Archive = require('../../services/archive');

/* GET archive page */
router.get('/', function(req, res, next) {
  var lang = req.i18n.language;
  var langPath = getLangPath(lang);

  var urlWithoutLang = req.originalUrl.replace('/'+ lang, '');

  Archive.getAllArchive()
    .then(function(archives) {
      // convert zh-hans to zh-hant
      if (lang.toLowerCase() == 'zh-hant') {
        var opencc = new OpenCC('s2t.json');
        archives = JSON.parse(opencc.convertSync(JSON.stringify(archives)));
      }

      res.render('blog/archive', {
        langPath: langPath,
        title: req.i18n.t('blog.archive') +' - '+ siteName,
        content: 'this is archive list',
        archives: archives,
        originPath: urlWithoutLang,
      });
    })
    .catch(next);
});

// GET specific archive
router.get('/:year/:month', function(req, res, next) {
  var lang = req.i18n.language;
  var langPath = getLangPath(lang);

  var urlWithoutLang = req.originalUrl.replace('/'+ lang, '');

  Archive.getArchiveByMonth(req.params.year, req.params.month)
    .then(function(posts) {
      // convert zh-hans to zh-hant
      if (lang.toLowerCase() == 'zh-hant') {
        var opencc = new OpenCC('s2t.json');
        posts = JSON.parse(opencc.convertSync(JSON.stringify(posts)));
      }

      res.render('blog/archive-month', {
        langPath: langPath,
        title: req.params.month +' - '+ req.params.year +' - '+ req.i18n.t('blog.archive') + ' - '+ siteName,
        content: 'this is archive list',
        posts: posts,
        originPath: urlWithoutLang,
      });
    })
    .catch(next);
});

module.exports = router;