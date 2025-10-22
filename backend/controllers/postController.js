const Post = require('../models/Post');
const Reply = require('../models/Reply');
const User = require('../models/User');
const generateExcerpt = require('../utils/excerptGenerator');
const calculateReadingTime = require('../utils/readingTime');
const extractMentions = require('../utils/extractMentions');

/**
 * Get all posts with pagination, filtering, and search
 * GET /api/posts?page=1&limit=10&search=...&tag=...
 */
exports.getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { search, tag, sort = '-createdAt' } = req.query;
    
    let query = {};
    
    // Search filter
    if (search) {
      query.$text = { $search: search };
    }
    
    // Tag filter
    if (tag) {
      query.tags = tag.toLowerCase();
    }
    
    const total = await Post.countDocuments(query);
    
    const posts = await Post.find(query)
      .populate('authorId', 'username displayName profilePhoto')
      .sort(sort)
      .skip(skip)
      .limit(limit);
    
    res.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ error: 'Failed to get posts' });
  }
};

/**
 * Get trending tags
 * GET /api/posts/trending-tags
 */
exports.getTrendingTags = async (req, res) => {
  try {
    const tags = await Post.aggregate([
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 },
      { $project: { tag: '$_id', count: 1, _id: 0 } }
    ]);
    
    res.json(tags);
  } catch (error) {
    console.error('Get trending tags error:', error);
    res.status(500).json({ error: 'Failed to get trending tags' });
  }
};

/**
 * Get posts by tag
 * GET /api/posts/tag/:tag
 */
exports.getPostsByTag = async (req, res) => {
  try {
    const { tag } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const query = { tags: tag.toLowerCase() };
    const total = await Post.countDocuments(query);
    
    const posts = await Post.find(query)
      .populate('authorId', 'username displayName profilePhoto')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);
    
    res.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get posts by tag error:', error);
    res.status(500).json({ error: 'Failed to get posts by tag' });
  }
};

/**
 * Get posts by author username
 * GET /api/posts/author/:username
 */
exports.getPostsByAuthor = async (req, res) => {
  try {
    const { username } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const user = await User.findOne({ username: username.toLowerCase() });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const query = { authorId: user._id };
    const total = await Post.countDocuments(query);
    
    const posts = await Post.find(query)
      .populate('authorId', 'username displayName profilePhoto')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);
    
    res.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get posts by author error:', error);
    res.status(500).json({ error: 'Failed to get posts by author' });
  }
};

/**
 * Get single post by ID
 * GET /api/posts/:id
 */
exports.getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const post = await Post.findById(id)
      .populate('authorId', 'username displayName profilePhoto bio');
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Increment view count
    post.viewsCount += 1;
    await post.save();
    
    // Check if current user has liked the post
    let hasLiked = false;
    if (req.user) {
      hasLiked = post.likes.includes(req.user.id);
    }
    
    res.json({
      ...post.toObject(),
      hasLiked,
    });
  } catch (error) {
    console.error('Get post by ID error:', error);
    res.status(500).json({ error: 'Failed to get post' });
  }
};

/**
 * Create new post
 * POST /api/posts
 */
exports.createPost = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    
    // Validation
    if (!title || title.trim().length === 0) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Content is required' });
    }
    
    // Generate excerpt and reading time
    const excerpt = generateExcerpt(content);
    const readingTime = calculateReadingTime(content);
    
    // Extract mentions from title and content
    const mentions = extractMentions(`${title} ${content}`);
    
    // Process tags
    const processedTags = tags ? tags.map(tag => tag.toLowerCase().trim()).filter(tag => tag) : [];
    
    const post = new Post({
      title: title.trim(),
      content,
      excerpt,
      authorId: req.user.id,
      tags: processedTags,
      mentions,
      readingTime,
    });
    
    await post.save();
    await post.populate('authorId', 'username displayName profilePhoto');
    
    res.status(201).json({
      message: 'Post created successfully',
      post,
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
};

/**
 * Toggle like on post
 * POST /api/posts/:id/like
 */
exports.toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    
    const post = await Post.findById(id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    const userId = req.user.id;
    const hasLiked = post.likes.includes(userId);
    
    if (hasLiked) {
      // Unlike
      post.likes = post.likes.filter(id => id.toString() !== userId.toString());
      post.likesCount = Math.max(0, post.likesCount - 1);
    } else {
      // Like
      post.likes.push(userId);
      post.likesCount += 1;
    }
    
    await post.save();
    
    res.json({
      liked: !hasLiked,
      likesCount: post.likesCount,
    });
  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({ error: 'Failed to toggle like' });
  }
};

/**
 * Update post
 * PUT /api/posts/:id
 */
exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, tags } = req.body;
    
    const post = await Post.findById(id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Check if user is the author
    if (post.authorId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ error: 'Not authorized to update this post' });
    }
    
    // Update fields
    if (title) post.title = title.trim();
    if (content) {
      post.content = content;
      post.excerpt = generateExcerpt(content);
      post.readingTime = calculateReadingTime(content);
      // Update mentions
      post.mentions = extractMentions(`${post.title} ${content}`);
    }
    if (tags) {
      post.tags = tags.map(tag => tag.toLowerCase().trim()).filter(tag => tag);
    }
    
    await post.save();
    await post.populate('authorId', 'username displayName profilePhoto');
    
    res.json({
      message: 'Post updated successfully',
      post,
    });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ error: 'Failed to update post' });
  }
};

/**
 * Delete post and all its replies
 * DELETE /api/posts/:id
 */
exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    
    const post = await Post.findById(id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Check if user is the author
    if (post.authorId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this post' });
    }
    
    // Delete all replies for this post
    await Reply.deleteMany({ postId: id });
    
    // Delete the post
    await post.deleteOne();
    
    res.json({ message: 'Post and all replies deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
};

/**
 * Get related posts based on shared tags
 * GET /api/posts/:id/related
 */
exports.getRelatedPosts = async (req, res) => {
  try {
    const { id } = req.params;
    const limit = parseInt(req.query.limit) || 4;
    
    const post = await Post.findById(id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // If post has no tags, return empty array
    if (!post.tags || post.tags.length === 0) {
      return res.json([]);
    }
    
    // Find posts with shared tags, excluding the current post
    const relatedPosts = await Post.find({
      _id: { $ne: id },
      tags: { $in: post.tags }
    })
      .populate('authorId', 'username displayName profilePhoto')
      .sort({ likesCount: -1, createdAt: -1 }) // Sort by popularity then recency
      .limit(limit);
    
    res.json(relatedPosts);
  } catch (error) {
    console.error('Get related posts error:', error);
    res.status(500).json({ error: 'Failed to get related posts' });
  }
};
