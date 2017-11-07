var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var lang = req.i18n.language;
  var ROOT = '';
  if (lang != 'zh-cn') {
    ROOT = '/' + lang;
  }

  res.render('about', {
    ROOT: ROOT,
    title: 'Express'
  });
});

module.exports = router;
