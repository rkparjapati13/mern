const express = require('express');
const { createComment, getComments, getCommentsOfPost, updateComment, deleteComment } = require('../controllers/commentController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, createComment);
router.get('/', auth, getComments);
router.get('/post/:id', auth, getCommentsOfPost);
router.put('/:id', auth, updateComment);
router.delete('/:id', auth, deleteComment);

module.exports = router;
