// src/contexts/NotificationContext.js
import React, { createContext, useContext, useCallback } from 'react';

// Create notification context
const NotificationContext = createContext();

// Provider component
export const NotificationProvider = ({ children }) => {
  // Add notification
  const addNotification = useCallback((title, content, type = 'info') => {
    // Create safe values for title and content
    const safeTitle = typeof title === 'number' && isNaN(title) ? '0' : String(title || '');
    const safeContent = typeof content === 'number' && isNaN(content) ? '0' : String(content || '');
    
    const newNotification = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      title: safeTitle,
      content: safeContent,
      type: type || 'info'
    };
    
    // Dispatch a custom event for the notification center
    window.dispatchEvent(
      new CustomEvent('notification', { detail: newNotification })
    );
  }, []);
  
  // Provider value
  const contextValue = {
    addNotification
  };
  
  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to use the context
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
