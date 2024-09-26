const express = require('express');
const { createUser, getUsers, updateUser, deleteUser, getAllUsers } = require('../controllers/userController');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/role');

const router = express.Router();

router.post('/',auth, checkRole('Admin', 'SuperAdmin'), createUser);
router.get('/all',auth, checkRole('Admin', 'SuperAdmin', 'User'), getAllUsers);
router.get('/',auth, checkRole('Admin', 'SuperAdmin'), getUsers);
router.put('/:id',auth, checkRole('Admin', 'SuperAdmin'), updateUser);
router.delete('/:id',auth, checkRole('Admin', 'SuperAdmin'), deleteUser);

module.exports = router;
