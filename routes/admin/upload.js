var express = require('express');
var router = express.Router();
// var crypto = require('crypto'); // used for crypt upload file name
var mkdirSyncR = require('../../lib/mkdir-sync-r');
var moment = require('moment');

var checkLogin = require('../../middlewares/check').checkLogin;
var uploadDir = require('../../config').uploadDir;
var multer = require('multer');
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    var _moment = moment();
    var _tempPath = uploadDir + _moment.format('YYYY') + '/' + _moment.format('MM') + '/';

    mkdirSyncR(_tempPath, 0755, function() {
      cb(null, _tempPath);
    });
  },
  filename: function(req, file, cb) {
    // hash file name
    // crypto.pseudoRandomBytes(16, function(err, raw) {
    //   var nameFormat = (file.originalname).split('.');
    //   // cb(null, raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype))
    //   cb(null, raw.toString('hex') + Date.now() + '.' + nameFormat[nameFormat.length - 1]);
    // });

    cb(null, file.originalname);
  }
});
var upload = multer({storage: storage});


// upload file handle
router.post('/', checkLogin, function(req, res, next) {
  next();
});
router.post('/', upload.single('uploadFile'), function(req, res, next) {
  res.json({
    code: 10001,
    message: 'upload success',
    data: {
      filePath: req.file.path,
    }
  });
});

module.exports = router;
