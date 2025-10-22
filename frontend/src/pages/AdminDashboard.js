import React, { useState, useEffect } from 'react';
import { reportAPI } from '../services/api';
import toast from 'react-hot-toast';
import './AdminDashboard.css';

const AdminDashboard = ({ currentUser }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [selectedReport, setSelectedReport] = useState(null);
  const [adminNote, setAdminNote] = useState('');

  useEffect(() => {
    if (!currentUser?.isAdmin) {
      return;
    }
    fetchReports();
  }, [filter, currentUser]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await reportAPI.getAllReports({ status: filter });
      setReports(response.data.reports);
    } catch (error) {
      toast.error('Failed to load reports');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (reportId, newStatus) => {
    try {
      await reportAPI.updateReportStatus(reportId, {
        status: newStatus,
        adminNote: adminNote.trim() || undefined,
      });
      toast.success('Report status updated');
      setAdminNote('');
      setSelectedReport(null);
      fetchReports();
    } catch (error) {
      toast.error('Failed to update report');
    }
  };

  const handleDeleteReport = async (reportId) => {
    if (!window.confirm('Delete this report permanently?')) return;

    try {
      await reportAPI.deleteReport(reportId);
      toast.success('Report deleted');
      fetchReports();
    } catch (error) {
      toast.error('Failed to delete report');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f59e0b',
      reviewed: '#3b82f6',
      resolved: '#10b981',
      dismissed: '#6b7280',
    };
    return colors[status] || '#6b7280';
  };

  if (!currentUser?.isAdmin) {
    return (
      <div className="admin-dashboard">
        <div className="no-access">
          <h2>⛔ Access Denied</h2>
          <p>You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>🛡️ Admin Dashboard</h1>
        <p className="admin-subtitle">Report Management</p>
      </header>

      <div className="filter-tabs">
        {['pending', 'reviewed', 'resolved', 'dismissed'].map((status) => (
          <button
            key={status}
            className={`filter-tab ${filter === status ? 'active' : ''}`}
            onClick={() => setFilter(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading reports...</p>
        </div>
      ) : reports.length === 0 ? (
        <div className="no-reports">
          <p>No {filter} reports found.</p>
        </div>
      ) : (
        <div className="reports-grid">
          {reports.map((report) => (
            <div key={report._id} className="report-card">
              <div className="report-header">
                <span
                  className="report-status"
                  style={{ backgroundColor: getStatusColor(report.status) }}
                >
                  {report.status}
                </span>
                <span className="report-type">{report.reportType}</span>
              </div>

              <div className="report-body">
                <div className="report-field">
                  <strong>Reason:</strong> {report.reason}
                </div>
                {report.description && (
                  <div className="report-field">
                    <strong>Description:</strong>
                    <p>{report.description}</p>
                  </div>
                )}
                <div className="report-field">
                  <strong>Reported by:</strong> @{report.reportedBy?.username}
                </div>
                <div className="report-field">
                  <strong>Reported at:</strong> {formatDate(report.createdAt)}
                </div>
                {report.reviewedBy && (
                  <>
                    <div className="report-field">
                      <strong>Reviewed by:</strong> @{report.reviewedBy.username}
                    </div>
                    <div className="report-field">
                      <strong>Reviewed at:</strong> {formatDate(report.reviewedAt)}
                    </div>
                  </>
                )}
                {report.adminNote && (
                  <div className="report-field admin-note">
                    <strong>Admin Note:</strong>
                    <p>{report.adminNote}</p>
                  </div>
                )}
              </div>

              <div className="report-actions">
                {selectedReport === report._id ? (
                  <div className="action-form">
                    <textarea
                      placeholder="Add admin note (optional)"
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      rows="2"
                    />
                    <div className="action-buttons">
                      {report.status !== 'reviewed' && (
                        <button
                          onClick={() => handleUpdateStatus(report._id, 'reviewed')}
                          className="btn-action btn-reviewed"
                        >
                          Mark Reviewed
                        </button>
                      )}
                      {report.status !== 'resolved' && (
                        <button
                          onClick={() => handleUpdateStatus(report._id, 'resolved')}
                          className="btn-action btn-resolved"
                        >
                          Mark Resolved
                        </button>
                      )}
                      {report.status !== 'dismissed' && (
                        <button
                          onClick={() => handleUpdateStatus(report._id, 'dismissed')}
                          className="btn-action btn-dismissed"
                        >
                          Dismiss
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setSelectedReport(null);
                          setAdminNote('');
                        }}
                        className="btn-action btn-cancel"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="action-buttons">
                    <button
                      onClick={() => setSelectedReport(report._id)}
                      className="btn-action btn-update"
                    >
                      Update Status
                    </button>
                    <button
                      onClick={() => handleDeleteReport(report._id)}
                      className="btn-action btn-delete"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
