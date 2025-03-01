// src/contexts/ThemeContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

// Define themes
const lightTheme = {
  name: 'light',
  background: '#f8fafc',
  cardBackground: '#ffffff',
  text: '#1a202c',
  textSecondary: '#4a5568',
  border: '#e2e8f0',
  primaryButton: '#4299e1',
  primaryButtonHover: '#3182ce',
  primary: '#4299e1',
  secondary: '#a0aec0',
  success: '#48bb78',
  warning: '#ed8936',
  danger: '#f56565',
  info: '#4299e1',
  panelShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
  elevatedShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  hoverBackground: '#f7fafc',
  inputBackground: '#fff',
  progressBarBackground: '#edf2f7',
  tooltipBackground: 'rgba(45, 55, 72, 0.95)',
  tooltipText: '#ffffff',
  scrollbarThumb: '#cbd5e0',
  scrollbarTrack: '#f1f5f9',
  scrollbarHover: '#a0aec0'
};

const darkTheme = {
  name: 'dark',
  background: '#111827',  // Darker background
  cardBackground: '#1e293b',  // Improved card contrast
  text: '#f1f5f9',  // Brighter text for better readability
  textSecondary: '#cbd5e0',
  border: '#3a4a5e',  // Slightly more visible borders
  primaryButton: '#3b82f6',  // Brighter blue for buttons
  primaryButtonHover: '#2563eb',
  primary: '#3b82f6',
  secondary: '#94a3b8',
  success: '#10b981',  // Brighter success color
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6',
  panelShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
  elevatedShadow: '0 8px 12px rgba(0, 0, 0, 0.4)',
  hoverBackground: '#2a3649',
  inputBackground: '#2d3748',
  progressBarBackground: '#374151',
  tooltipBackground: 'rgba(241, 245, 249, 0.95)',
  tooltipText: '#0f172a',
  scrollbarThumb: '#4b5563',
  scrollbarTrack: '#1e293b',
  scrollbarHover: '#64748b'
};

// Space theme
const spaceTheme = {
  name: 'space',
  background: '#050c2e',  // Deep space blue
  cardBackground: '#0c1445',
  text: '#e2e8ff',
  textSecondary: '#a8b3e0',
  border: '#2a3c8a',
  primaryButton: '#6366f1',
  primaryButtonHover: '#4f46e5',
  primary: '#6366f1',
  secondary: '#8b5cf6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6',
  panelShadow: '0 4px 6px rgba(0, 0, 0, 0.5)',
  elevatedShadow: '0 8px 15px rgba(0, 0, 0, 0.6)',
  hoverBackground: '#182057',
  inputBackground: '#0c1445',
  progressBarBackground: '#1e2a8a',
  tooltipBackground: 'rgba(226, 232, 255, 0.95)',
  tooltipText: '#050c2e',
  scrollbarThumb: '#3949ab',
  scrollbarTrack: '#0c1445',
  scrollbarHover: '#5c6bc0'
};

// Create the context
const ThemeContext = createContext();

// Provider component
export const ThemeProvider = ({ children }) => {
  // Try to get saved theme from localStorage or use light theme as default
  const savedTheme = localStorage.getItem('colonyTheme');
  const getInitialTheme = () => {
    if (savedTheme === 'dark') return darkTheme;
    if (savedTheme === 'space') return spaceTheme;
    return lightTheme;
  };
  
  const [theme, setTheme] = useState(getInitialTheme());
  
  // Set a specific theme by name
  const setThemeByName = (themeName) => {
    let newTheme;
    switch(themeName) {
      case 'dark':
        newTheme = darkTheme;
        break;
      case 'space':
        newTheme = spaceTheme;
        break;
      default:
        newTheme = lightTheme;
    }
    setTheme(newTheme);
    localStorage.setItem('colonyTheme', newTheme.name);
  };
  
  // Toggle between light and dark themes
  const toggleTheme = () => {
    let newTheme;
    switch(theme.name) {
      case 'light':
        newTheme = darkTheme;
        break;
      case 'dark':
        newTheme = spaceTheme;
        break;
      default:
        newTheme = lightTheme;
    }
    setTheme(newTheme);
    localStorage.setItem('colonyTheme', newTheme.name);
  };
  
  // Apply CSS variables to the document root
  useEffect(() => {
    const root = document.documentElement;
    Object.entries(theme).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
  }, [theme]);
  
  // Apply scrollbar styles based on theme
  useEffect(() => {
    // Add global scrollbar styles
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      ::-webkit-scrollbar {
        width: 10px;
        height: 10px;
      }
      
      ::-webkit-scrollbar-track {
        background: ${theme.scrollbarTrack};
        border-radius: 5px;
      }
      
      ::-webkit-scrollbar-thumb {
        background: ${theme.scrollbarThumb};
        border-radius: 5px;
      }
      
      ::-webkit-scrollbar-thumb:hover {
        background: ${theme.scrollbarHover};
      }
    `;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, [theme]);
  
  // Context value
  const contextValue = {
    theme,
    toggleTheme,
    setThemeByName,
    themes: {
      light: lightTheme,
      dark: darkTheme,
      space: spaceTheme
    }
  };
  
  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};