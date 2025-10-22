const Bookmark = require('../models/Bookmark');
const Post = require('../models/Post');

/**
 * Toggle bookmark on a post
 * POST /api/bookmarks/:postId
 */
exports.toggleBookmark = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if bookmark exists
    const existingBookmark = await Bookmark.findOne({ userId, postId });

    if (existingBookmark) {
      // Remove bookmark
      await existingBookmark.deleteOne();
      return res.json({
        bookmarked: false,
        message: 'Bookmark removed',
      });
    } else {
      // Add bookmark
      const bookmark = new Bookmark({ userId, postId });
      await bookmark.save();
      return res.json({
        bookmarked: true,
        message: 'Post bookmarked',
      });
    }
  } catch (error) {
    console.error('Toggle bookmark error:', error);
    res.status(500).json({ error: 'Failed to toggle bookmark' });
  }
};

/**
 * Get all bookmarked posts for current user
 * GET /api/bookmarks
 */
exports.getBookmarks = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Bookmark.countDocuments({ userId });

    const bookmarks = await Bookmark.find({ userId })
      .populate({
        path: 'postId',
        populate: {
          path: 'authorId',
          select: 'username displayName profilePhoto',
        },
      })
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);

    // Filter out bookmarks where post was deleted
    const validBookmarks = bookmarks.filter(b => b.postId);

    res.json({
      bookmarks: validBookmarks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get bookmarks error:', error);
    res.status(500).json({ error: 'Failed to get bookmarks' });
  }
};

/**
 * Check if post is bookmarked
 * GET /api/bookmarks/check/:postId
 */
exports.checkBookmark = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const bookmark = await Bookmark.findOne({ userId, postId });

    res.json({
      bookmarked: !!bookmark,
    });
  } catch (error) {
    console.error('Check bookmark error:', error);
    res.status(500).json({ error: 'Failed to check bookmark' });
  }
};
