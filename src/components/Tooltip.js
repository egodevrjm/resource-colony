// src/components/Tooltip.js
import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const TooltipContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const TooltipContent = styled.div`
  visibility: ${props => props.visible ? 'visible' : 'hidden'};
  opacity: ${props => props.visible ? 1 : 0};
  position: absolute;
  z-index: 1000;
  background-color: var(--tooltipBackground, rgba(45, 55, 72, 0.95));
  color: var(--tooltipText, white);
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  font-size: 0.875rem;
  max-width: 250px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
  transition: opacity 0.2s, visibility 0.2s, transform 0.2s;
  transform: translateY(${props => props.visible ? '0' : '4px'});
  pointer-events: none;

  ${props => {
    switch (props.position) {
      case 'top':
        return `
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%) translateY(${props.visible ? '-8px' : '-4px'});
          margin-bottom: 8px;
          
          &::after {
            content: '';
            position: absolute;
            top: 100%;
            left: 50%;
            margin-left: -5px;
            border-width: 5px;
            border-style: solid;
            border-color: var(--tooltipBackground, rgba(45, 55, 72, 0.95)) transparent transparent transparent;
          }
        `;
      case 'bottom':
        return `
          top: 100%;
          left: 50%;
          transform: translateX(-50%) translateY(${props.visible ? '8px' : '4px'});
          margin-top: 8px;
          
          &::after {
            content: '';
            position: absolute;
            bottom: 100%;
            left: 50%;
            margin-left: -5px;
            border-width: 5px;
            border-style: solid;
            border-color: transparent transparent var(--tooltipBackground, rgba(45, 55, 72, 0.95)) transparent;
          }
        `;
      case 'left':
        return `
          top: 50%;
          right: 100%;
          transform: translateY(-50%) translateX(${props.visible ? '-8px' : '-4px'});
          margin-right: 8px;
          
          &::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 100%;
            margin-top: -5px;
            border-width: 5px;
            border-style: solid;
            border-color: transparent transparent transparent var(--tooltipBackground, rgba(45, 55, 72, 0.95));
          }
        `;
      case 'right':
      default:
        return `
          top: 50%;
          left: 100%;
          transform: translateY(-50%) translateX(${props.visible ? '8px' : '4px'});
          margin-left: 8px;
          
          &::after {
            content: '';
            position: absolute;
            top: 50%;
            right: 100%;
            margin-top: -5px;
            border-width: 5px;
            border-style: solid;
            border-color: transparent var(--tooltipBackground, rgba(45, 55, 72, 0.95)) transparent transparent;
          }
        `;
    }
  }}
`;

const Tooltip = ({ 
  children, 
  content, 
  position = 'top', 
  delay = 300,
  width,
  className,
  disabled = false
}) => {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef(null);
  
  const showTooltip = () => {
    if (disabled) return;
    
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setVisible(true);
    }, delay);
  };
  
  const hideTooltip = () => {
    clearTimeout(timeoutRef.current);
    setVisible(false);
  };
  
  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);
  
  return (
    <TooltipContainer 
      className={className}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      <TooltipContent 
        visible={visible} 
        position={position}
        style={{ width: width }}
      >
        {content}
      </TooltipContent>
    </TooltipContainer>
  );
};

export default Tooltip;