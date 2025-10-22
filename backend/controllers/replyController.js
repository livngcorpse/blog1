const Reply = require('../models/Reply');
const Post = require('../models/Post');
const extractMentions = require('../utils/extractMentions');

/**
 * Recursively build reply tree with nested children
 * @param {Array} replies - All replies for the post
 * @param {string|null} parentId - Parent reply ID
 * @returns {Array} - Array of replies with nested children
 */
const buildReplyTree = (replies, parentId = null) => {
  const children = replies.filter(reply => {
    const replyParentId = reply.parentReplyId ? reply.parentReplyId.toString() : null;
    return replyParentId === parentId;
  });
  
  return children.map(reply => {
    const replyObj = reply.toObject();
    replyObj.children = buildReplyTree(replies, reply._id.toString());
    return replyObj;
  });
};

/**
 * Get all nested replies for a post (recursive tree structure)
 * GET /api/replies/post/:postId
 */
exports.getRepliesByPost = async (req, res) => {
  try {
    const { postId } = req.params;
    
    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Get all replies for this post
    const replies = await Reply.find({ postId })
      .populate('authorId', 'username displayName profilePhoto')
      .sort('createdAt');
    
    // Build recursive tree structure
    const replyTree = buildReplyTree(replies, null);
    
    // Add hasLiked flag if user is authenticated
    const addHasLiked = (replyArray) => {
      return replyArray.map(reply => {
        let hasLiked = false;
        if (req.user) {
          hasLiked = reply.likes.some(id => id.toString() === req.user.id.toString());
        }
        
        return {
          ...reply,
          hasLiked,
          children: addHasLiked(reply.children || []),
        };
      });
    };
    
    const repliesWithLikes = addHasLiked(replyTree);
    
    res.json({
      replies: repliesWithLikes,
      total: replies.length,
    });
  } catch (error) {
    console.error('Get replies error:', error);
    res.status(500).json({ error: 'Failed to get replies' });
  }
};

/**
 * Create a new reply (can be top-level or nested)
 * POST /api/replies
 */
exports.createReply = async (req, res) => {
  try {
    const { postId, parentReplyId, content } = req.body;
    
    // Validation
    if (!postId) {
      return res.status(400).json({ error: 'Post ID is required' });
    }
    
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Content is required' });
    }
    
    if (content.length > 2000) {
      return res.status(400).json({ error: 'Content must be less than 2000 characters' });
    }
    
    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Check if parent reply exists (if specified)
    if (parentReplyId) {
      const parentReply = await Reply.findById(parentReplyId);
      if (!parentReply) {
        return res.status(404).json({ error: 'Parent reply not found' });
      }
      
      // Ensure parent reply belongs to the same post
      if (parentReply.postId.toString() !== postId) {
        return res.status(400).json({ error: 'Parent reply does not belong to this post' });
      }
    }
    
    // Create reply
    const mentions = extractMentions(content);
    
    const reply = new Reply({
      postId,
      parentReplyId: parentReplyId || null,
      authorId: req.user.id,
      content: content.trim(),
      mentions,
    });
    
    await reply.save();
    await reply.populate('authorId', 'username displayName profilePhoto');
    
    // Update post replies count
    post.repliesCount += 1;
    await post.save();
    
    res.status(201).json({
      message: 'Reply created successfully',
      reply: {
        ...reply.toObject(),
        hasLiked: false,
        children: [],
      },
    });
  } catch (error) {
    console.error('Create reply error:', error);
    res.status(500).json({ error: 'Failed to create reply' });
  }
};

/**
 * Toggle like on reply
 * POST /api/replies/:id/like
 */
exports.toggleReplyLike = async (req, res) => {
  try {
    const { id } = req.params;
    
    const reply = await Reply.findById(id);
    
    if (!reply) {
      return res.status(404).json({ error: 'Reply not found' });
    }
    
    const userId = req.user.id;
    const hasLiked = reply.likes.includes(userId);
    
    if (hasLiked) {
      // Unlike
      reply.likes = reply.likes.filter(id => id.toString() !== userId.toString());
      reply.likesCount = Math.max(0, reply.likesCount - 1);
    } else {
      // Like
      reply.likes.push(userId);
      reply.likesCount += 1;
    }
    
    await reply.save();
    
    res.json({
      liked: !hasLiked,
      likesCount: reply.likesCount,
    });
  } catch (error) {
    console.error('Toggle reply like error:', error);
    res.status(500).json({ error: 'Failed to toggle like' });
  }
};

/**
 * Recursively delete reply and all its descendants
 * DELETE /api/replies/:id
 */
exports.deleteReply = async (req, res) => {
  try {
    const { id } = req.params;
    
    const reply = await Reply.findById(id);
    
    if (!reply) {
      return res.status(404).json({ error: 'Reply not found' });
    }
    
    // Check if user is the author
    if (reply.authorId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this reply' });
    }
    
    // Recursively find and delete all descendants
    const deleteDescendants = async (replyId) => {
      // Find all direct children
      const children = await Reply.find({ parentReplyId: replyId });
      
      // Recursively delete each child's descendants
      for (const child of children) {
        await deleteDescendants(child._id);
      }
      
      // Delete all direct children
      await Reply.deleteMany({ parentReplyId: replyId });
    };
    
    // Delete all descendants
    await deleteDescendants(id);
    
    // Count total deleted (including the parent)
    const childrenCount = await Reply.countDocuments({ parentReplyId: id });
    const totalDeleted = childrenCount + 1;
    
    // Delete the reply itself
    await reply.deleteOne();
    
    // Update post replies count
    const post = await Post.findById(reply.postId);
    if (post) {
      post.repliesCount = Math.max(0, post.repliesCount - totalDeleted);
      await post.save();
    }
    
    res.json({ 
      message: 'Reply and all descendants deleted successfully',
      deleted: totalDeleted,
    });
  } catch (error) {
    console.error('Delete reply error:', error);
    res.status(500).json({ error: 'Failed to delete reply' });
  }
};
