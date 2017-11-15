var express = require('express');
var router = express.Router();
var getLangPath = require('../../lib/get-lang-path');
var siteName = require('../../config.js').site.siteName;

var Archive = require('../../services/archive');

/* GET archive page */
router.get('/', function(req, res, next) {
  var lang = req.i18n.language;
  var langPath = getLangPath(lang);

  Archive.getAllArchive()
    .then(function(archives) {

      res.render('blog/archive', {
        langPath: langPath,
        title: req.i18n.t('blog.archive') +' - '+ siteName,
        content: 'this is archive list',
        archives: archives,
      });
    })
    .catch(next);
});

// GET specific archive
router.get('/:year/:month', function(req, res, next) {
  var lang = req.i18n.language;
  var langPath = getLangPath(lang);

  Archive.getArchiveByMonth(req.params.year, req.params.month)
    .then(function(posts) {
      res.render('blog/archive-month', {
        langPath: langPath,
        title: req.params.month +' - '+ req.params.year +' - '+ req.i18n.t('blog.archive') + ' - '+ siteName,
        content: 'this is archive list',
        posts: posts,
      });
    })
    .catch(next);
});

module.exports = router;