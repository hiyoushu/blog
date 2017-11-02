var mongoose = require('../lib/db');
var userSchema = require('../models/user');
var User = mongoose.model('User', userSchema);

module.exports = {
  // create a user
  create: function (user) {
    return User.create(user);
  },

  // get user by name
  getUserByName: function (name) {
    return User
      .findOne({ name: name })
      .exec();
  }
};
