const express = require('express');
const { signup, login, getUserDetail } = require('../controllers/authController');
const auth = require('../middleware/auth');
const router = express.Router();

// Signup Route
router.post('/signup', signup);

// Login Route
router.post('/login', login);
router.get('/get-user',auth, getUserDetail);

// router.get('/get-user', auth, (req, res) => {
//     console.log('asfasd', req.user);
//     res.json({ message: 'User is valid', user: req.user });
// });

module.exports = router;
