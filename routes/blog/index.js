var express = require('express');
var router = express.Router();

var Post = require('../../services/post');
var Tag = require('../../services/tag');
var Archive = require('../../services/archive');
var checkLogin = require('../../middlewares/check').checkLogin;

// (how to get query string: req.query.foo)

/* GET home page */
router.get('/', function(req, res, next) {
  var lang = req.i18n.language;
  var ROOT = '';
  if (lang != 'zh-cn') {
    ROOT = '/' + lang;
  }

  Promise.all([
    Post.getPostsByPaging(10, 1),
    Tag.getAllTags(),
    Archive.getAllArchive(),
  ])
    .then(function(result) {
        
      if (result == null) {
        next();
      } else {

        var posts = result[0],
            tags = result[1],
            archives = result[2];

        res.render('blog/index', {
          ROOT: ROOT,
          title: 'test create',
          content: 'This is blog index page',
          tags: tags,
          posts: posts,
          archives: archives,
        });
      }
    })
    .catch(next);
});


// GET /:seoTitle get the post by seoTitle
router.get('/:seoTitle', function(req, res, next) {
  var lang = req.i18n.language;
  var ROOT = '';
  if (lang != 'zh-cn') {
    ROOT = '/' + lang;
  }

  Post.getPostBySeoTitle(req.params.seoTitle)
    .then(function (posts) {
      if (posts == null) {
        next();
      } else {
        res.render('blog/post', {
          ROOT: ROOT,
          title: posts.title,
          content: posts.content
        });
      }
    })
    .catch(next);
});

module.exports = router;
