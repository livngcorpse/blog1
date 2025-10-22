import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';
import UserAvatar from '../components/UserAvatar';
import { useTheme } from '../contexts/ThemeContext';
import toast from 'react-hot-toast';
import './EditProfile.css';

const EditProfile = ({ currentUser }) => {
  const { mode, theme, toggleMode, changeTheme } = useTheme();
  const [formData, setFormData] = useState({
    username: '',
    displayName: '',
    bio: '',
    tagline: '',
    profilePhoto: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      toast.error('Please login to edit your profile');
      navigate('/login');
      return;
    }

    // Load current user data
    setFormData({
      username: currentUser.username || '',
      displayName: currentUser.displayName || '',
      bio: currentUser.bio || '',
      tagline: currentUser.tagline || '',
      profilePhoto: currentUser.profilePhoto || '',
    });
  }, [currentUser, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || formData.username.length < 3) {
      toast.error('Username must be at least 3 characters');
      return;
    }

    if (!formData.displayName) {
      toast.error('Display name is required');
      return;
    }

    setLoading(true);
    try {
      // Include theme preferences in the update
      const updateData = {
        ...formData,
        themePreferences: {
          theme,
          mode,
        },
      };
      
      await userAPI.createOrUpdateProfile(updateData);
      toast.success('Profile updated successfully!');
      navigate(`/user/${formData.username}`);
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="edit-profile-container">
      <div className="edit-profile-card">
        <h1>Edit Profile</h1>

        <div className="avatar-preview">
          <UserAvatar user={{ ...currentUser, ...formData }} size={100} />
        </div>

        <form onSubmit={handleSubmit} className="edit-profile-form">
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="username"
              minLength="3"
              maxLength="30"
              required
            />
            <small>Lowercase, 3-30 characters. This will be your unique identifier.</small>
          </div>

          <div className="form-group">
            <label>Display Name</label>
            <input
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              placeholder="Your Name"
              maxLength="50"
              required
            />
          </div>

          <div className="form-group">
            <label>Tagline</label>
            <input
              type="text"
              name="tagline"
              value={formData.tagline}
              onChange={handleChange}
              placeholder="A short tagline about yourself"
              maxLength="100"
            />
          </div>

          <div className="form-group">
            <label>Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself..."
              maxLength="500"
              rows="4"
            />
            <small>{formData.bio.length} / 500 characters</small>
          </div>

          <div className="form-group">
            <label>Profile Photo URL</label>
            <input
              type="url"
              name="profilePhoto"
              value={formData.profilePhoto}
              onChange={handleChange}
              placeholder="https://example.com/photo.jpg"
            />
            <small>Enter a URL to your profile picture</small>
          </div>

          <div className="form-section-divider">
            <h3>🎨 Theme Preferences</h3>
          </div>

          <div className="form-group">
            <label>Theme</label>
            <div className="theme-options">
              <button
                type="button"
                className={`theme-option ${theme === 'default' ? 'active' : ''}`}
                onClick={() => changeTheme('default')}
              >
                <span className="theme-icon">🎨</span>
                <span>Default</span>
              </button>
              <button
                type="button"
                className={`theme-option ${theme === 'halo' ? 'active' : ''}`}
                onClick={() => changeTheme('halo')}
              >
                <span className="theme-icon">🌌</span>
                <span>Halo</span>
              </button>
              <button
                type="button"
                className={`theme-option ${theme === 'hacker' ? 'active' : ''}`}
                onClick={() => changeTheme('hacker')}
              >
                <span className="theme-icon">💻</span>
                <span>Hacker</span>
              </button>
              <button
                type="button"
                className={`theme-option ${theme === 'sunset' ? 'active' : ''}`}
                onClick={() => changeTheme('sunset')}
              >
                <span className="theme-icon">🌅</span>
                <span>Sunset</span>
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Mode</label>
            <div className="mode-toggle">
              <button
                type="button"
                className="mode-toggle-btn"
                onClick={toggleMode}
              >
                {mode === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode'}
              </button>
              <small>Current: <strong>{mode === 'dark' ? 'Dark' : 'Light'}</strong></small>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate(`/user/${currentUser.username}`)}
              className="cancel-btn"
            >
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
