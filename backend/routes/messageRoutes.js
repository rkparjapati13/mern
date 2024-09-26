const express = require('express');
const { createMessage, getMessages } = require('../controllers/messageController');
const auth = require('../middleware/auth');
const router = express.Router();

// Signup Route
router.get('/:id', auth, getMessages);
router.post('/', auth, createMessage);

module.exports = router;
