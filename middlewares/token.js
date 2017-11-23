var jwt = require('jsonwebtoken');
var expressjwt = require('express-jwt');
var config = require('../config');

var tokenMiddleware = {};

tokenMiddleware.check = function(req, res, next) {
  var token = req.headers['x-token'] || '';
  if (token) {
    try {
      var decodedToken = jwt.decode(token, config.jwt.secret);

      console.log(decodedToken)
      // console.log(expressjwt({secret: config.jwt.secret}));

    } catch (err) {
      return next();
    }
  } else {
    res
      .status(401)
      .send('invalid token');
  }
  
  next();
}

module.exports = tokenMiddleware;
