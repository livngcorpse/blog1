import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { userAPI, postAPI } from '../services/api';
import UserAvatar from '../components/UserAvatar';
import PostCard from '../components/PostCard';
import toast from 'react-hot-toast';
import './Profile.css';

const Profile = ({ currentUser }) => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, [username]);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const [userResponse, statsResponse, postsResponse] = await Promise.all([
        userAPI.getUserProfile(username),
        userAPI.getUserStats(username),
        postAPI.getPostsByAuthor(username, { page: 1, limit: 10 }),
      ]);

      setUser(userResponse.data);
      setStats(statsResponse.data);
      setPosts(postsResponse.data.posts);
    } catch (error) {
      toast.error('Failed to load profile');
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-container">Loading profile...</div>;
  }

  if (!user) {
    return (
      <div className="error-container">
        <h2>User not found</h2>
        <Link to="/">Go back to home</Link>
      </div>
    );
  }

  const isOwnProfile = currentUser && currentUser.username === user.username;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <UserAvatar user={user} size={120} />
        
        <div className="profile-info">
          <h1>{user.displayName}</h1>
          <p className="username">@{user.username}</p>
          {user.tagline && <p className="tagline">{user.tagline}</p>}
          {user.bio && <p className="bio">{user.bio}</p>}
          
          {isOwnProfile && (
            <Link to="/edit-profile" className="edit-profile-btn">
              Edit Profile
            </Link>
          )}
        </div>
      </div>

      {stats && (
        <div className="profile-stats">
          <div className="stat-card">
            <div className="stat-number">{stats.posts}</div>
            <div className="stat-label">Posts</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.replies}</div>
            <div className="stat-label">Replies</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.likesReceived}</div>
            <div className="stat-label">Likes Received</div>
          </div>
        </div>
      )}

      <div className="profile-posts">
        <h2>Posts by {user.displayName}</h2>
        
        {posts.length === 0 ? (
          <div className="no-posts">
            <p>No posts yet</p>
            {isOwnProfile && (
              <Link to="/create-post" className="create-post-link">
                Create your first post
              </Link>
            )}
          </div>
        ) : (
          <div className="posts-list">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
