var express = require('express');
var router = express.Router();
var OpenCC = require('opencc');
var getLangPath = require('../../lib/get-lang-path');
var siteName = require('../../config.js').site.siteName;


/* GET tag page */
router.get('/', function(req, res, next) {
  var lang = req.i18n.language;
  var langPath = getLangPath(lang);

  var Tag = require('../../services/tag');

  var urlWithoutLang = req.originalUrl.replace('/'+ lang, '');

  Tag.getAllTags()
    .then(function(tags) {
      // convert zh-hans to zh-hant
      if (lang.toLowerCase() == 'zh-hant') {
        var opencc = new OpenCC('s2t.json');
        tags = JSON.parse(opencc.convertSync(JSON.stringify(tags)));
      }

      res.render('blog/tag-index', {
        langPath: langPath,
        title: req.i18n.t('blog.tag') +' - '+ siteName,
        content: 'all tags',
        tags: tags,
        originPath: urlWithoutLang,
      });
    })
    .catch(next);
});

// GET /:tagName get the posts by tagName
router.get('/:tagName', function(req, res, next) {
  var lang = req.i18n.language;
  var langPath = getLangPath(lang);

  var Post = require('../../services/post');

  var urlWithoutLang = req.originalUrl.replace('/'+ lang, '');

  var realTagName = req.params.tagName;
  if (lang.toLowerCase() == 'zh-hant') {
    var opencc = new OpenCC('t2s.json');
    realTagName = opencc.convertSync(req.params.tagName);
  }

  Post.getByTagName(realTagName)
    .then(function (posts) {
      if (posts == null) {
        next();
      } else {
        // convert zh-hans to zh-hant
        if (lang.toLowerCase() == 'zh-hant') {
          var opencc = new OpenCC('s2t.json');
          posts = JSON.parse(opencc.convertSync(JSON.stringify(posts)));
        }

        res.render('blog/list', {
          langPath: langPath,
          title: req.params.tagName +' - '+ req.i18n.t('blog.tag') +' - '+ siteName,
          content: 'post about this tag',
          posts: posts,
          originPath: urlWithoutLang,
        });
      }
    })
    .catch(next);
});

module.exports = router;