const User = require('../models/userModel');
const Post = require('../models/postModel');
const Comment = require('../models/commentModel');

exports.createUser = async (req, res) => {
  const { name, email, role } = req.body;

  // Ensure admins cannot create super admins
  if (req.user.role === 'Admin' && role === 'SuperAdmin') {
    return res.status(403).json({ message: "Admins can't create Super Admins" });
  }
  if (req.user.role === 'Admin' && role === 'Admin') {
    return res.status(403).json({ message: "Admins can't create Admins" });
  }

  try {
    const newUser = new User({ name, email, role });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully', newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    // const users = await User.find();
    const { role } = req.user; // Assuming req.user contains the authenticated user's details

    let users;
    if (role === 'SuperAdmin') {
      // Super admin can see all users
      users = await User.find({ role: { $ne: 'SuperAdmin' } }); // Exclude superadmin
    } else if (role === 'Admin') {
      // Admin can see only regular users
      users = await User.find({ role: { $eq: 'User' } }); // Exclude superadmin
    } else {
      return res.status(403).json({ message: 'Access denied' }); // If the user is neither
    }
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const id = req.user?.id;
    const users = await User.find({ _id: { $ne: id } }); // Exclude superadmin
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(user);
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
    res.status(204).json({ message: 'User deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
