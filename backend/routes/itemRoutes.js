const express = require('express');
const {
  createItem,
  getItems,
  getMyItems,
  getItem,
  deleteItem,
  resolveItem,
  getManageItems,
} = require('../controllers/itemController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', optionalAuth, getItems);
router.post('/', protect, createItem);
router.get('/my', protect, getMyItems); // must be before '/:id'
router.get('/manage/all', protect, allowRoles('Faculty', 'Owner'), getManageItems);
router.get('/:id', optionalAuth, getItem);
router.patch('/:id/resolve', protect, resolveItem);
router.delete('/:id', protect, deleteItem);

module.exports = router;
