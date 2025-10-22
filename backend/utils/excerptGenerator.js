/**
 * Generate an excerpt from HTML/text content
 * @param {string} content - The full content
 * @param {number} maxLength - Maximum length of excerpt
 * @returns {string} - Generated excerpt
 */
const generateExcerpt = (content, maxLength = 200) => {
  if (!content) return '';
  
  // Remove HTML tags
  const plainText = content.replace(/<[^>]*>/g, '');
  
  // Remove extra whitespace
  const cleaned = plainText.replace(/\s+/g, ' ').trim();
  
  if (cleaned.length <= maxLength) {
    return cleaned;
  }
  
  // Truncate to maxLength and add ellipsis
  const truncated = cleaned.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return truncated.substring(0, lastSpace) + '...';
};

module.exports = generateExcerpt;
