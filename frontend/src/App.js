import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { userAPI } from './services/api';

// Components
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import SinglePost from './pages/SinglePost';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Search from './pages/Search';
import TagPosts from './pages/TagPosts';

import './App.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const response = await userAPI.getCurrentUser();
          
          if (response.data.exists) {
            setCurrentUser(response.data);
          } else {
            // User exists in Firebase but not in database
            setCurrentUser(null);
          }
        } catch (error) {
          console.error('Error fetching user:', error);
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
        <p>Loading AnonBlog...</p>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Router>
        <div className="App">
          <Navbar user={currentUser} />
          
          <main className="app-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/search" element={<Search />} />
              <Route path="/tag/:tag" element={<TagPosts />} />
              <Route path="/user/:username" element={<Profile currentUser={currentUser} />} />
              <Route path="/post/:id" element={<SinglePost currentUser={currentUser} />} />
              
              {/* Protected routes */}
              <Route
                path="/create-post"
                element={
                  currentUser ? (
                    <CreatePost currentUser={currentUser} />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/edit-post/:id"
                element={
                  currentUser ? (
                    <EditPost currentUser={currentUser} />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/edit-profile"
                element={
                  currentUser ? (
                    <EditProfile currentUser={currentUser} />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              
              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                iconTheme: {
                  primary: '#4ade80',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

const NotFound = () => (
  <div className="not-found">
    <h1>404</h1>
    <p>Page not found</p>
    <a href="/">Go back to home</a>
  </div>
);

export default App;
