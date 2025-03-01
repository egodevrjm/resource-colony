// SafeWrappers.js - Utility components to safely handle attributes

import React from 'react';
import styled from 'styled-components';

// Safely handle canAfford attribute
export const SafeCostItem = styled(({ canAfford, ...rest }) => <span {...rest} />)`
  display: inline-flex;
  align-items: center;
  margin-right: 8px;
  font-size: 0.8rem;
  color: ${props => props.canAfford ? '#4a5568' : '#e53e3e'};
`;

// Safely handle unlocked attribute in filter functions
export const isUnlocked = (entity) => {
  // If it's a boolean, we can directly compare
  if (typeof entity.unlocked === 'boolean') {
    return entity.unlocked === true;
  }
  // If it's undefined, we'll consider it not unlocked
  return false;
};

// Safely handle values to avoid NaN
export const safeNumber = (value, defaultValue = 0) => {
  if (value === undefined || value === null || isNaN(value)) {
    return defaultValue;
  }
  return value;
};

// Safe string formatter (handles NaN, null, undefined)
export const safeString = (value, defaultValue = '') => {
  if (value === undefined || value === null) {
    return defaultValue;
  }
  if (typeof value === 'number' && isNaN(value)) {
    return defaultValue;
  }
  return String(value);
};

// Helper for debug output
export const debugObject = (obj) => {
  console.log("Debug:", 
    JSON.stringify(
      obj, 
      (key, value) => {
        if (typeof value === 'number' && isNaN(value)) {
          return 'NaN';
        }
        return value;
      },
      2
    )
  );
};
