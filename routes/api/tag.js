var express = require('express');
var router = express.Router();

var config = require('../../config');
var Tag = require('../../services/tag');
// var checkLogin = require('../../middlewares/check').checkLogin;
var token = require('../../middlewares/token').check;

// POST /:tagName create a post
router.post('/:tagName', token, function(req, res, next) {
  var tagName = req.params.tagName;
  var tag = {
    tagName: tagName
  };

  Tag.create(tag)
    .then(function (result) {
      if (result) {
        res.json({code: 10001, message: 'created', data: result});
      } else {
        res.json({code: 10002, message: 'error'});
      }
    })
    .catch(next);
});


// DELETE /:tagId  remove a post
router.delete('/:tagId', token, function(req, res, next) {
  var tagId = req.params.tagId;

  Tag.deleteTagById(tagId)
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
