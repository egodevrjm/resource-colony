// src/components/ParticleEffect.js
import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

// Define a float animation for particles
const float = keyframes`
  0% {
    transform: translateY(0px) translateX(0px);
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  80% {
    opacity: 0.7;
  }
  100% {
    transform: translateY(-40px) translateX(${props => props.direction * 20}px);
    opacity: 0;
  }
`;

const ParticleContainer = styled.div`
  position: absolute;
  bottom: ${props => props.bottom || '70px'};
  left: ${props => props.left || '50%'};
  width: 10px;
  height: 10px;
  pointer-events: none;
  z-index: 10;
`;

const Particle = styled.div`
  position: absolute;
  width: ${props => props.size || '6px'};
  height: ${props => props.size || '6px'};
  background: ${props => props.color || 'rgba(255, 255, 255, 0.8)'};
  border-radius: 50%;
  opacity: 0;
  animation: ${float} ${props => props.duration || '3s'} ease-out forwards;
  animation-delay: ${props => props.delay || '0s'};
`;

const ParticleEffect = ({ 
  color = 'rgba(255, 255, 255, 0.8)', 
  position = { bottom: '70px', left: '50%' },
  count = 5,
  interval = null, // Set to a number to create continuous particles
  trigger = null,  // Alternatively, trigger a single burst
  duration = 3,
  size = '6px'
}) => {
  const [particles, setParticles] = useState([]);
  const [triggerCount, setTriggerCount] = useState(0);
  
  // Helper function to create particles
  const createParticles = () => {
    const newParticles = [];
    
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: Date.now() + i,
        size: `${Math.random() * 2 + parseFloat(size.replace('px', ''))}px`,
        duration: `${Math.random() * 1 + duration}s`,
        delay: `${Math.random() * 1.5}s`,
        direction: Math.random() * 2 - 1, // Random direction left or right
      });
    }
    
    return newParticles;
  };
  
  // Effect for continuous particles
  useEffect(() => {
    if (interval === null) return;
    
    const intervalId = setInterval(() => {
      setParticles(prev => [...prev, ...createParticles()]);
      
      // Cleanup old particles after they've completed animation
      setTimeout(() => {
        setParticles(prev => {
          const now = Date.now();
          return prev.filter(p => now - p.id < duration * 1000 + 2000);
        });
      }, (duration + 2) * 1000);
    }, interval);
    
    return () => clearInterval(intervalId);
  }, [interval, count, duration]);
  
  // Effect for trigger-based particles
  useEffect(() => {
    if (trigger === null) return;
    if (trigger === triggerCount) return;
    
    setTriggerCount(trigger);
    setParticles(prev => [...prev, ...createParticles()]);
    
    // Cleanup old particles after they've completed animation
    setTimeout(() => {
      setParticles(prev => {
        const now = Date.now();
        return prev.filter(p => now - p.id < duration * 1000 + 2000);
      });
    }, (duration + 2) * 1000);
  }, [trigger, count, duration, triggerCount]);
  
  return (
    <ParticleContainer bottom={position.bottom} left={position.left}>
      {particles.map(particle => (
        <Particle
          key={particle.id}
          color={color}
          size={particle.size}
          duration={particle.duration}
          delay={particle.delay}
          direction={particle.direction}
        />
      ))}
    </ParticleContainer>
  );
};

export default ParticleEffect;