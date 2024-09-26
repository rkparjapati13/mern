require('dotenv-flow').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel'); // Path to your user model
const connectDB = require('../config/db');
// MongoDB connection
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create a super admin user
const createSuperAdmin = async () => {
  try {
    // Check if the super admin user already exists
    const existingSuperAdmin = await User.findOne({ email: 'superadmin@gmail.com' });
    if (existingSuperAdmin) {
      console.log('Super admin already exists!');
      return;
    }

    // Create a new super admin user
    const superAdmin = new User({
      name: 'Super Admin',
      email: 'superadmin@gmail.com',
      password: '1234567890',
      role: 'SuperAdmin', // Set the role to superadmin
    });

    // Save the user to the database
    await superAdmin.save();
    console.log('Super admin created successfully!');
  } catch (error) {
    console.error('Error creating super admin:', error);
  } finally {
    mongoose.connection.close(); // Close the connection
  }
};

// Run the seeder
createSuperAdmin();
