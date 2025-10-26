import React from 'react';
import { useTheme } from '../../hooks/useTheme';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-14 h-7 bg-gray-300 dark:bg-gray-600 rounded-full
                 transition-colors duration-300 focus:outline-none focus:ring-2
                 focus:ring-primary-500 focus:ring-offset-2"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title="Toggle theme"
    >
      <span
        className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full
                   flex items-center justify-center transition-transform duration-300
                   ${theme === 'dark' ? 'translate-x-7' : 'translate-x-0'}`}
      >
        {theme === 'light' ? '☀️' : '🌙'}
      </span>
    </button>
  );
};
