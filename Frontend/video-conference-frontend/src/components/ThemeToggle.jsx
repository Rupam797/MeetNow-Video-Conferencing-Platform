// src/components/ThemeToggle.jsx
import { useEffect, useState } from 'react';

const ThemeToggle = () => {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem('theme') === 'dark'
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <button
      className="p-2 bg-gray-200 dark:bg-gray-800 rounded-full"
      onClick={() => setDarkMode(!darkMode)}
    >
      {darkMode ? '🌙' : '☀️'}
    </button>
  );
};

export default ThemeToggle;

