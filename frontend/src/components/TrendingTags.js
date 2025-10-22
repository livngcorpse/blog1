import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { postAPI } from '../services/api';
import './TrendingTags.css';

const TrendingTags = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await postAPI.getTrendingTags();
        setTags(response.data.slice(0, 10));
      } catch (error) {
        console.error('Failed to fetch trending tags:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  if (loading) {
    return (
      <div className="trending-tags">
        <h3>Trending Tags</h3>
        <p>Loading...</p>
      </div>
    );
  }

  if (tags.length === 0) {
    return null;
  }

  return (
    <div className="trending-tags">
      <h3>Trending Tags</h3>
      <div className="tags-list">
        {tags.map((tagData, index) => (
          <Link
            key={index}
            to={`/tag/${tagData.tag}`}
            className="trending-tag"
          >
            #{tagData.tag}
            <span className="tag-count">{tagData.count}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TrendingTags;
