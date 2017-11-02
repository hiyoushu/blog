var mongoose = require('../lib/db');
var postSchema = require('../models/post');
var Post = mongoose.model('Post', postSchema);
var postsToArchive = require('../lib/posts-to-archive');

module.exports = {
  // find all post by year and month
  getAllArchive: function() {
    return Post
      .find({ state: 'published' })
      .select('createTime')
      .sort({ createTime: -1 })
      .exec()
      .then(function(posts) {
        return postsToArchive(posts);
      });
  },
  
  // find specific archive
  getArchiveByMonth: function(year, month) {
    month = parseInt(month);
    if (month > 12) {
      month = 12;
    }

    return Post
      .find({
        createTime: {
          $gte: new Date(year, month - 1),
          $lt: new Date(year, month),
        },
        state: 'published'
      })
      .sort({ createTime: -1 })
      .exec();
  }
}
