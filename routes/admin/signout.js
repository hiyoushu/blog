var express = require('express');
var router = express.Router();
var checkLogin = require('../../middlewares/check').checkLogin;
var checkAdmin = require('../../middlewares/check').checkAdmin;

// GET /signout sign out
router.get('/', checkAdmin, checkLogin, function(req, res, next) {
  // delete session of user info
  req.session.user = null;
  req.flash('success', 'success');
  // redirect
  res.redirect('/');
});

module.exports = router;