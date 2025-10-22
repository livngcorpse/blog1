import React from 'react';
import { Link } from 'react-router-dom';
import { parseMentionsToLinks } from '../utils/mentionUtils';
import './MentionText.css';

const MentionText = ({ text }) => {
  const parts = parseMentionsToLinks(text);

  return (
    <span className="mention-text">
      {parts.map((part) => {
        if (part.type === 'mention') {
          return (
            <Link
              key={part.key}
              to={`/user/${part.username}`}
              className="mention-link"
              onClick={(e) => e.stopPropagation()}
            >
              {part.text}
            </Link>
          );
        }
        return <span key={part.key}>{part.text}</span>;
      })}
    </span>
  );
};

export default MentionText;
