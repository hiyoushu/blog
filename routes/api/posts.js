var express = require('express');
var router = express.Router();

var config = require('../../config');
var Post = require('../../services/post');
// var checkLogin = require('../../middlewares/check').checkLogin;
var token = require('../../middlewares/token').check;

// POST /:postId delete post
router.post('/', token, function(req, res, next) {
  var post = req.body;

  Post.create(post)
    .then(function (result) {
      if (result) {
        res
          .status(201)
          .json({code: 10001, message: 'created', data: result});
      } else {
        res
          .status(400)
          .json({code: 10002, message: 'error', error: 'create failed!'});
      }
    })
    .catch(next);
});

// DELETE /:postId delete post
router.delete('/:postId', token, function(req, res, next) {
  var postId = req.params.postId;

  Post.deletePostById(postId)
    .then(function (result) {
      if (result.result.ok == 1) {
        res
          .status(204)
          .json({code: 10001, message: 'deleted'});
      } else {
        res
          .status(400)
          .json({code: 10002, message: 'error', error: 'delete failed!'});
      }
    })
    .catch(next);
});

module.exports = router;
