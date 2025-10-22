import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { postAPI, replyAPI, reportAPI, bookmarkAPI } from '../services/api';
import UserAvatar from '../components/UserAvatar';
import ReplyForm from '../components/ReplyForm';
import ReplyThread from '../components/ReplyThread';
import SocialShare from '../components/SocialShare';
import ReportModal from '../components/ReportModal';
import toast from 'react-hot-toast';
import './SinglePost.css';

const SinglePost = ({ currentUser }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [repliesLoading, setRepliesLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    fetchPost();
    fetchReplies();
    if (currentUser) {
      checkBookmarkStatus();
    }
  }, [id, currentUser]);

  const fetchPost = async () => {
    try {
      const response = await postAPI.getPostById(id);
      setPost(response.data);
    } catch (error) {
      toast.error('Failed to load post');
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReplies = async () => {
    try {
      const response = await replyAPI.getRepliesByPost(id);
      setReplies(response.data.replies);
    } catch (error) {
      console.error('Error fetching replies:', error);
    } finally {
      setRepliesLoading(false);
    }
  };

  const handleLike = async () => {
    if (!currentUser) {
      toast.error('Please login to like posts');
      return;
    }

    try {
      const response = await postAPI.toggleLike(id);
      setPost({
        ...post,
        hasLiked: response.data.liked,
        likesCount: response.data.likesCount,
      });
    } catch (error) {
      toast.error('Failed to like post');
    }
  };

  const handleCreateReply = async (content, parentReplyId = null) => {
    if (!currentUser) {
      toast.error('Please login to reply');
      return;
    }

    try {
      await replyAPI.createReply({
        postId: id,
        parentReplyId,
        content,
      });
      
      // Refresh replies
      await fetchReplies();
      
      // Update post reply count
      setPost({
        ...post,
        repliesCount: post.repliesCount + 1,
      });
    } catch (error) {
      throw error;
    }
  };

  const handleReplyLike = async (replyId) => {
    if (!currentUser) {
      toast.error('Please login to like replies');
      return;
    }

    try {
      await replyAPI.toggleReplyLike(replyId);
      await fetchReplies();
    } catch (error) {
      toast.error('Failed to like reply');
    }
  };

  const handleDeleteReply = async (replyId) => {
    try {
      const response = await replyAPI.deleteReply(replyId);
      toast.success(`Deleted ${response.data.deleted} reply(ies)`);
      
      // Refresh replies
      await fetchReplies();
      
      // Update post reply count
      setPost({
        ...post,
        repliesCount: Math.max(0, post.repliesCount - response.data.deleted),
      });
    } catch (error) {
      toast.error('Failed to delete reply');
    }
  };

  const handleDeletePost = async () => {
    if (window.confirm('Delete this post and all its replies?')) {
      try {
        await postAPI.deletePost(id);
        toast.success('Post deleted successfully');
        navigate('/');
      } catch (error) {
        toast.error('Failed to delete post');
      }
    }
  };

  const checkBookmarkStatus = async () => {
    try {
      const response = await bookmarkAPI.checkBookmark(id);
      setIsBookmarked(response.data.bookmarked);
    } catch (error) {
      console.error('Failed to check bookmark status:', error);
    }
  };

  const handleToggleBookmark = async () => {
    if (!currentUser) {
      toast.error('Please login to bookmark posts');
      return;
    }

    try {
      const response = await bookmarkAPI.toggleBookmark(id);
      setIsBookmarked(response.data.bookmarked);
      toast.success(response.data.message);
    } catch (error) {
      toast.error('Failed to toggle bookmark');
    }
  };

  const handleReport = async (reportData) => {
    await reportAPI.createReport(reportData);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  if (!post) {
    return (
      <div className="error-container">
        <h2>Post not found</h2>
        <Link to="/">Go back to home</Link>
      </div>
    );
  }

  const isAuthor = currentUser && currentUser.id === post.authorId?._id;

  return (
    <div className="single-post-container">
      <article className="post-content">
        <h1 className="post-title">{post.title}</h1>
        
        <div className="post-meta">
          <div className="author-section">
            <UserAvatar user={post.authorId} size={50} />
            <div className="author-details">
              <Link to={`/user/${post.authorId?.username}`} className="author-name">
                {post.authorId?.displayName}
              </Link>
              <div className="post-info">
                <span>{formatDate(post.createdAt)}</span>
                <span>•</span>
                <span>{post.readingTime} min read</span>
                <span>•</span>
                <span>{post.viewsCount} views</span>
              </div>
            </div>
          </div>

          {isAuthor && (
            <div className="author-actions">
              <Link to={`/edit-post/${post._id}`} className="edit-btn">
                Edit
              </Link>
              <button onClick={handleDeletePost} className="delete-btn">
                Delete
              </button>
            </div>
          )}
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="post-tags">
            {post.tags.map((tag, index) => (
              <Link key={index} to={`/tag/${tag}`} className="tag">
                #{tag}
              </Link>
            ))}
          </div>
        )}

        <div 
          className="post-body"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="post-engagement">
          <button
            className={`like-btn ${post.hasLiked ? 'liked' : ''}`}
            onClick={handleLike}
            disabled={!currentUser}
          >
            <span className="icon">{post.hasLiked ? '❤️' : '🤍'}</span>
            <span>{post.likesCount} Likes</span>
          </button>

          <button
            className={`bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
            onClick={handleToggleBookmark}
            disabled={!currentUser}
            title={isBookmarked ? 'Remove bookmark' : 'Bookmark this post'}
          >
            <span className="icon">{isBookmarked ? '🔖' : '📑'}</span>
            <span>{isBookmarked ? 'Saved' : 'Save'}</span>
          </button>

          {!isAuthor && currentUser && (
            <button
              className="report-btn"
              onClick={() => setShowReportModal(true)}
              title="Report this post"
            >
              <span className="icon">⚠️</span>
              <span>Report</span>
            </button>
          )}
          
          <div className="engagement-stats">
            <span>💬 {post.repliesCount} Replies</span>
          </div>
        </div>

        <SocialShare
          url={window.location.href}
          title={post.title}
          description={post.excerpt}
        />
      </article>

      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        onSubmit={handleReport}
        itemType="post"
        itemId={id}
      />

      <section className="replies-section">
        <h2>Replies ({post.repliesCount})</h2>
        
        {currentUser ? (
          <ReplyForm
            onSubmit={(content) => handleCreateReply(content, null)}
            placeholder="Share your thoughts..."
          />
        ) : (
          <div className="login-prompt">
            <p>Please <Link to="/login">login</Link> to leave a reply</p>
          </div>
        )}

        {repliesLoading ? (
          <div className="loading">Loading replies...</div>
        ) : replies.length === 0 ? (
          <div className="no-replies">
            <p>No replies yet. Be the first to reply!</p>
          </div>
        ) : (
          <div className="replies-list">
            {replies.map((reply) => (
              <ReplyThread
                key={reply._id}
                reply={reply}
                currentUser={currentUser}
                onReply={handleCreateReply}
                onLike={handleReplyLike}
                onDelete={handleDeleteReply}
                level={0}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default SinglePost;
