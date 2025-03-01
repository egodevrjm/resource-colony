// src/contexts/ThemeContext/index.js
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define theme properties
const themes = {
  light: {
    name: 'light',
    background: '#f0f4f8',
    cardBackground: '#ffffff',
    text: '#2d3748',
    textSecondary: '#718096',
    border: '#e2e8f0',
    primaryButton: '#4299e1',
    primaryButtonHover: '#3182ce',
    disabledButton: '#a0aec0',
    success: '#48bb78',
    warning: '#ed8936',
    error: '#f56565',
    menuBackground: '#e2e8f0',
    menuItemActive: '#4a6fa5',
    menuItemActiveText: '#ffffff',
    menuItemText: '#4a5568',
    menuItemHover: '#cbd5e0',
    panelShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    tooltip: 'rgba(0, 0, 0, 0.8)',
    tooltipText: '#ffffff',
  },
  dark: {
    name: 'dark',
    background: '#1a202c',
    cardBackground: '#2d3748',
    text: '#e2e8f0',
    textSecondary: '#a0aec0',
    border: '#4a5568',
    primaryButton: '#4299e1',
    primaryButtonHover: '#3182ce',
    disabledButton: '#4a5568',
    success: '#48bb78',
    warning: '#ed8936',
    error: '#f56565',
    menuBackground: '#4a5568',
    menuItemActive: '#63b3ed',
    menuItemActiveText: '#1a202c',
    menuItemText: '#e2e8f0',
    menuItemHover: '#2d3748',
    panelShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
    tooltip: 'rgba(255, 255, 255, 0.8)',
    tooltipText: '#1a202c',
  },
};

// Create the context
const ThemeContext = createContext();

// Provider component
export const ThemeProvider = ({ children }) => {
  // Check if a theme preference is saved in localStorage
  const savedTheme = localStorage.getItem('resourceColonyTheme');
  
  // Initialize state with saved theme or default to light
  const [theme, setTheme] = useState(savedTheme === 'dark' ? themes.dark : themes.light);
  
  // Toggle between light and dark themes
  const toggleTheme = () => {
    const newTheme = theme.name === 'light' ? themes.dark : themes.light;
    setTheme(newTheme);
    // Save theme preference to localStorage
    localStorage.setItem('resourceColonyTheme', newTheme.name);
  };
  
  // Apply theme to root CSS variables when theme changes
  useEffect(() => {
    const root = document.documentElement;
    
    // Apply theme properties as CSS variables
    Object.entries(theme).forEach(([property, value]) => {
      if (property !== 'name') {
        root.style.setProperty(`--${property}`, value);
      }
    });
  }, [theme]);
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for using the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
