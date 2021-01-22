const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

//Model
const Post = require('../../models/Post');
const User = require('../../models/User');

// @Route   POST api/posts
// @desc    Create post
// @access  Private
router.post(
  '/',
  [auth, [check('text', 'Text is required').notEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ erros: errors.array() });

    try {
      const newPost = new Post({
        text: req.body.text,
        user: req.user.id
      });
      const post = await newPost.save();
      res.json(post);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
);

// @Route   GET api/posts
// @desc    Get All post
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', ['name', 'avatar'])
      .sort({ date: -1 });
    res.json(posts);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @Route   GET api/posts/:id
// @desc    Get post by id
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const posts = await Post.findById(req.params.id).populate('user', [
      'name',
      'avatar'
    ]);

    if (!posts) return res.status(404).json({ msg: 'Post Not Found' });

    res.json(posts);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId')
      return res.status(404).json({ msg: 'Post Not Found' });
    res.status(500).send('Server Error');
  }
});

// @Route   GET api/posts/:id
// @desc    Get post by id
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const posts = await Post.findById(req.params.id).populate('user', [
      'name',
      'avatar'
    ]);

    if (!posts) return res.status(404).json({ msg: 'Post Not Found' });

    res.json(posts);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId')
      return res.status(404).json({ msg: 'Post Not Found' });
    res.status(500).send('Server Error');
  }
});

// @Route   GET api/posts/:id
// @desc    DELETE post by id
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //Check Post
    if (!post) return res.status(404).json({ msg: 'Post Not Found' });

    //Check User
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await post.remove();
    res.json({ msg: 'Post Removed' });
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId')
      return res.status(404).json({ msg: 'Post Not Found' });
    res.status(500).send('Server Error');
  }
});

// @Route   PUT api/posts/likes/:id
// @desc    Like a Post
// @access  Private
router.put('/likes/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //Check post if the post has already been liked

    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: 'Post Already Liked' });
    }

    post.likes.unshift({ user: req.user.id });

    await post.save();
    res.json(post.likes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @Route   PUT api/posts/unlikes/:id
// @desc    Unlike a Post
// @access  Private
router.put('/unlikes/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //Check post if the post has already been liked
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: 'Post has not yet been Liked' });
    }

    //Get Index Remove
    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);

    post.likes.splice(removeIndex, 1);

    await post.save();
    res.json(post.likes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @Route   POST api/posts/comments/:id
// @desc    Comment to a post
// @access  Private
router.post(
  '/comments/:id',
  [auth, [check('text', 'Text is required').notEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ erros: errors.array() });

    try {
      const user = await User.findById(req.user.id).select(-'password');
      const post = await Post.findById(req.params.id);
      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      };

      post.comments.unshift(newComment);

      await post.save();
      res.json(post.comments);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
);

// @Route   DELETE api/posts/comments/:id/:comment_id
// @desc    DELETE Comment
// @access  Private
router.delete('/comments/:id/:comment_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //Pull out comment
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );

    // Checking Comment exist
    if (!comment) {
      return res.status(404).json({ msg: "Comment does'nt exist" });
    }

    //Checking User
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    //Index Remove
    const removeIndex = post.comments
      .map((comments) => comments.user.toString())
      .indexOf(req.user.id);

    post.comments.splice(removeIndex, 1);

    await post.save();
    res.json(post.comments);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
