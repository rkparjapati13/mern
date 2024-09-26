const Comment = require('../models/commentModel');

exports.createComment = async (req, res) => {
  try {
    let user = req.user?.id;
    if (!user) {
      res.status(400).json({ error: 'User not found' });
    }
    const { post, text } = req.body;
    const comment = new Comment({post, text, user});
    await comment.save();
    const populatedComment = await Comment.findById(comment._id)
      .populate('user')
      .populate('post');
    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find().populate('user').populate('post').sort({ createdAt: -1 });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCommentsOfPost = async (req, res) => {
    try {
      // Extract post ID from query parameters
      const postId = req.params.id;
      // Validate postId
      if (!postId) {
        return res.status(400).json({ error: 'Post ID is required' });
      }
  
      // Find comments associated with the specified post ID
      const comments = await Comment.find({ post: postId }).populate('user').populate('post').sort({ createdAt: -1 });
  
      // Respond with the list of comments
      res.status(200).json(comments);
    } catch (error) {
      // Handle any errors
      res.status(500).json({ error: error.message });
    }
  };

exports.updateComment = async (req, res) => {
  try {
    const comment = await Comment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(comment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.status(204).json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
