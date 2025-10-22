import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { mode, theme, toggleMode, changeTheme, isDark } = useTheme();
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const menuRef = useRef(null);

  const themes = [
    { name: 'default', label: 'Default', icon: '🎨' },
    { name: 'halo', label: 'Halo', icon: '🌌' },
    { name: 'hacker', label: 'Hacker', icon: '💻' },
    { name: 'sunset', label: 'Sunset', icon: '🌅' }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowThemeMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="theme-toggle-container" ref={menuRef}>
      {/* Mode Toggle Button */}
      <button 
        className="mode-toggle-btn" 
        onClick={toggleMode}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        {isDark ? '☀️' : '🌙'}
      </button>

      {/* Theme Selector Button */}
      <button 
        className="theme-selector-btn" 
        onClick={() => setShowThemeMenu(!showThemeMenu)}
        aria-label="Select theme"
        title="Select theme"
      >
        {themes.find(t => t.name === theme)?.icon || '🎨'}
      </button>

      {/* Theme Menu Dropdown */}
      {showThemeMenu && (
        <div className="theme-menu">
          <div className="theme-menu-header">
            <span>Select Theme</span>
          </div>
          <div className="theme-menu-items">
            {themes.map((t) => (
              <button
                key={t.name}
                className={`theme-menu-item ${theme === t.name ? 'active' : ''}`}
                onClick={() => {
                  changeTheme(t.name);
                  setShowThemeMenu(false);
                }}
              >
                <span className="theme-icon">{t.icon}</span>
                <span className="theme-label">{t.label}</span>
                {theme === t.name && <span className="theme-check">✓</span>}
              </button>
            ))}
          </div>
          <div className="theme-menu-footer">
            <div className="theme-mode-indicator">
              Mode: <strong>{isDark ? 'Dark' : 'Light'}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeToggle;
