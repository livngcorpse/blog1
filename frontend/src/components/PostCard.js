import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import UserAvatar from './UserAvatar';
import './PostCard.css';

const PostCard = ({ post, onLike }) => {
  const formatDate = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffMs = now - postDate;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffMin < 1) return 'just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    if (diffDay < 7) return `${diffDay}d ago`;
    
    return postDate.toLocaleDateString();
  };

  return (
    <motion.div
      className="post-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/post/${post._id}`} className="post-card-link">
        <h2 className="post-title">{post.title}</h2>
        <p className="post-excerpt">{post.excerpt}</p>
        
        <div className="post-meta">
          <div className="post-author">
            <UserAvatar user={post.authorId} size={32} />
            <div className="author-info">
              <span className="author-name">{post.authorId?.displayName}</span>
              <span className="post-date">{formatDate(post.createdAt)}</span>
            </div>
          </div>
          
          <div className="post-stats">
            <span className="stat-item">
              <i className="icon">❤️</i> {post.likesCount}
            </span>
            <span className="stat-item">
              <i className="icon">💬</i> {post.repliesCount}
            </span>
            <span className="stat-item">
              <i className="icon">👁️</i> {post.viewsCount}
            </span>
            <span className="stat-item">
              <i className="icon">📖</i> {post.readingTime} min
            </span>
          </div>
        </div>
        
        {post.tags && post.tags.length > 0 && (
          <div className="post-tags">
            {post.tags.map((tag, index) => (
              <span key={index} className="tag">#{tag}</span>
            ))}
          </div>
        )}
      </Link>
    </motion.div>
  );
};

export default PostCard;
