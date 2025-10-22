/**
 * Extract @mentions from text
 * @param {string} text - Text content to parse
 * @returns {Array<string>} - Array of unique mentioned usernames (lowercase)
 */
const extractMentions = (text) => {
  if (!text || typeof text !== 'string') return [];
  
  // Match @username pattern (letters, numbers, underscores, hyphens, 3-30 chars)
  const mentionRegex = /@([a-zA-Z0-9_-]{3,30})/g;
  const mentions = [];
  let match;
  
  while ((match = mentionRegex.exec(text)) !== null) {
    mentions.push(match[1].toLowerCase());
  }
  
  // Return unique mentions only
  return [...new Set(mentions)];
};

module.exports = extractMentions;
