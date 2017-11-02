var mongoose = require('../lib/db');
var Schema = mongoose.Schema;

var tagSchema = new Schema({
  tagName: {type: String, unique: true}
});

module.exports = tagSchema;
