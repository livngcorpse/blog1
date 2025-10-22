const express = require('express');
const router = express.Router();
const bookmarkController = require('../controllers/bookmarkController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// All routes require authentication
router.post('/:postId', authMiddleware, bookmarkController.toggleBookmark);
router.get('/', authMiddleware, bookmarkController.getBookmarks);
router.get('/check/:postId', authMiddleware, bookmarkController.checkBookmark);

module.exports = router;
