import { useState, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';

/**
 * Custom hook for rate limiting actions
 * @param {number} limit - Maximum number of actions allowed
 * @param {number} windowMs - Time window in milliseconds
 * @returns {object} - { canPerformAction, performAction, remainingAttempts }
 */
const useRateLimit = (limit = 5, windowMs = 60000) => {
  const [attempts, setAttempts] = useState([]);
  const timeoutRef = useRef(null);

  const cleanupOldAttempts = useCallback(() => {
    const now = Date.now();
    setAttempts(prev => prev.filter(timestamp => now - timestamp < windowMs));
  }, [windowMs]);

  const canPerformAction = useCallback(() => {
    cleanupOldAttempts();
    return attempts.length < limit;
  }, [attempts, limit, cleanupOldAttempts]);

  const performAction = useCallback(async (action) => {
    cleanupOldAttempts();

    if (attempts.length >= limit) {
      const oldestAttempt = Math.min(...attempts);
      const timeUntilReset = Math.ceil((windowMs - (Date.now() - oldestAttempt)) / 1000);
      
      toast.error(`Too many requests. Please wait ${timeUntilReset} seconds.`);
      return { success: false, error: 'Rate limit exceeded' };
    }

    // Add current attempt
    const now = Date.now();
    setAttempts(prev => [...prev, now]);

    // Schedule cleanup
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(cleanupOldAttempts, windowMs);

    // Perform the action
    try {
      const result = await action();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error };
    }
  }, [attempts, limit, windowMs, cleanupOldAttempts]);

  const remainingAttempts = limit - attempts.length;

  return {
    canPerformAction: canPerformAction(),
    performAction,
    remainingAttempts,
  };
};

export default useRateLimit;
