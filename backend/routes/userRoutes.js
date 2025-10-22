const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Public routes
router.get('/search', userController.searchUsers);
router.get('/:username', userController.getUserProfile);
router.get('/:username/stats', userController.getUserStats);

// Auth required routes (use custom verification in controller)
router.post('/current', userController.getCurrentUser);
router.post('/profile', userController.createOrUpdateProfile);
router.post('/theme-preferences', userController.updateThemePreferences);

module.exports = router;
