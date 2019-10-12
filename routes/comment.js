const express = require('express');
const router = express.Router({ mergeParams: true });
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const { isLoggedIn, checkOwnershipComment } = require('../middleware');

router.post('/', isLoggedIn, async (req, res) => {
    // get data from comment form
    const { text } = req.body;
    // find post by id
    const post = await Post.findById(req.params.id);
    // create new mongoose collection
    const comment = new Comment({
      text,
      author: {
        id: req.user._id,
        username: req.user.username
      }
    });
    await comment.save();
    // add comment to post
    post.comments.push(comment);
    // save post after add comment
    await post.save();
    // redirect user after created comment
    return res.redirect('/');
  });

module.exports = router;
