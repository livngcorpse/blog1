const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  content: {
    type: String,
    required: true,
  },
  excerpt: {
    type: String,
    maxlength: 300,
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  likesCount: {
    type: Number,
    default: 0,
  },
  repliesCount: {
    type: Number,
    default: 0,
  },
  viewsCount: {
    type: Number,
    default: 0,
  },
  readingTime: {
    type: Number,
    default: 1,
  },
}, {
  timestamps: true,
});

// Index for search and filtering
postSchema.index({ title: 'text', content: 'text', tags: 'text' });
postSchema.index({ tags: 1 });
postSchema.index({ authorId: 1 });
postSchema.index({ createdAt: -1 });
postSchema.index({ likesCount: -1 });

module.exports = mongoose.model('Post', postSchema);
