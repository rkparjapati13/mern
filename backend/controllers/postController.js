const Post = require('../models/postModel');
const Comment = require('../models/commentModel');

exports.createPost = async (req, res) => {
  try {
    let user = req.user?.id;
    if (!user) {
      res.status(400).json({ error: 'User not foynd' });
    }
    const { content } = req.body;
    const post = new Post({user, content});
    await post.save();
    const populatedPost = await Post.findById(post._id)
      .populate('user');
    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('user').sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// exports.updatePost = async (req, res) => {
//   try {
//     const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     res.status(200).json(post);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// exports.deletePost = async (req, res) => {
//   try {
//     const postId = req.params.id;

//     await Comment.deleteMany({ post: postId });
//     // Delete the post
//     await Post.findByIdAndDelete(postId);
//     res.status(204).json({ message: 'Post deleted' });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };
