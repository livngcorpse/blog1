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
