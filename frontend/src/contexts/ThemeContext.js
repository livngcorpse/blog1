import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // Mode: 'light' or 'dark'
  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem('theme-mode');
    return saved || 'dark';
  });

  // Theme: 'default', 'halo', 'hacker', 'sunset'
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme-name');
    return saved || 'default';
  });

  useEffect(() => {
    localStorage.setItem('theme-mode', mode);
    localStorage.setItem('theme-name', theme);
    
    // Apply theme classes to document
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-mode', mode);
  }, [mode, theme]);

  const toggleMode = () => {
    setMode(prev => prev === 'light' ? 'dark' : 'light');
  };

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
  };

  const setModeDirectly = (newMode) => {
    setMode(newMode);
  };

  const loadUserThemePreferences = (preferences) => {
    if (preferences) {
      setTheme(preferences.theme || 'default');
      setMode(preferences.mode || 'dark');
    }
  };

  const value = {
    mode,
    theme,
    toggleMode,
    changeTheme,
    setModeDirectly,
    loadUserThemePreferences,
    isDark: mode === 'dark',
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
