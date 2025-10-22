import axios from 'axios';
import { auth } from '../firebase';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || error.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

// ============ USER API ============
export const userAPI = {
  searchUsers: (query) => api.get(`/users/search?query=${query}`),
  getUserProfile: (username) => api.get(`/users/${username}`),
  getUserStats: (username) => api.get(`/users/${username}/stats`),
  getCurrentUser: () => api.post('/users/current'),
  createOrUpdateProfile: (data) => api.post('/users/profile', data),
};

// ============ POST API ============
export const postAPI = {
  getPosts: (params) => api.get('/posts', { params }),
  getTrendingTags: () => api.get('/posts/trending-tags'),
  getPostsByTag: (tag, params) => api.get(`/posts/tag/${tag}`, { params }),
  getPostsByAuthor: (username, params) => api.get(`/posts/author/${username}`, { params }),
  getPostById: (id) => api.get(`/posts/${id}`),
  createPost: (data) => api.post('/posts', data),
  updatePost: (id, data) => api.put(`/posts/${id}`, data),
  deletePost: (id) => api.delete(`/posts/${id}`),
  toggleLike: (id) => api.post(`/posts/${id}/like`),
};

// ============ REPLY API ============
export const replyAPI = {
  getRepliesByPost: (postId) => api.get(`/replies/post/${postId}`),
  createReply: (data) => api.post('/replies', data),
  toggleReplyLike: (id) => api.post(`/replies/${id}/like`),
  deleteReply: (id) => api.delete(`/replies/${id}`),
};

// ============ REPORT API ============
export const reportAPI = {
  createReport: (data) => api.post('/reports', data),
  getMyReports: () => api.get('/reports/my-reports'),
  getAllReports: (params) => api.get('/reports', { params }),
};

// ============ BOOKMARK API ============
export const bookmarkAPI = {
  toggleBookmark: (postId) => api.post(`/bookmarks/${postId}`),
  getBookmarks: (params) => api.get('/bookmarks', { params }),
  checkBookmark: (postId) => api.get(`/bookmarks/check/${postId}`),
};

export default api;
