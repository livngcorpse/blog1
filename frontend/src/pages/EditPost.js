import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { postAPI } from '../services/api';
import toast from 'react-hot-toast';
import './PostForm.css';

const EditPost = ({ currentUser }) => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      toast.error('Please login to edit posts');
      navigate('/login');
      return;
    }

    fetchPost();
  }, [currentUser, id]);

  const fetchPost = async () => {
    try {
      const response = await postAPI.getPostById(id);
      const post = response.data;

      // Check if user is the author
      if (currentUser.id !== post.authorId._id) {
        toast.error('You can only edit your own posts');
        navigate(`/post/${id}`);
        return;
      }

      setFormData({
        title: post.title,
        content: post.content,
        tags: post.tags.join(', '),
      });
    } catch (error) {
      toast.error('Failed to load post');
      navigate('/');
    } finally {
      setInitialLoading(false);
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['blockquote', 'code-block'],
      ['link'],
      ['clean'],
    ],
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    if (!formData.content.trim() || formData.content === '<p><br></p>') {
      toast.error('Content is required');
      return;
    }

    setLoading(true);
    try {
      const tagsArray = formData.tags
        ? formData.tags.split(',').map((tag) => tag.trim()).filter((tag) => tag)
        : [];

      await postAPI.updatePost(id, {
        title: formData.title,
        content: formData.content,
        tags: tagsArray,
      });

      toast.success('Post updated successfully!');
      navigate(`/post/${id}`);
    } catch (error) {
      toast.error(error.message || 'Failed to update post');
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser || initialLoading) {
    return <div className="loading-container">Loading...</div>;
  }

  return (
    <div className="post-form-container">
      <div className="post-form-card">
        <h1>Edit Post</h1>

        <form onSubmit={handleSubmit} className="post-form">
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter post title..."
              maxLength="200"
            />
          </div>

          <div className="form-group">
            <label>Content</label>
            <ReactQuill
              theme="snow"
              value={formData.content}
              onChange={(value) => setFormData({ ...formData, content: value })}
              modules={modules}
              placeholder="Write your post content..."
            />
          </div>

          <div className="form-group">
            <label>Tags</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="javascript, react, nodejs (comma separated)"
            />
            <small>Separate tags with commas</small>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate(`/post/${id}`)}
              className="cancel-btn"
            >
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Updating...' : 'Update Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPost;
