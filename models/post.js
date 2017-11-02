var mongoose = require('../lib/db');
var Schema = mongoose.Schema;

/**
 * state: draft, published
 * type: html, md
 */

var postSchema = new Schema({
  title: String,
  seoTitle: {type: String, unique: true},
  author: String,
  content: String,
  tag: String,
  type: String,
  createTime: {type: Date, default: Date.now},
  updateTime: Date,
  state: String,
  canComment: Boolean,
  titleImage: String,
  isTitleImageFullScreen: Boolean,
  pv: Number
});


module.exports = postSchema;
