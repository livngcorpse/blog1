import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import UserAvatar from './UserAvatar';
import ReplyForm from './ReplyForm';
import MentionText from './MentionText';
import './ReplyThread.css';

const ReplyThread = ({ reply, currentUser, onReply, onLike, onDelete, level = 0 }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const formatDate = (date) => {
    const now = new Date();
    const replyDate = new Date(date);
    const diffMs = now - replyDate;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffMin < 1) return 'just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    if (diffDay < 7) return `${diffDay}d ago`;
    
    return replyDate.toLocaleDateString();
  };

  const handleReplySubmit = async (content) => {
    await onReply(content, reply._id);
    setShowReplyForm(false);
  };

  const handleLike = async () => {
    await onLike(reply._id);
  };

  const handleDelete = async () => {
    if (window.confirm('Delete this reply and all its responses?')) {
      await onDelete(reply._id);
    }
  };

  const hasChildren = reply.children && reply.children.length > 0;

  return (
    <motion.div
      className={`reply-thread level-${Math.min(level, 5)}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <div className="reply-container">
        <div className="reply-header">
          <UserAvatar user={reply.authorId} size={36} />
          <div className="reply-author-info">
            <span className="reply-author-name">{reply.authorId?.displayName}</span>
            <span className="reply-username">@{reply.authorId?.username}</span>
            <span className="reply-date">{formatDate(reply.createdAt)}</span>
          </div>
        </div>

        <div className="reply-content">
          <MentionText text={reply.content} />
        </div>

        <div className="reply-actions">
          <button
            className={`action-btn ${reply.hasLiked ? 'liked' : ''}`}
            onClick={handleLike}
            disabled={!currentUser}
          >
            <span className="icon">{reply.hasLiked ? '❤️' : '🤍'}</span>
            {reply.likesCount > 0 && <span>{reply.likesCount}</span>}
          </button>

          <button
            className="action-btn"
            onClick={() => setShowReplyForm(!showReplyForm)}
            disabled={!currentUser}
          >
            <span className="icon">💬</span>
            Reply
          </button>

          {currentUser && currentUser.id === reply.authorId?._id && (
            <button className="action-btn delete-btn" onClick={handleDelete}>
              <span className="icon">🗑️</span>
              Delete
            </button>
          )}

          {hasChildren && (
            <button
              className="action-btn collapse-btn"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <span className="icon">{isExpanded ? '▼' : '▶'}</span>
              {isExpanded ? 'Collapse' : `Expand (${reply.children.length})`}
            </button>
          )}
        </div>

        <AnimatePresence>
          {showReplyForm && currentUser && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <ReplyForm
                onSubmit={handleReplySubmit}
                placeholder={`Reply to @${reply.authorId?.username}...`}
                parentAuthor={reply.authorId?.username}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Recursive rendering of nested replies */}
      <AnimatePresence>
        {isExpanded && hasChildren && (
          <motion.div
            className="reply-children"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {reply.children.map((childReply) => (
              <ReplyThread
                key={childReply._id}
                reply={childReply}
                currentUser={currentUser}
                onReply={onReply}
                onLike={onLike}
                onDelete={onDelete}
                level={level + 1}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ReplyThread;
