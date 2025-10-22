import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { userAPI, postAPI } from '../services/api';
import UserAvatar from '../components/UserAvatar';
import PostCard from '../components/PostCard';
import './Search.css';

const Search = () => {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('posts');
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!query.trim() || query.length < 2) {
      return;
    }

    setLoading(true);
    setHasSearched(true);

    try {
      if (searchType === 'users') {
        const response = await userAPI.searchUsers(query);
        setUsers(response.data);
        setPosts([]);
      } else {
        const response = await postAPI.getPosts({ search: query });
        setPosts(response.data.posts);
        setUsers([]);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-container">
      <div className="search-header">
        <h1>Search AnonBlog</h1>
        
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for posts or users..."
            className="search-input"
          />
          <button type="submit" className="search-btn" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        <div className="search-type-toggle">
          <button
            className={`toggle-btn ${searchType === 'posts' ? 'active' : ''}`}
            onClick={() => setSearchType('posts')}
          >
            Posts
          </button>
          <button
            className={`toggle-btn ${searchType === 'users' ? 'active' : ''}`}
            onClick={() => setSearchType('users')}
          >
            Users
          </button>
        </div>
      </div>

      <div className="search-results">
        {loading ? (
          <div className="loading">Searching...</div>
        ) : !hasSearched ? (
          <div className="empty-state">
            <h2>Start your search</h2>
            <p>Enter a keyword to find posts or users</p>
          </div>
        ) : searchType === 'users' ? (
          users.length === 0 ? (
            <div className="empty-state">
              <h2>No users found</h2>
              <p>Try a different search term</p>
            </div>
          ) : (
            <div className="users-results">
              {users.map((user) => (
                <Link
                  key={user._id}
                  to={`/user/${user.username}`}
                  className="user-card"
                >
                  <UserAvatar user={user} size={60} />
                  <div className="user-info">
                    <h3>{user.displayName}</h3>
                    <p className="username">@{user.username}</p>
                    {user.tagline && <p className="tagline">{user.tagline}</p>}
                  </div>
                </Link>
              ))}
            </div>
          )
        ) : (
          posts.length === 0 ? (
            <div className="empty-state">
              <h2>No posts found</h2>
              <p>Try a different search term</p>
            </div>
          ) : (
            <div className="posts-results">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Search;
