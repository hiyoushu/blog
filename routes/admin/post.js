var express = require('express');
var router = express.Router();
var Post = require('../../services/post');
var checkLogin = require('../../middlewares/check').checkLogin;

/* GET home page. */
router.get('/', checkLogin,function(req, res, next) {
  res.redirect('/admin/');
});


// GET /post/create create post page
router.get('/create', checkLogin, function(req, res, next) {
  res.render('admin/post-create', { title: 'create post hiyoushu' });
});


// GET /post/edit edit post page
router.get('/edit/:postId', checkLogin, function(req, res, next) {
  var postId = req.params.postId;
  Post.getPostById(postId)
    .then(function(post) {
      res.render('admin/post-edit', {
        title: 'create post hiyoushu',
        post: post
      });
    })
    .catch(next);
});

// POST /post/edit update post
router.post('/edit/:postId', checkLogin, function(req, res, next) {
  var postId = req.params.postId;
  var author = req.session.user._id;
  var title = req.body.title;
  var content = req.body.content;
  var seoTitle = req.body.seoTitle;
  var tag = req.body.tag;
  var type = req.body.type;
  if (!type) {
    type = 'html';
  }

  // 校验参数
  try {
    if (!title.length) {
      throw new Error('please input title');
    }
    if (!content.length) {
      throw new Error('please input content');
    }
  } catch (e) {
    req.flash('error', e.message);
    return res.redirect('back');
  }

  var post = {
    title: title,
    seoTitle: seoTitle,
    author: author,
    content: content,
    tag: tag,
    type: type,
    updateTime: Date.now(),
  };

  Post.updatePostById(postId, post)
    .then(function (result) {
      // the result is the post after being inserted to the mongodb
      post = result;
      console.log(result)
      req.flash('success', 'update success !');
      // redirect to the post page after success
      res.redirect('back');
    })
    .catch(next);
});


// POST /post/create handle create post
router.post('/create', checkLogin, function(req, res, next) {
  var author = req.session.user._id,
      title = req.body.title,
      content = req.body.content,
      seoTitle = req.body.seoTitle,
      tag = req.body.tag,
      type = req.body.type,
      titleImage = req.body.coverImg;
  
  // default params
  if (!type) {
    type = 'html';
  }

  if (!titleImage) {
    titleImage = '';
  }

  // validate params
  try {
    if (!title.length) {
      throw new Error('please input title');
    }
    if (!content.length) {
      throw new Error('please input content');
    }
  } catch (e) {
    req.flash('error', e.message);
    return res.redirect('back');
  }

  var post = {
    title: title,
    seoTitle: seoTitle,
    author: author,
    content: content,
    tag: tag,
    type: type,
    createTime: Date.now(),
    updateTime: Date.now(),
    state: 'published',
    canComment: true,
    titleImage: titleImage,
    isTitleImageFullScreen: false,
    pv: 0
  };

  Post.create(post)
    .then(function (result) {
      // the result is the post after being inserted to the mongodb
      post = result;
      req.flash('success', 'post success !');
      // redirect to the post page after success
      res.redirect(`/blog/${post.seoTitle}`);
    })
    .catch(next);
});

// // GET /posts/:postId 单独一篇的文章页
// router.get('/:postId', function(req, res, next) {
//   var postId = req.params.postId;
  
//   Promise.all([
//     Post.getPostById(postId),// 获取文章信息
//     CommentModel.getComments(postId),// 获取该文章所有留言
//     Post.incPv(postId)// pv 加 1
//   ])
//   .then(function (result) {
//     var post = result[0];
//     var comments = result[1];
//     if (!post) {
//       throw new Error('该文章不存在');
//     }

//     res.render('post', {
//       post: post,
//       comments: comments
//     });
//   })
//   .catch(next);
// });

// // GET /posts/:postId/edit 更新文章页
// router.get('/:postId/edit', checkLogin, function(req, res, next) {
//   var postId = req.params.postId;
//   var author = req.session.user._id;

//   Post.getRawPostById(postId)
//     .then(function (post) {
//       if (!post) {
//         throw new Error('该文章不存在');
//       }
//       if (author.toString() !== post.author._id.toString()) {
//         throw new Error('权限不足');
//       }
//       res.render('edit', {
//         post: post
//       });
//     })
//     .catch(next);
// });

// // POST /posts/:postId/edit 更新一篇文章
// router.post('/:postId/edit', checkLogin, function(req, res, next) {
//   var postId = req.params.postId;
//   var author = req.session.user._id;
//   var title = req.body.title;
//   var content = req.body.content;

//   Post.updatePostById(postId, author, { title: title, content: content })
//     .then(function () {
//       req.flash('success', '编辑文章成功');
//       // 编辑成功后跳转到上一页
//       res.redirect(`/posts/${postId}`);
//     })
//     .catch(next);
// });


module.exports = router;
