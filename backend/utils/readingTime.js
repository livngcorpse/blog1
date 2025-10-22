/**
 * Calculate reading time for content
 * @param {string} content - The content to analyze
 * @returns {number} - Estimated reading time in minutes
 */
const calculateReadingTime = (content) => {
  if (!content) return 1;
  
  // Remove HTML tags
  const plainText = content.replace(/<[^>]*>/g, '');
  
  // Count words
  const words = plainText.trim().split(/\s+/).length;
  
  // Average reading speed: 200 words per minute
  const minutes = Math.ceil(words / 200);
  
  return Math.max(1, minutes);
};

module.exports = calculateReadingTime;
