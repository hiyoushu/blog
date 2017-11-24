var express = require('express');
var router = express.Router();
var getLangPath = require('../lib/get-lang-path');

/* GET home page */
router.get('/', function(req, res, next) {
  var lang = req.i18n.language;
  var langPath = getLangPath(lang);

  var urlWithoutLang = req.baseUrl.replace('/'+ lang, '');

  res.render('index', {
    langPath: langPath,
    title: 'Youshu',
    originPath: urlWithoutLang,
  });
});

/* GET home page with lang */
router.get('/:lang', function(req, res, next) {
  var paramLang = req.params.lang.toLowerCase();

  if (!req.i18n) {
    return res
            .status(404)
            .render('404-without-i18n', {langPath: '/', originPath: urlWithoutLang});
  } else {
    var getLangPath = require('../lib/get-lang-path');
    var lang = req.i18n ? req.i18n.language : 'zh-CN';
    var langPath = getLangPath(lang);

    var urlWithoutLang = req.baseUrl.replace('/'+ lang, '');
    var languages = req.i18n.options.preload.map(function(elem) {
      return elem.toLowerCase();
    });

    if (paramLang != lang) {
      if (languages.indexOf(paramLang) > -1) {
        req.i18n.changeLanguage(paramLang);
      } else {
        return res
                .status(404)
                .render('404', {langPath: '/', originPath: urlWithoutLang});
      }
    }
  }

  res.render('index', {
    langPath: langPath,
    title: 'Youshu',
    originPath: urlWithoutLang,
  });
});

module.exports = router;
