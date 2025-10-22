const express = require('express');
const router = express.Router();
const replyController = require('../controllers/replyController');
const { authMiddleware, optionalAuth } = require('../middlewares/authMiddleware');

// Optional auth (for hasLiked flag)
router.get('/post/:postId', optionalAuth, replyController.getRepliesByPost);

// Protected routes
router.post('/', authMiddleware, replyController.createReply);
router.post('/:id/like', authMiddleware, replyController.toggleReplyLike);
router.delete('/:id', authMiddleware, replyController.deleteReply);

module.exports = router;
