var express = require('express');
var router = express.Router();
var getLangPath = require('../../lib/get-lang-path');
var siteName = require('../../config.js').site.siteName;

var Post = require('../../services/post');
var Tag = require('../../services/tag');
var Archive = require('../../services/archive');
var checkLogin = require('../../middlewares/check').checkLogin;

// (how to get query string: req.query.foo)

/* GET home page */
router.get('/', function(req, res, next) {
  var lang = req.i18n.language;
  var langPath = getLangPath(lang);

  Promise.all([
    Post.getPostsByPaging(10, 1),
    Tag.getAllTags(),
    Archive.getAllArchive(),
    Post.getPostAmount(),
  ])
    .then(function(result) {
        
      if (result == null) {
        next();
      } else {

        var posts = result[0],
            tags = result[1],
            archives = result[2],
            amount = result[3];

        var nextPage, prevPage;

        if (amount <= 10) {
          nextPage = 0;
        } else {
          nextPage = 2;
        }

        prevPage = 0;

        res.render('blog/index', {
          langPath: langPath,
          title: req.i18n.t('blog.blog') +' - '+ siteName,
          content: 'This is blog index page',
          tags: tags,
          posts: posts,
          archives: archives,
          prevPage: prevPage,
          nextPage: nextPage,
          pageNum: 1,
        });
      }
    })
    .catch(next);
});


/* GET home post list by page */
router.get('/page/:pageNum', function(req, res, next) {
  var lang = req.i18n.language;
  var langPath = getLangPath(lang);

  var pageNum = req.params.pageNum ? parseInt(req.params.pageNum, 10) : 1;

  Promise.all([
    Post.getPostsByPaging(10, pageNum),
    Tag.getAllTags(),
    Archive.getAllArchive(),
    Post.getPostAmount(),
  ])
    .then(function(result) {
        
      if (result == null) {
        next();
      } else {

        var posts = result[0],
            tags = result[1],
            archives = result[2],
            amount = result[3];

        if (posts.length == 0) {
          next();
        }

        var nextPage, prevPage;

        if (amount <= 10 * pageNum) {
          nextPage = 0;
        } else {
          nextPage = pageNum + 1;
        }

        if (pageNum == 1) {
          prevPage = 0;
        } else {
          prevPage = pageNum - 1;
        }

        res.render('blog/index', {
          langPath: langPath,
          title: 'Page '+ pageNum +' - '+ req.i18n.t('blog.blog') +' - '+ siteName,
          content: 'This is blog index page',
          tags: tags,
          posts: posts,
          archives: archives,
          prevPage: prevPage,
          nextPage: nextPage,
          pageNum: pageNum,
        });
      }
    })
    .catch(next);
});


// GET /:seoTitle get the post by seoTitle
router.get('/:seoTitle', function(req, res, next) {
  var lang = req.i18n.language;
  var langPath = getLangPath(lang);

  Post.getPostBySeoTitle(req.params.seoTitle)
    .then(function (posts) {
      if (posts == null) {
        next();
      } else {
        res.render('blog/post', {
          langPath: langPath,
          title: posts.title,
          content: posts.content
        });
      }
    })
    .catch(next);
});

module.exports = router;
