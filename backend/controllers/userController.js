const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const Post = require('../models/postModel');
const Comment = require('../models/commentModel');

exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json({
      message: "User created successfully",
      user: userResponse,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 10;

    const users = await User.find();
    res.status(200).json({
      message: "Users list",
      totalUsers: users.length,
      totalPages: Math.ceil(users.length / pageSize),
      currentPage: page,
      users: users,
    });
    // res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({
      message: "User updated successfully",
      user: user,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Find and delete all posts by the user
    const userPosts = await Post.find({ user: userId });
    const postIds = userPosts.map(post => post._id);

    // Delete comments related to those posts
    await Comment.deleteMany({ post: { $in: postIds } });

    // Delete all posts by the user
    await Post.deleteMany({ user: userId });

    // Finally, delete the user
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
