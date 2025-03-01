// src/components/ResourceAnimation.js
import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

// Floating animation for resource collection
const floatUp = keyframes`
  0% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  50% {
    transform: translateY(-40px) scale(1.3);
    opacity: 0.8;
  }
  100% {
    transform: translateY(-100px) scale(1.1);
    opacity: 0;
  }
`;

// Pulse animation for resource value
const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
`;

const AnimationContainer = styled.div`
  position: fixed;
  pointer-events: none;
  z-index: 1000;
`;

const FloatingValue = styled.div`
  position: absolute;
  color: ${props => props.color || 'white'};
  font-weight: bold;
  font-size: ${props => props.size || '1.5rem'};
  text-shadow: 0 0 4px rgba(0, 0, 0, 0.5), 0 0 2px rgba(0, 0, 0, 0.7);
  animation: ${floatUp} 1.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  animation-delay: ${props => props.delay || '0s'};
  user-select: none;
  z-index: 1005;
`;

const ResourceParticle = styled.div`
  position: absolute;
  width: ${props => props.size || '8px'};
  height: ${props => props.size || '8px'};
  background-color: ${props => props.color || 'white'};
  border-radius: 50%;
  transform: translate(-50%, -50%);
  opacity: 0.8;
  box-shadow: 0 0 ${props => props.size || '8px'} ${props => props.color || 'white'};
  animation: ${floatUp} ${props => props.duration || '1s'} cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  animation-delay: ${props => props.delay || '0s'};
`;

const ValuePulse = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.color || 'white'};
  font-weight: bold;
  font-size: ${props => props.size || '1.2rem'};
  text-shadow: 0 0 4px rgba(0, 0, 0, 0.5);
  animation: ${pulse} 0.5s ease-out forwards;
  user-select: none;
`;

// Generate a random number within a range
const getRandomInRange = (min, max) => {
  return Math.random() * (max - min) + min;
};

// Component to generate a floating value animation
export const FloatingValueAnimation = ({ x, y, value, color }) => {
  // Randomize the x position slightly
  const posX = x + getRandomInRange(-20, 20);
  const delay = getRandomInRange(0, 0.2) + 's';
  const size = value > 1 ? '1.8rem' : '1.5rem';
  
  return (
    <FloatingValue 
      style={{ 
        left: posX,
        top: y
      }}
      color={color}
      size={size}
      delay={delay}
    >
      +{value}
    </FloatingValue>
  );
};

// Component to create multiple particles scattered from a point
export const ParticleEffect = ({ x, y, count = 10, color }) => {
  const particles = [];
  
  for (let i = 0; i < count; i++) {
    const size = `${getRandomInRange(4, 12)}px`;
    const angle = getRandomInRange(0, Math.PI * 2);
    const distance = getRandomInRange(15, 50);
    const duration = `${getRandomInRange(0.8, 2.0)}s`;
    const delay = `${getRandomInRange(0, 0.3)}s`;
    
    // Calculate position based on angle and distance
    const particleX = x + Math.cos(angle) * distance;
    const particleY = y + Math.sin(angle) * distance;
    
    particles.push(
      <ResourceParticle
        key={i}
        style={{
          left: particleX,
          top: particleY
        }}
        size={size}
        color={color}
        duration={duration}
        delay={delay}
      />
    );
  }
  
  return <>{particles}</>;
};

// Component to display a pulsing value animation
export const ValuePulseAnimation = ({ x, y, value, color }) => {
  return (
    <ValuePulse
      style={{
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)'
      }}
      color={color}
    >
      +{value}
    </ValuePulse>
  );
};

// Main component that handles all resource animations
const ResourceAnimation = () => {
  const [animations, setAnimations] = useState([]);
  
  useEffect(() => {
    // Listen for resource collected events
    const handleResourceCollected = (event) => {
      const { resource, amount, x, y } = event.detail;
      
      // Map resource types to colors
      const resourceColors = {
        energy: '#f6ad55',
        minerals: '#63b3ed',
        food: '#68d391',
        water: '#4299e1',
        research: '#9f7aea',
        population: '#fc8181',
        components: '#a0aec0'
      };
      
      const color = resourceColors[resource] || 'white';
      
      // Add new animation
      const newAnimation = {
        id: Date.now() + Math.random(),
        type: 'resource',
        x,
        y,
        value: amount,
        color,
        timestamp: Date.now()
      };
      
      setAnimations(prev => [...prev, newAnimation]);
      
      // Clean up old animations after a delay
      setTimeout(() => {
        setAnimations(prev => prev.filter(a => a.id !== newAnimation.id));
      }, 2000);
    };
    
    window.addEventListener('resourceCollected', handleResourceCollected);
    
    return () => {
      window.removeEventListener('resourceCollected', handleResourceCollected);
    };
  }, []);
  
  if (animations.length === 0) return null;
  
  return (
    <AnimationContainer>
      {animations.map(animation => (
        <React.Fragment key={animation.id}>
          <FloatingValueAnimation
            x={animation.x}
            y={animation.y}
            value={animation.value}
            color={animation.color}
          />
          <ParticleEffect
            x={animation.x}
            y={animation.y}
            count={12}
            color={animation.color}
          />
        </React.Fragment>
      ))}
    </AnimationContainer>
  );
};

export default ResourceAnimation;
