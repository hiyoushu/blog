var express = require('express');
var router = express.Router();
var getLangPath = require('../../lib/get-lang-path');
var siteName = require('../../config.js').site.siteName;


/* GET tag page */
router.get('/', function(req, res, next) {
  var lang = req.i18n.language;
  var langPath = getLangPath(lang);

  var Tag = require('../../services/tag');

  var urlWithoutLang = req.baseUrl.replace('/'+ lang, '');

  Tag.getAllTags()
    .then(function(tags) {
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

  var urlWithoutLang = req.baseUrl.replace('/'+ lang, '');

  Post.getByTagName(req.params.tagName)
    .then(function (posts) {
      if (posts == null) {
        next();
      } else {
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