var express = require('express');
var router = express.Router();

var config = require('../../config');
var Post = require('../../services/post');
// var checkLogin = require('../../middlewares/check').checkLogin;
var token = require('../../middlewares/token').check;


// DELETE /:postId delete post
router.delete('/:postId', token, function(req, res, next) {
  var postId = req.params.postId;

  Post.deletePostById(postId)
    .then(function (result) {
      if (result.result.ok == 1) {
        res.json({code: 10001, message: 'deleted'});
      } else {
        res.json({code: 10002, message: 'error'});
      }
      
    })
    .catch(next);
});

module.exports = router;
