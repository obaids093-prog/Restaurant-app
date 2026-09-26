import React, { createContext, useContext, useState, useEffect } from 'react';
import safeStorage from '../utils/safeStorage';
import { colors, shadows, typography } from '../theme/theme';

export const ThemeContext = createContext(null);

const THEME_STORAGE_KEY = '@restaurant_app_theme_dark';

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Load persisted theme preference
    (async () => {
      try {
        const savedTheme = await safeStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme !== null) {
          setIsDark(JSON.parse(savedTheme));
        }
      } catch (e) {
        console.warn('Failed to load theme preference', e);
      }
    })();
  }, []);

  const toggleTheme = async () => {
    try {
      const nextValue = !isDark;
      setIsDark(nextValue);
      await safeStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(nextValue));
    } catch (e) {
      console.warn('Failed to save theme preference', e);
    }
  };

  const themeColors = isDark ? colors.dark : colors.light;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, colors: themeColors, shadows, typography }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
