/**
 * db.js
 * 
 */

var mongoose = require('mongoose');
var config = require('../config');

mongoose.connect(config.mongodb.database, {useMongoClient: true});
mongoose.Promise = global.Promise;

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongoose connection error : '));
db.once('open', function(){
  console.log('mongoose connection ok!');

  var userSchema = require('../models/user');
  var User = mongoose.model('User', userSchema);
  var sha1 = require('sha1');

  User.find({}, function(error, result) {
    if (error) {
      console.log('init data go wrong: '+ error);
    } else if(!result.length) {
      var admin = new User({
        uid: 1,
        name: config.admin.userName,
        nickName: config.admin.nickName,
        password: sha1(config.admin.password),
        isAdmin: true,
        email: config.admin.email,
        avatar: config.admin.avatar,
        postNumber: 0,
        createTime: new Date() 
      });

      admin.save(function (error) {
        if (error) {
          console.log('save error:' + error);
        }
        
        console.log('init account sucess');
      });
    }
  })
});

module.exports = mongoose;
