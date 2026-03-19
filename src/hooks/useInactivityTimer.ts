import { useState, useEffect, useCallback } from 'react';

export const useInactivityTimer = (timeoutMs: number, onTimeout: () => void) => {
  const [lastActivity, setLastActivity] = useState(Date.now());

  const resetTimer = useCallback(() => {
    setLastActivity(Date.now());
  }, []);

  useEffect(() => {
    const handleActivity = () => resetTimer();
    
    // Listen for various user interactions
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('mousedown', handleActivity);
    window.addEventListener('touchstart', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);

    const intervalId = setInterval(() => {
      if (Date.now() - lastActivity > timeoutMs) {
        onTimeout();
      }
    }, 1000);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('mousedown', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
      clearInterval(intervalId);
    };
  }, [lastActivity, timeoutMs, onTimeout, resetTimer]);

  return resetTimer;
};
