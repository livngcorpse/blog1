import React, { useState, useEffect } from 'react';
import { postAPI } from '../services/api';
import PostCard from '../components/PostCard';
import TrendingTags from '../components/TrendingTags';
import toast from 'react-hot-toast';
import './Home.css';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });
  const [filter, setFilter] = useState('recent');

  useEffect(() => {
    fetchPosts();
  }, [pagination.page, filter]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        sort: filter === 'popular' ? '-likesCount' : '-createdAt',
      };
      
      const response = await postAPI.getPosts(params);
      setPosts(response.data.posts);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error('Failed to load posts');
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="home-container">
      <div className="home-main">
        <div className="home-header">
          <h1>Latest Posts</h1>
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filter === 'recent' ? 'active' : ''}`}
              onClick={() => setFilter('recent')}
            >
              Recent
            </button>
            <button
              className={`filter-btn ${filter === 'popular' ? 'active' : ''}`}
              onClick={() => setFilter('popular')}
            >
              Popular
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="empty-state">
            <h2>No posts yet</h2>
            <p>Be the first to create a post!</p>
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

      <aside className="home-sidebar">
        <TrendingTags />
      </aside>
    </div>
  );
};

export default Home;
