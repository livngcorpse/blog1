const Report = require('../models/Report');

/**
 * Create a new report
 * POST /api/reports
 */
exports.createReport = async (req, res) => {
  try {
    const { reportType, reportedItemId, reason, description } = req.body;

    // Validation
    if (!reportType || !reportedItemId || !reason) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user already reported this item
    const existingReport = await Report.findOne({
      reportedBy: req.user.id,
      reportedItemId,
      reportType,
    });

    if (existingReport) {
      return res.status(400).json({ error: 'You have already reported this content' });
    }

    const report = new Report({
      reportedBy: req.user.id,
      reportType,
      reportedItemId,
      reason,
      description: description || '',
    });

    await report.save();

    res.status(201).json({
      message: 'Report submitted successfully',
      report,
    });
  } catch (error) {
    console.error('Create report error:', error);
    res.status(500).json({ error: 'Failed to submit report' });
  }
};

/**
 * Get all reports (admin only - for future use)
 * GET /api/reports
 */
exports.getReports = async (req, res) => {
  try {
    const { status, reportType, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const query = {};
    if (status) query.status = status;
    if (reportType) query.reportType = reportType;

    const total = await Report.countDocuments(query);
    
    const reports = await Report.find(query)
      .populate('reportedBy', 'username displayName')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      reports,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ error: 'Failed to get reports' });
  }
};

/**
 * Get user's own reports
 * GET /api/reports/my-reports
 */
exports.getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({ reportedBy: req.user.id })
      .sort('-createdAt')
      .limit(50);

    res.json(reports);
  } catch (error) {
    console.error('Get my reports error:', error);
    res.status(500).json({ error: 'Failed to get your reports' });
  }
};

/**
 * Update report status (admin only)
 * PUT /api/reports/:id
 */
exports.updateReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNote } = req.body;

    if (!status || !['pending', 'reviewed', 'resolved', 'dismissed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const report = await Report.findById(id);

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    report.status = status;
    report.reviewedBy = req.user.id;
    report.reviewedAt = new Date();
    if (adminNote) {
      report.adminNote = adminNote;
    }

    await report.save();
    await report.populate('reportedBy', 'username displayName');
    await report.populate('reviewedBy', 'username displayName');

    res.json({
      message: 'Report status updated',
      report,
    });
  } catch (error) {
    console.error('Update report status error:', error);
    res.status(500).json({ error: 'Failed to update report' });
  }
};

/**
 * Delete report (admin only)
 * DELETE /api/reports/:id
 */
exports.deleteReport = async (req, res) => {
  try {
    const { id } = req.params;

    const report = await Report.findByIdAndDelete(id);

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    console.error('Delete report error:', error);
    res.status(500).json({ error: 'Failed to delete report' });
  }
};
