var express = require('express');
var router = express.Router();

var Post = require('../../services/post');
var Tag = require('../../services/tag');
var Archive = require('../../services/archive');
var checkLogin = require('../../middlewares/check').checkLogin;
var checkAdmin = require('../../middlewares/check').checkAdmin;


/* GET home page. */
router.get('/', checkAdmin, checkLogin, function(req, res, next) {
  Promise.all([
    Post.getPostsByNum(20),
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
        res.render('admin/index', {
          title: 'admin index page',
          posts: posts,
          tags: tags,
          archives: archives,
        });
      }
    })
    .catch(next);
});


module.exports = router;
