const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { authMiddleware, optionalAuth } = require('../middlewares/authMiddleware');

// Public routes
router.get('/', postController.getPosts);
router.get('/trending-tags', postController.getTrendingTags);
router.get('/tag/:tag', postController.getPostsByTag);
router.get('/author/:username', postController.getPostsByAuthor);

// Optional auth (for hasLiked flag)
router.get('/:id', optionalAuth, postController.getPostById);
router.get('/:id/related', postController.getRelatedPosts);

// Protected routes
router.post('/', authMiddleware, postController.createPost);
router.post('/:id/like', authMiddleware, postController.toggleLike);
router.put('/:id', authMiddleware, postController.updatePost);
router.delete('/:id', authMiddleware, postController.deletePost);

module.exports = router;
