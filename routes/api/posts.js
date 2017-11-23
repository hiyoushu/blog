var express = require('express');
var router = express.Router();

var config = require('../../config');
var Post = require('../../services/post');
var token = require('../../middlewares/token');

// POST / create post
router.post('/', token.check, function(req, res, next) {
  var author = req.body.userId,
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
  if (!author) {
    return res
            .status(400)
            .json({code: 10002, message: 'error', error: 'please input author!'});
  }
  if (!title.length) {
    return res
            .status(400)
            .json({code: 10002, message: 'error', error: 'please input title!'});
  }
  if (!content.length) {
    return res
            .status(400)
            .json({code: 10002, message: 'error', error: 'please input content!'});
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


// PUT / update a post
router.put('/', token.check, function(req, res, next) {
  var postId = req.body.postId,
      author = req.body.userId,
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
  if (!author) {
    return res
            .status(400)
            .json({code: 10002, message: 'error', error: 'please input author!'});
  }
  if (!title.length) {
    return res
            .status(400)
            .json({code: 10002, message: 'error', error: 'please input title!'});
  }
  if (!content.length) {
    return res
            .status(400)
            .json({code: 10002, message: 'error', error: 'please input content!'});
  }

  var post = {
    title: title,
    seoTitle: seoTitle,
    author: author,
    content: content,
    tag: tag,
    type: type,
    updateTime: Date.now(),
  };

  Post.updatePostById(postId, post)
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
router.delete('/:postId', token.check, function(req, res, next) {
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
