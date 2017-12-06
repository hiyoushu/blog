var express = require('express');
var router = express.Router();
var OpenCC = require('opencc');
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

  var urlWithoutLang = req.originalUrl.replace('/'+ lang, '');

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

        // convert zh-hans to zh-hant
        if (lang.toLowerCase() == 'zh-hant') {
          var opencc = new OpenCC('s2t.json');
          posts = JSON.parse(opencc.convertSync(JSON.stringify(posts)));
          tags = tags.map(function(elem) {
            elem.realTagName = elem.tagName;
            elem.tagName = opencc.convertSync(elem.tagName);
            return elem;
          })
          archives = JSON.parse(opencc.convertSync(JSON.stringify(archives)));
        }

        // add post intro
        posts = posts.map(function(elem) {
          elem.intro = elem.content.replace(/<[^>]+>/g, '');
          return elem;
        })

        res.render('blog/index', {
          langPath: langPath,
          title: req.i18n.t('blog.blog') +' - '+ siteName,
          content: siteName +' '+ req.i18n.t('blog.blog'),
          tags: tags,
          posts: posts,
          archives: archives,
          prevPage: prevPage,
          nextPage: nextPage,
          pageNum: 1,
          originPath: urlWithoutLang,
        });
      }
    })
    .catch(next);
});


/* GET home post list by page */
router.get('/page/:pageNum', function(req, res, next) {
  var lang = req.i18n.language;
  var langPath = getLangPath(lang);

  var urlWithoutLang = req.originalUrl.replace('/'+ lang, '');

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

        // paging
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

        // convert zh-hans to zh-hant
        if (lang.toLowerCase() == 'zh-hant') {
          var opencc = new OpenCC('s2t.json');
          posts = JSON.parse(opencc.convertSync(JSON.stringify(posts)));
          tags = tags.map(function(elem) {
            elem.realTagName = elem.tagName;
            elem.tagName = opencc.convertSync(elem.tagName);
            return elem;
          })
          archives = JSON.parse(opencc.convertSync(JSON.stringify(archives)));
        }

        // add post intro
        posts = posts.map(function(elem) {
          elem.intro = elem.content.replace(/<[^>]+>/g, '');
          return elem;
        })

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
          originPath: urlWithoutLang,
        });
      }
    })
    .catch(next);
});


// GET /:seoTitle get the post by seoTitle
router.get('/:seoTitle', function(req, res, next) {
  var lang = req.i18n.language;
  var langPath = getLangPath(lang);

  var urlWithoutLang = req.originalUrl.replace('/'+ lang, '');

  Post.getPostBySeoTitle(req.params.seoTitle)
    .then(function (posts) {
      if (posts == null) {
        next();
      } else {
        // convert zh-hans to zh-hant
        if (lang.toLowerCase() == 'zh-hant') {
          var opencc = new OpenCC('s2t.json');
          posts = JSON.parse(opencc.convertSync(JSON.stringify(posts)));
        }

        res.render('blog/post', {
          langPath: langPath,
          title: posts.title +' - '+ siteName,
          content: posts.content,
          postId: posts._id,
          originPath: urlWithoutLang,
        });
      }
    })
    .catch(next);
});

module.exports = router;
