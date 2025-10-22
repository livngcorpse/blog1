const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/adminMiddleware');

// All routes require authentication
router.post('/', authMiddleware, reportController.createReport);
router.get('/my-reports', authMiddleware, reportController.getMyReports);

// Admin only routes
router.get('/', authMiddleware, isAdmin, reportController.getReports);
router.put('/:id', authMiddleware, isAdmin, reportController.updateReportStatus);
router.delete('/:id', authMiddleware, isAdmin, reportController.deleteReport);

module.exports = router;
