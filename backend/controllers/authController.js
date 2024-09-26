const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Sign up user
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    user = new User({ name, email, password });
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
    
    res.json({ 
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
exports.getUserDetail = async (req, res) => {
    try {
        // Find the user by ID (assuming `req.user.id` contains the user ID from the token)
        const user = await User.findById(req.user.id).select('_id name role'); // Select only the fields you need
    
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.json({
          message: 'User is valid',
          user: {
            id: user._id,
            name: user.name,
            role: user.role,
          },
        });
      } catch (error) {
        res.status(500).json({ message: 'Server error' });
      }
};

