const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reportType: {
    type: String,
    enum: ['post', 'reply', 'user'],
    required: true,
  },
  reportedItemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  reason: {
    type: String,
    enum: ['spam', 'harassment', 'hate-speech', 'inappropriate', 'misinformation', 'other'],
    required: true,
  },
  description: {
    type: String,
    maxlength: 500,
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'resolved', 'dismissed'],
    default: 'pending',
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  reviewedAt: {
    type: Date,
  },
  adminNote: {
    type: String,
    maxlength: 500,
  },
}, {
  timestamps: true,
});

// Indexes
reportSchema.index({ reportedBy: 1 });
reportSchema.index({ reportedItemId: 1 });
reportSchema.index({ status: 1 });

module.exports = mongoose.model('Report', reportSchema);
