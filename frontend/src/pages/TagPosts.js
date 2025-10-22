import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { postAPI } from '../services/api';
import PostCard from '../components/PostCard';
import toast from 'react-hot-toast';
import './TagPosts.css';

const TagPosts = () => {
  const { tag } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });

  useEffect(() => {
    fetchPosts();
  }, [tag, pagination.page]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await postAPI.getPostsByTag(tag, {
        page: pagination.page,
        limit: pagination.limit,
      });
      
      setPosts(response.data.posts);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error('Failed to load posts');
      console.error('Error fetching posts by tag:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="tag-posts-container">
      <div className="tag-header">
        <h1>#{tag}</h1>
        <p>{pagination.total} post{pagination.total !== 1 ? 's' : ''}</p>
      </div>

      {loading ? (
        <div className="loading">Loading posts...</div>
      ) : posts.length === 0 ? (
        <div className="empty-state">
          <h2>No posts found</h2>
          <p>No posts have been tagged with #{tag} yet</p>
        </div>
      ) : (
        <>
          <div className="posts-list">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
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

export default TagPosts;
