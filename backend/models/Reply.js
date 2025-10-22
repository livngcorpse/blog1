const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  parentReplyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reply',
    default: null,
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
    maxlength: 2000,
  },
  mentions: [{
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
  // Virtual field - will be populated during query
  children: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reply',
  }],
}, {
  timestamps: true,
});

// Indexes for efficient querying
replySchema.index({ postId: 1, parentReplyId: 1 });
replySchema.index({ parentReplyId: 1 });
replySchema.index({ authorId: 1 });

module.exports = mongoose.model('Reply', replySchema);
