var express = require('express');
var router = express.Router();
var config = require('../../config');
var sha1 = require('sha1');
var User = require('../../services/user');
var checkNotLogin = require('../../middlewares/check').checkNotLogin;
var checkAdmin = require('../../middlewares/check').checkAdmin;

// GET / sign in page
router.get('/', checkAdmin, checkNotLogin,function(req, res, next) {
  if (!config.login.available) {
    return next();
  }

  res.render('admin/signin', { title: 'signin' });
});

// POST / sign in request
router.post('/', checkAdmin, checkNotLogin, function(req, res, next) {
  var name = req.body.name;
  var password = req.body.password;
  var redirectURL = req.query.redirect;

  User.getUserByName(name)
    .then(function (user) {
      if (!user) {
        req.flash('error', 'user does not dexist');
        return res.redirect('back');
      }
      // check if the name and password match
      if (sha1(password) !== user.password) {
        req.flash('error', 'name or password does not match');
        return res.redirect('back');
      }
      req.flash('success', 'success');
      // write user info to session
      delete user.password;
      req.session.user = user;
      // redirect
      if (redirectURL != '' && redirectURL != undefined) {
        res.redirect(redirectURL);
      } else {
        res.redirect('/admin/');
      }
    })
    .catch(next);
});

module.exports = router;
