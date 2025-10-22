import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postAPI } from '../services/api';
import './RelatedPosts.css';

const RelatedPosts = ({ postId }) => {
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedPosts = async () => {
      try {
        const response = await postAPI.getRelatedPosts(postId);
        setRelatedPosts(response.data);
      } catch (error) {
        console.error('Failed to fetch related posts:', error);
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchRelatedPosts();
    }
  }, [postId]);

  if (loading) {
    return (
      <div className="related-posts-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <div className="related-posts">
      <h3 className="related-posts-title">Related Posts</h3>
      <div className="related-posts-grid">
        {relatedPosts.map((post) => (
          <Link
            key={post._id}
            to={`/post/${post._id}`}
            className="related-post-card"
          >
            <h4 className="related-post-title">{post.title}</h4>
            <p className="related-post-excerpt">{post.excerpt}</p>
            <div className="related-post-meta">
              <span className="related-post-author">
                @{post.authorId?.username}
              </span>
              <span className="related-post-stats">
                ❤️ {post.likesCount} · 💬 {post.repliesCount}
              </span>
            </div>
            {post.tags && post.tags.length > 0 && (
              <div className="related-post-tags">
                {post.tags.slice(0, 3).map((tag, index) => (
                  <span key={index} className="related-post-tag">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedPosts;
