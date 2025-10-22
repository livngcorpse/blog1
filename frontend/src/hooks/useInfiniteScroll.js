import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook for infinite scroll
 * @param {Function} fetchMore - Function to fetch more data
 * @param {boolean} hasMore - Whether there's more data to load
 * @param {boolean} isLoading - Whether data is currently loading
 * @returns {Object} { lastElementRef, resetScroll }
 */
const useInfiniteScroll = (fetchMore, hasMore, isLoading) => {
  const observer = useRef();
  const [shouldReset, setShouldReset] = useState(false);

  const lastElementRef = (node) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        fetchMore();
      }
    });

    if (node) observer.current.observe(node);
  };

  const resetScroll = () => {
    setShouldReset(true);
    setTimeout(() => setShouldReset(false), 100);
  };

  return { lastElementRef, resetScroll, shouldReset };
};

export default useInfiniteScroll;
