const User = require('../models/User');
const Post = require('../models/Post');
const Reply = require('../models/Reply');
const { verifyToken } = require('../utils/firebaseVerify');

/**
 * Search users by username or display name
 * GET /api/users/search?query=...
 */
exports.searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || query.trim().length < 2) {
      return res.status(400).json({ error: 'Query must be at least 2 characters' });
    }
    
    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { displayName: { $regex: query, $options: 'i' } }
      ]
    })
    .select('username displayName profilePhoto tagline')
    .limit(20);
    
    res.json(users);
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ error: 'Failed to search users' });
  }
};

/**
 * Get public profile by username
 * GET /api/users/:username
 */
exports.getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;
    
    const user = await User.findOne({ username: username.toLowerCase() })
      .select('username displayName profilePhoto bio tagline stats createdAt');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ error: 'Failed to get user profile' });
  }
};

/**
 * Get user statistics
 * GET /api/users/:username/stats
 */
exports.getUserStats = async (req, res) => {
  try {
    const { username } = req.params;
    
    const user = await User.findOne({ username: username.toLowerCase() });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Get actual counts
    const postsCount = await Post.countDocuments({ authorId: user._id });
    const repliesCount = await Reply.countDocuments({ authorId: user._id });
    
    // Get total likes received on posts
    const posts = await Post.find({ authorId: user._id }).select('likesCount');
    const postLikes = posts.reduce((sum, post) => sum + post.likesCount, 0);
    
    // Get total likes received on replies
    const replies = await Reply.find({ authorId: user._id }).select('likesCount');
    const replyLikes = replies.reduce((sum, reply) => sum + reply.likesCount, 0);
    
    const stats = {
      posts: postsCount,
      replies: repliesCount,
      likesReceived: postLikes + replyLikes,
    };
    
    // Update user stats in database
    user.stats = stats;
    await user.save();
    
    res.json(stats);
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ error: 'Failed to get user stats' });
  }
};

/**
 * Get current authenticated user info
 * POST /api/users/current
 */
exports.getCurrentUser = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await verifyToken(idToken);
    
    const user = await User.findOne({ firebaseUid: decodedToken.uid })
      .select('+email +firebaseUid');
    
    if (!user) {
      return res.json({ 
        exists: false,
        firebaseUid: decodedToken.uid,
        email: decodedToken.email 
      });
    }
    
    res.json({
      exists: true,
      ...user.toObject(),
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ error: 'Failed to get current user' });
  }
};

/**
 * Create or update user profile
 * POST /api/users/profile
 */
exports.createOrUpdateProfile = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await verifyToken(idToken);
    
    const { username, displayName, bio, tagline, profilePhoto } = req.body;
    
    // Validation
    if (!username || username.length < 3) {
      return res.status(400).json({ error: 'Username must be at least 3 characters' });
    }
    
    if (!displayName || displayName.length < 1) {
      return res.status(400).json({ error: 'Display name is required' });
    }
    
    // Check if username is taken (by another user)
    const existingUser = await User.findOne({ 
      username: username.toLowerCase(),
      firebaseUid: { $ne: decodedToken.uid }
    });
    
    if (existingUser) {
      return res.status(400).json({ error: 'Username already taken' });
    }
    
    // Find or create user
    let user = await User.findOne({ firebaseUid: decodedToken.uid });
    
    if (user) {
      // Update existing user
      user.username = username.toLowerCase();
      user.displayName = displayName;
      user.bio = bio || '';
      user.tagline = tagline || '';
      user.profilePhoto = profilePhoto || '';
      await user.save();
    } else {
      // Create new user
      user = new User({
        firebaseUid: decodedToken.uid,
        email: decodedToken.email,
        username: username.toLowerCase(),
        displayName,
        bio: bio || '',
        tagline: tagline || '',
        profilePhoto: profilePhoto || '',
      });
      await user.save();
    }
    
    res.json({
      message: 'Profile updated successfully',
      user: {
        _id: user._id,
        username: user.username,
        displayName: user.displayName,
        bio: user.bio,
        tagline: user.tagline,
        profilePhoto: user.profilePhoto,
      },
    });
  } catch (error) {
    console.error('Create/update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};
