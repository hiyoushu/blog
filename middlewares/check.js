module.exports = {
  checkLogin: function checkLogin(req, res, next) {
    if (!req.session.user) {      
      var _protocol;
      if (req.headers['x-forwarded-proto']) {
        _protocol = req.headers['x-forwarded-proto'];
      } else {
        _protocol = req.protocol;
      }  
      
      var fullUrl = _protocol + '://' + req.headers['host'] + req.originalUrl;

      req.flash('error', 'not log in'); 
      return res.redirect('/admin/signin?redirect='+ fullUrl);
    }
    next();
  },

  checkNotLogin: function checkNotLogin(req, res, next) {
    if (req.session.user) {
      req.flash('error', 'has logged in'); 
      return res.redirect('back');
    }
    next();
  }
};
