const express = require('express');
const { createPost, getPosts, updatePost, deletePost } = require('../controllers/postController');

const router = express.Router();

router.post('/', createPost);
router.get('/', getPosts);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);

module.exports = router;
