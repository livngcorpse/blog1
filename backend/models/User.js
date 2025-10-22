const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    required: true,
    unique: true,
    select: false, // Hide by default
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    select: false, // Hide by default
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minlength: 3,
    maxlength: 30,
  },
  displayName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50,
  },
  bio: {
    type: String,
    default: '',
    maxlength: 500,
  },
  tagline: {
    type: String,
    default: '',
    maxlength: 100,
  },
  profilePhoto: {
    type: String,
    default: '',
  },
  themePreferences: {
    theme: {
      type: String,
      enum: ['default', 'halo', 'hacker', 'sunset'],
      default: 'default',
    },
    mode: {
      type: String,
      enum: ['light', 'dark'],
      default: 'dark',
    },
  },
  stats: {
    posts: { type: Number, default: 0 },
    replies: { type: Number, default: 0 },
    likesReceived: { type: Number, default: 0 },
  },
}, {
  timestamps: true,
});

// Index for search
userSchema.index({ username: 'text', displayName: 'text' });

module.exports = mongoose.model('User', userSchema);
