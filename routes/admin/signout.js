var express = require('express');
var router = express.Router();
var checkLogin = require('../../middlewares/check').checkLogin;

// GET /signout sign out
router.get('/', checkLogin, function(req, res, next) {
  // delete session of user info
  req.session.user = null;
  req.flash('success', 'success');
  // redirect
  res.redirect('/');
});

module.exports = router;