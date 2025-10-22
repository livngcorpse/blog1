import React, { useState, useEffect } from 'react';
import { bookmarkAPI } from '../services/api';
import PostCard from '../components/PostCard';
import toast from 'react-hot-toast';
import './Bookmarks.css';

const Bookmarks = ({ currentUser }) => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });

  useEffect(() => {
    fetchBookmarks();
  }, [pagination.page]);

  const fetchBookmarks = async () => {
    setLoading(true);
    try {
      const response = await bookmarkAPI.getBookmarks({
        page: pagination.page,
        limit: pagination.limit,
      });
      
      setBookmarks(response.data.bookmarks);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error('Failed to load bookmarks');
      console.error('Error fetching bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bookmarks-container">
      <div className="bookmarks-header">
        <h1>📖 My Bookmarks</h1>
        <p>Posts you've saved for later</p>
      </div>

      {loading ? (
        <div className="loading">Loading bookmarks...</div>
      ) : bookmarks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔖</div>
          <h2>No bookmarks yet</h2>
          <p>Save posts to read later by clicking the bookmark icon</p>
        </div>
      ) : (
        <>
          <div className="bookmarks-list">
            {bookmarks.map((bookmark) => (
              bookmark.postId && (
                <PostCard key={bookmark._id} post={bookmark.postId} />
              )
            ))}
          </div>

          {pagination.pages > 1 && (
            <div className="pagination">
              <button
                className="page-btn"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                Previous
              </button>
              
              <span className="page-info">
                Page {pagination.page} of {pagination.pages}
              </span>
              
              <button
                className="page-btn"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Bookmarks;
