var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  var Tag = require('../../services/tag');

  Tag.getAllTags()
    .then(function(tags) {
      res.render('blog/tag-index', {
        title: 'tags',
        content: 'all tags',
        tags: tags
      });
    })
    .catch(next);
});

// GET /:tagName get the posts by tagName
router.get('/:tagName', function(req, res, next) {
  var Post = require('../../services/post');

  Post.getByTagName(req.params.tagName)
    .then(function (posts) {
      if (posts == null) {
        next();
      } else {
        res.render('blog/list', {
          title: 'posts of this tag',
          content: 'post about this tag',
          posts: posts
        });
      }
    })
    .catch(next);
});

module.exports = router;