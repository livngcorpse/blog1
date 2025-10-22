import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import './ReportModal.css';

const ReportModal = ({ isOpen, onClose, onSubmit, itemType, itemId }) => {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const reasons = [
    { value: 'spam', label: 'Spam or misleading' },
    { value: 'harassment', label: 'Harassment or bullying' },
    { value: 'hate-speech', label: 'Hate speech' },
    { value: 'inappropriate', label: 'Inappropriate content' },
    { value: 'misinformation', label: 'Misinformation' },
    { value: 'other', label: 'Other' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!reason) {
      toast.error('Please select a reason');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        reportType: itemType,
        reportedItemId: itemId,
        reason,
        description,
      });
      toast.success('Report submitted successfully');
      onClose();
      setReason('');
      setDescription('');
    } catch (error) {
      toast.error(error.message || 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="report-modal"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="modal-header">
              <h2>Report {itemType}</h2>
              <button className="close-btn" onClick={onClose}>×</button>
            </div>

            <form onSubmit={handleSubmit} className="report-form">
              <div className="form-group">
                <label>Reason for reporting *</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                >
                  <option value="">Select a reason...</option>
                  {reasons.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Additional details (optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide more context about why you're reporting this..."
                  rows="4"
                  maxLength="500"
                />
                <small>{description.length} / 500 characters</small>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={onClose} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ReportModal;
