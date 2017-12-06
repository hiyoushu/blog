var mongoose = require('../lib/db');
var postSchema = require('../models/post');
var Post = mongoose.model('Post', postSchema);
// var User = mongoose.model('User', userSchema);

module.exports = {
  // create a post
  create: function (post) {
    return Post.create(post);
  },

  // get post by id
  getPostById: function (postId) {
    return Post
      .findOne({ _id: postId })
      // .populate({ path: 'author', model: 'User' })
      // .addCreatedAt()
      // .contentToHtml()
      .exec();
  },

  // get post by seoTitle
  getPostBySeoTitle: function (seoTitle) {
    return Post
      .findOneAndUpdate({
        seoTitle: seoTitle,
        state: 'published'
      }, {
        $inc: {pv: 1}
      })
      .exec();
  },

  // get author's all post
  getPostsByAuthor: function (author) {
    var query = {
      state: 'published'
    };
    if (author) {
      query.author = author;
    }
    return Post
      .find(query)
      .populate({ path: 'author', model: 'User' })
      .sort({ createTime: -1 })
      // .addCreatedAt()
      // .contentToHtml()
      .exec();
  },

  // get posts by tag name
  getByTagName: function(tagName) {
    var query = {
      state: 'published'
    };
    if (tagName) {
      query.tag = tagName;
    }
    return Post
      .find(query)
      // .populate({ path: 'author', model: 'User' })
      .sort({ createTime: 'desc' })
      .exec();
  },

  // get post by given number
  getPostsByNum: function(num) {
    var query = {
      state: 'published'
    };
    if (num == '' || num == undefined) {
      num = 1;
    }
    return Post
      .find(query)
      .limit(num)
      .sort({ createTime: 'desc' })
      .exec();
  },

  // get post by page size and page number
  getPostsByPaging: function(pageSize = 10, pageNumber = 1) {
    var query = {
      state: 'published'
    };

    return Post
      .find(query)
      .sort({ createTime: 'desc' })
      .skip(pageSize * (pageNumber - 1))
      .limit(pageSize)
      .exec();
  },

  // increase pv
  incPv: function (postId) {
    return Post
      .update({ _id: postId }, { $inc: { pv: 1 } })
      .exec();
  },

  // get raw post by Id
  getRawPostById: function (postId) {
    return Post
      .findOne({ _id: postId })
      .populate({ path: 'author', model: 'User' })
      .exec();
  },

  // update post by Id
  updatePostById: function (postId, data) {
    return Post
      .update({ _id: postId }, { $set: data })
      .findOne({ _id: postId })
      .exec();
  },

  // delete post by Id
  deletePostById: function (postId) {
    return Post
      .remove({ _id: postId })
      .exec();
  },

  // get post count
  getPostAmount: function () {
    return Post
      .count({})
      .exec();
  },



  // transform content of post from markdown to html
  // postSchema.plugin('contentToHtml', {
  //   afterFind: function (posts) {
  //     return posts.map(function (post) {
  //       post.content = marked(post.content);
  //       return post;
  //     });
  //   },
  //   afterFindOne: function (post) {
  //     if (post) {
  //       post.content = marked(post.content);
  //     }
  //     return post;
  //   }
  // });
};