var jwt = require('jsonwebtoken');
var config = require('../config');

var tokenMiddleware = {};

tokenMiddleware.check = function(req, res, next) {
  var token = req.headers['x-token'] || '';

  jwt.verify(token, config.jwt.secret, function(err, decoded) {
    if (err) {
      return res
              .status(401)
              .send('invalid token');
    }

    // console.log(decoded)

    next();
  });
}

module.exports = tokenMiddleware;
