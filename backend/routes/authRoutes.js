const express = require('express');
const { register, login, me, getUsers, deleteUser } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, me);
router.get('/manage/users', protect, allowRoles('Owner'), getUsers);
router.delete('/manage/users/:id', protect, allowRoles('Owner'), deleteUser);

module.exports = router;
