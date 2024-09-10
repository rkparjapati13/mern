const express = require('express');
const { createComment, getComments, getCommentsOfPost, updateComment, deleteComment } = require('../controllers/commentController');

const router = express.Router();

router.post('/', createComment);
router.get('/', getComments);
router.get('/post/:id', getCommentsOfPost);
router.put('/:id', updateComment);
router.delete('/:id', deleteComment);

module.exports = router;
