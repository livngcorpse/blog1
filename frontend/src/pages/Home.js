import React, { useState, useEffect, useCallback } from 'react';
import { postAPI } from '../services/api';
import PostCard from '../components/PostCard';
import TrendingTags from '../components/TrendingTags';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import toast from 'react-hot-toast';
import './Home.css';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState('recent');
  const LIMIT = 10;

  // Fetch initial posts
  useEffect(() => {
    fetchInitialPosts();
  }, [filter]);

  const fetchInitialPosts = async () => {
    setLoading(true);
    setPosts([]);
    setCurrentPage(1);
    setHasMore(true);

    try {
      const params = {
        page: 1,
        limit: LIMIT,
        sort: filter === 'popular' ? '-likesCount' : '-createdAt',
      };
      
      const response = await postAPI.getPosts(params);
      setPosts(response.data.posts);
      setHasMore(response.data.pagination.page < response.data.pagination.pages);
    } catch (error) {
      toast.error('Failed to load posts');
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMorePosts = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    const nextPage = currentPage + 1;

    try {
      const params = {
        page: nextPage,
        limit: LIMIT,
        sort: filter === 'popular' ? '-likesCount' : '-createdAt',
      };
      
      const response = await postAPI.getPosts(params);
      setPosts((prevPosts) => [...prevPosts, ...response.data.posts]);
      setCurrentPage(nextPage);
      setHasMore(response.data.pagination.page < response.data.pagination.pages);
    } catch (error) {
      toast.error('Failed to load more posts');
      console.error('Error fetching more posts:', error);
    } finally {
      setLoadingMore(false);
    }
  }, [currentPage, hasMore, loadingMore, filter]);

  const { lastElementRef } = useInfiniteScroll(fetchMorePosts, hasMore, loadingMore);

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
              {posts.map((post, index) => {
                // Attach ref to the last element
                if (posts.length === index + 1) {
                  return (
                    <div key={post._id} ref={lastElementRef}>
                      <PostCard post={post} />
                    </div>
                  );
                }
                return <PostCard key={post._id} post={post} />;
              })}
            </div>

            {loadingMore && (
              <div className="loading-more">
                <div className="loading-spinner"></div>
                <p>Loading more posts...</p>
              </div>
            )}

            {!hasMore && posts.length > 0 && (
              <div className="end-of-posts">
                <p>🎉 You've reached the end!</p>
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
