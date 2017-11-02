var mongoose = require('../lib/db');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  uid: Number,
  name: {type: String, unique: true},
  nickName: String,
  password: String,
  isAdmin: Boolean,
  email: {type: String, unique: true},
  avatar: String,
  postNumber: Number,
  createTime: {type: Date, default: Date.now}
});

module.exports = userSchema;
