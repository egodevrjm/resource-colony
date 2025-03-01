// SafeAttributeWrapper.js
// This is a more aggressive solution to catch and fix all attribute errors by intercepting React props

import React from 'react';

/**
 * HOC that ensures all custom attributes are safely handled
 * and converts boolean props to data attributes
 */
export const withSafeAttributes = (Component) => {
  return function SafeAttributeWrapper(props) {
    // Filter and transform unsafe attributes
    const safeProps = {};
    const dataAttributes = {};
    
    Object.entries(props).forEach(([key, value]) => {
      // Skip children and event handlers (they're safe)
      if (key === 'children' || key.startsWith('on')) {
        safeProps[key] = value;
        return;
      }
      
      // Handle boolean attributes by converting them to data attributes
      if (typeof value === 'boolean') {
        // Don't pass boolean attributes directly to DOM
        dataAttributes[`data-${key.toLowerCase()}`] = value ? 'true' : 'false';
        // But keep the original in safeProps for styled-components to use
        safeProps[key] = value;
        return;
      }
      
      // Handle numeric values
      if (typeof value === 'number' && isNaN(value)) {
        // Convert NaN to empty string
        safeProps[key] = '';
        return;
      }
      
      // Keep all other props as they are
      safeProps[key] = value;
    });
    
    // Merge the data attributes back into safeProps
    return <Component {...safeProps} {...dataAttributes} />;
  };
};

/**
 * HOC specifically for styled components to prevent them from
 * passing unwanted props to DOM elements
 */
export const createSafeStyledComponent = (StyledComponent, propsToFilter = []) => {
  return function SafeStyledComponent({ children, ...props }) {
    const safeProps = { ...props };
    
    // Remove explicitly listed props
    propsToFilter.forEach(prop => {
      delete safeProps[prop];
    });
    
    // Handle common problematic attributes by default
    const commonProps = ['unlocked', 'locked', 'clickable', 'active', 'danger', 'primary'];
    commonProps.forEach(prop => {
      if (prop in safeProps) {
        // Set data attribute instead
        safeProps[`data-${prop}`] = safeProps[prop] ? 'true' : 'false';
        // Keep original for styled components
        // But don't let it get passed to DOM
        Object.defineProperty(safeProps, prop, {
          value: props[prop],
          enumerable: false
        });
      }
    });
    
    return <StyledComponent {...safeProps}>{children}</StyledComponent>;
  };
};

/**
 * Safe numerical display component
 */
export const SafeNumber = ({ value, defaultValue = '0', format = null }) => {
  // Handle NaN, undefined, null
  if (value === null || value === undefined || isNaN(value)) {
    return <>{defaultValue}</>;
  }
  
  // Format if function is provided
  if (format && typeof format === 'function') {
    return <>{format(value)}</>;
  }
  
  // Round to integer if no format
  return <>{Math.floor(value)}</>;
};
