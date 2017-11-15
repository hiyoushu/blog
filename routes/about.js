var express = require('express');
var router = express.Router();
var getLangPath = require('../lib/get-lang-path');
var siteName = require('../config.js').site.siteName;

/* GET home page. */
router.get('/', function(req, res, next) {
  var lang = req.i18n.language;
  var langPath = getLangPath(lang);

  res.render('about', {
    langPath: langPath,
    title: req.i18n.t('blog.about') +' - '+ siteName,
  });
});

module.exports = router;
