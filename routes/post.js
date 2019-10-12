const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { isLoggedIn, isOwnerPost } = require('../middleware');

router.get('/new', (req, res) => { 
  res.render('addpost');
});
router.get('/:id', isLoggedIn, async (req, res) => {
  const id = req.params.id;
  const post = await Post.findById(id).populate("comments")
  res.render('showpost', { post });
});
router.post('/new', isLoggedIn, async (req, res) => {
  const { image, title, description } = req.body;
  const newPost = new Post({
    image,
    title,
    description
  });
  await newPost.save();
  return res.redirect('/');
});
router.post('/:id/delete', isOwnerPost, async (req, res) => {
  const { id } = req.params;
  await Post.findByIdAndDelete(id);
  return res.redirect('/');
});


module.exports = router;
