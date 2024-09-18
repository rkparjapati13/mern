const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const axios = require('axios');


exports.login = async (req, res) => {
  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: existingUser._id }, jwtSecret, {
      expiresIn: '1h',
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        username: existingUser.username,
        email: existingUser.email,
      },
      token: token
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ error: "An error occurred during login" });
  }
};
