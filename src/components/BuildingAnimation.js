// src/components/BuildingAnimation.js
import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

// Pulse animation for buildings that are actively producing
const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.08);
    opacity: 0.85;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

// Shimmer effect for resource generation
const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const AnimationContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const PulseEffect = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 4px;
  animation: ${pulse} 2s infinite ease-in-out;
  z-index: -1;
  background-color: ${props => props.color || '#4299e1'};
  opacity: 0.3;
`;

const ShimmerEffect = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.4) 50%,
    transparent 100%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite linear;
  z-index: -1;
  opacity: 0.5;
  border-radius: 4px;
`;

const BuildingAnimation = ({ 
  children, 
  buildingType,
  isActive = true,
  color = '#4299e1',
  pulseDuration = 2,
  shimmerEnabled = true
}) => {
  const [shouldPulse, setShouldPulse] = useState(isActive);
  const [shouldShimmer, setShouldShimmer] = useState(isActive && shimmerEnabled);
  
  // Switch between animations to create visual interest
  useEffect(() => {
    if (!isActive) {
      setShouldPulse(false);
      setShouldShimmer(false);
      return;
    }
    
    let pulseInterval, shimmerInterval;
    
    // Randomize pulse effect to prevent all buildings pulsing in sync
    const initialPulseDelay = Math.random() * 2000;
    const pulseDurationMs = pulseDuration * 1000;
    
    const pulseTimer = setTimeout(() => {
      setShouldPulse(true);
      
      pulseInterval = setInterval(() => {
        setShouldPulse(prev => !prev);
      }, pulseDurationMs * 3); // Pulse every 3x duration
    }, initialPulseDelay);
    
    if (shimmerEnabled) {
      // Randomize shimmer effect as well
      const initialShimmerDelay = Math.random() * 2000 + 1000;
      
      const shimmerTimer = setTimeout(() => {
        shimmerInterval = setInterval(() => {
          // Briefly show shimmer effect
          setShouldShimmer(true);
          
          // Then hide it after a short period
          setTimeout(() => {
            setShouldShimmer(false);
          }, 1500);
        }, 5000 + Math.random() * 3000); // Random interval between 5-8 seconds
      }, initialShimmerDelay);
      
      return () => {
        clearTimeout(pulseTimer);
        clearTimeout(shimmerTimer);
        clearInterval(pulseInterval);
        clearInterval(shimmerInterval);
      };
    } else {
      return () => {
        clearTimeout(pulseTimer);
        clearInterval(pulseInterval);
      };
    }
  }, [isActive, pulseDuration, shimmerEnabled]);
  
  return (
    <AnimationContainer>
      {shouldPulse && <PulseEffect color={color} />}
      {shouldShimmer && <ShimmerEffect />}
      {children}
    </AnimationContainer>
  );
};

export default BuildingAnimation;