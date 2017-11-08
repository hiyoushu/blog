var express = require('express');
var router = express.Router();
var getLangPath = require('../lib/get-lang-path');

/* GET home page. */
router.get('/', function(req, res, next) {
  var lang = req.i18n.language;
  var langPath = getLangPath(lang);

  res.render('index', {
    langPath: langPath,
    title: 'Youshu'
  });
});

module.exports = router;
