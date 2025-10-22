import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import toast from 'react-hot-toast';
import './Navbar.css';

const Navbar = ({ user }) => {
  const navigate = useNavigate();

  // Debug: Log user state
  console.log('🧐 Navbar - Current user:', user ? user.username : 'Not logged in');

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-text">AnonBlog</span>
        </Link>

        <div className="navbar-menu">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/search" className="nav-link">Search</Link>
          
          {user ? (
            <>
              <Link to="/create-post" className="nav-link nav-btn-primary">
                Create Post
              </Link>
              <Link to="/bookmarks" className="nav-link">
                Bookmarks
              </Link>
              {user.isAdmin && (
                <Link to="/admin" className="nav-link">
                  🛡️ Admin
                </Link>
              )}
              <Link to={`/user/${user.username}`} className="nav-link">
                Profile
              </Link>
              <button onClick={handleLogout} className="nav-link nav-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link nav-btn-primary">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
