import React, { useState } from 'react';
import toast from 'react-hot-toast';
import './ReplyForm.css';

const ReplyForm = ({ onSubmit, placeholder = 'Write a reply...', parentAuthor = null }) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast.error('Reply cannot be empty');
      return;
    }

    if (content.length > 2000) {
      toast.error('Reply must be less than 2000 characters');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(content);
      setContent('');
      toast.success('Reply posted!');
    } catch (error) {
      toast.error(error.message || 'Failed to post reply');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="reply-form" onSubmit={handleSubmit}>
      {parentAuthor && (
        <div className="replying-to">
          Replying to <strong>@{parentAuthor}</strong>
        </div>
      )}
      <textarea
        className="reply-textarea"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        rows="3"
        maxLength="2000"
      />
      <div className="reply-form-footer">
        <span className="char-count">
          {content.length} / 2000
        </span>
        <button 
          type="submit" 
          className="reply-submit-btn"
          disabled={isSubmitting || !content.trim()}
        >
          {isSubmitting ? 'Posting...' : 'Post Reply'}
        </button>
      </div>
    </form>
  );
};

export default ReplyForm;
