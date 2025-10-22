import React from 'react';
import './SocialShare.css';

const SocialShare = ({ url, title, description }) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description || title);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
  };

  const handleShare = (platform) => {
    window.open(shareLinks[platform], '_blank', 'width=600,height=400');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  return (
    <div className="social-share">
      <h4>Share this post</h4>
      <div className="share-buttons">
        <button
          onClick={() => handleShare('twitter')}
          className="share-btn twitter"
          title="Share on Twitter"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
          </svg>
          Twitter
        </button>

        <button
          onClick={() => handleShare('facebook')}
          className="share-btn facebook"
          title="Share on Facebook"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
          </svg>
          Facebook
        </button>

        <button
          onClick={() => handleShare('linkedin')}
          className="share-btn linkedin"
          title="Share on LinkedIn"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
            <circle cx="4" cy="4" r="2"/>
          </svg>
          LinkedIn
        </button>

        <button
          onClick={() => handleShare('reddit')}
          className="share-btn reddit"
          title="Share on Reddit"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="9" cy="13.5" r="1.5"/>
            <circle cx="15" cy="13.5" r="1.5"/>
            <path d="M20 12c0-1.1-.9-2-2-2-.6 0-1.1.2-1.5.6-1.5-1-3.4-1.6-5.5-1.7l1-4.6 3.2.7c0 .9.7 1.6 1.6 1.6.9 0 1.6-.7 1.6-1.6s-.7-1.6-1.6-1.6c-.6 0-1.2.4-1.5.9l-3.6-.8c-.2 0-.4.2-.5.4l-1.1 5.1c-2.1.1-4 .7-5.5 1.7-.4-.4-.9-.6-1.5-.6-1.1 0-2 .9-2 2 0 .8.5 1.5 1.2 1.8-.1.3-.1.6-.1.9 0 3.3 3.8 6 8.5 6s8.5-2.7 8.5-6c0-.3 0-.6-.1-.9.7-.3 1.2-1 1.2-1.8z"/>
          </svg>
          Reddit
        </button>

        <button
          onClick={handleCopyLink}
          className="share-btn copy-link"
          title="Copy link"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
          </svg>
          Copy Link
        </button>
      </div>
    </div>
  );
};

export default SocialShare;
