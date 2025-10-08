import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Initialize theme immediately to prevent flash
    const saved = localStorage.getItem('theme') as Theme | null;
    if (saved) {
      return saved;
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  // Initialize theme on mount and remove no-transitions class
  useEffect(() => {
    // Add theme class immediately
    document.documentElement.classList.add(theme);

    // Remove no-transitions class after a brief delay to enable smooth transitions
    const timer = setTimeout(() => {
      document.documentElement.classList.remove('no-transitions');
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Apply theme to DOM with smooth transition
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    // Add a smooth transition effect
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return { theme, toggleTheme };
};
