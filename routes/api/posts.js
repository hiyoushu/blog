var express = require('express');
var router = express.Router();

var config = require('../../config');
var Post = require('../../services/post');
// var checkLogin = require('../../middlewares/check').checkLogin;
var token = require('../../middlewares/token').check;

// POST /:postId delete post
router.post('/', token, function(req, res, next) {
  var author = req.session.user._id,
      title = req.body.title,
      content = req.body.content,
      seoTitle = req.body.seoTitle,
      tag = req.body.tag,
      type = req.body.type,
      titleImage = req.body.coverImg;
  
  // default params
  if (!type) {
    type = 'html';
  }

  if (!titleImage) {
    titleImage = '';
  }

  // validate params
  try {
    if (!title.length) {
      throw new Error('please input title');
    }
    if (!content.length) {
      throw new Error('please input content');
    }
  } catch (e) {
    req.flash('error', e.message);
    return res.redirect('back');
  }

  var post = {
    title: title,
    seoTitle: seoTitle,
    author: author,
    content: content,
    tag: tag,
    type: type,
    createTime: Date.now(),
    updateTime: Date.now(),
    state: 'published',
    canComment: true,
    titleImage: titleImage,
    isTitleImageFullScreen: false,
    pv: 0
  };

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
