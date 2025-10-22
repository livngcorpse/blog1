const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// All routes require authentication
router.post('/', authMiddleware, reportController.createReport);
router.get('/', authMiddleware, reportController.getReports);
router.get('/my-reports', authMiddleware, reportController.getMyReports);

module.exports = router;
