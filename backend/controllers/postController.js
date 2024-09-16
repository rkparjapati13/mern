const Post = require('../models/postModel');
const Comment = require('../models/commentModel');

exports.createPost = async (req, res) => {
  try {
    const post = new Post(req.body);
    await post.save();
    res.status(201).json({
      message: 'Post created successfully',
      post: post
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 10;
    const posts = await Post.find().populate('user');
    res.status(200).json({
      message: "Posts list",
      totalUsers: posts.length,
      totalPages: Math.ceil(posts.length / pageSize),
      currentPage: page,
      posts: posts,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({
      message: 'Post updated successfully',
      post: post
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.id;

    await Comment.deleteMany({ post: postId });
    // Delete the post
    await Post.findByIdAndDelete(postId);
    res.status(200).json({ message: 'Post deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
