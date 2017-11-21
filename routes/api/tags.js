var express = require('express');
var router = express.Router();

var config = require('../../config');
var Tag = require('../../services/tag');
// var checkLogin = require('../../middlewares/check').checkLogin;
var token = require('../../middlewares/token').check;

// POST / create a tag
router.post('/', token, function(req, res, next) {
  var tag = req.body;

  Tag.create(tag)
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


// DELETE /:tagId  remove a tag
router.delete('/:tagId', token, function(req, res, next) {
  var tagId = req.params.tagId;

  Tag.deleteTagById(tagId)
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
