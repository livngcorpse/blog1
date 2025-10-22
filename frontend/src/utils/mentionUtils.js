/**
 * Parse text and extract @mentions
 * @param {string} text - Text content to parse
 * @returns {Array} - Array of mentioned usernames
 */
export const extractMentions = (text) => {
  if (!text) return [];
  
  // Match @username pattern (letters, numbers, underscores, hyphens)
  const mentionRegex = /@([a-zA-Z0-9_-]{3,30})/g;
  const mentions = [];
  let match;
  
  while ((match = mentionRegex.exec(text)) !== null) {
    mentions.push(match[1].toLowerCase());
  }
  
  // Return unique mentions
  return [...new Set(mentions)];
};

/**
 * Convert text with @mentions to React elements with links
 * @param {string} text - Text content to parse
 * @returns {Array} - Array of text and link elements
 */
export const parseMentionsToLinks = (text) => {
  if (!text) return [];
  
  const mentionRegex = /(@[a-zA-Z0-9_-]{3,30})/g;
  const parts = text.split(mentionRegex);
  
  return parts.map((part, index) => {
    if (part.startsWith('@')) {
      const username = part.substring(1);
      return {
        type: 'mention',
        username: username.toLowerCase(),
        text: part,
        key: `mention-${index}`,
      };
    }
    return {
      type: 'text',
      text: part,
      key: `text-${index}`,
    };
  });
};

/**
 * Highlight mentions in text (for preview)
 * @param {string} text - Text content
 * @returns {string} - HTML string with highlighted mentions
 */
export const highlightMentions = (text) => {
  if (!text) return '';
  
  const mentionRegex = /@([a-zA-Z0-9_-]{3,30})/g;
  return text.replace(
    mentionRegex,
    '<span class="mention-highlight">@$1</span>'
  );
};
