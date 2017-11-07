var express = require('express');
var router = express.Router();

var Archive = require('../../services/archive');

/* GET home page. */
router.get('/', function(req, res, next) {
  var lang = req.i18n.language;
  var ROOT = '';
  if (lang != 'zh-cn') {
    ROOT = '/' + lang;
  }

  Archive.getAllArchive()
    .then(function(archives) {

      res.render('blog/archive', {
        ROOT: ROOT,
        title: 'Archive',
        content: 'this is archive list',
        archives: archives,
      });
    })
    .catch(next);
});

// GET specific archive
router.get('/:year/:month', function(req, res, next) {
  var lang = req.i18n.language;
  var ROOT = '';
  if (lang != 'zh-cn') {
    ROOT = '/' + lang;
  }

  Archive.getArchiveByMonth(req.params.year, req.params.month)
    .then(function(posts) {
      res.render('blog/archive-month', {
        ROOT: ROOT,
        title: 'Archive',
        content: 'this is archive list',
        posts: posts,
      });
    })
    .catch(next);
});

module.exports = router;