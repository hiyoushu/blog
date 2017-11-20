var mongoose = require('../lib/db');
var tagSchema = require('../models/tag');
var Tag = mongoose.model('Tag', tagSchema);

module.exports = {
  // create a tag
  create: function(tag) {
    return Tag.create(tag);
  },

  // find all tags
  getAllTags: function() {
    return Tag.find().exec();
  },

  // find tags by tagName
  getByTagName: function(tagName) {
    return Tag.find({tagName: tagName}).exec();
  },

  // delete tag by tagId
  deleteTagById: function (tagId) {
    return Tag
      .remove({ _id: tagId })
      .exec();
  },
}