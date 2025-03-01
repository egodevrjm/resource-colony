// DebugMonitor.js - Helps identify problematic components

import { useEffect, useRef } from 'react';
import { safeNumber } from './SafeWrappers';

// This component logs DOM attribute warnings
const DebugMonitor = () => {
  const errorRef = useRef([]);
  
  useEffect(() => {
    // Save the original console.error
    const originalError = console.error;
    
    // Override console.error to catch React DOM attribute warnings
    console.error = (...args) => {
      // Store the errors we care about
      const errorMsg = args[0];
      if (typeof errorMsg === 'string' && 
          (errorMsg.includes('non-boolean attribute') || 
           errorMsg.includes('Received NaN for the `children`'))) {
        errorRef.current.push({
          time: new Date().toISOString(),
          message: errorMsg,
          stack: new Error().stack
        });
        
        // Log more details to help trace the issue
        console.warn('Debug caught DOM attribute warning:', {
          message: errorMsg,
          componentTrace: new Error().stack
        });
      }
      
      // Call the original console.error
      originalError.apply(console, args);
    };
    
    // Clean up
    return () => {
      console.error = originalError;
    };
  }, []);
  
  return null; // This component doesn't render anything
};

export default DebugMonitor;
