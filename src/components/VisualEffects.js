// src/components/VisualEffects.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const EffectsContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
  overflow: hidden;
`;

// Resource collection animation
const ResourceCollected = styled.div`
  position: absolute;
  color: ${props => props.color || '#4a5568'};
  font-weight: bold;
  font-size: 16px;
  pointer-events: none;
  opacity: 0;
  transform: translateY(0);
  animation: floatAndFade 1s ease-out forwards;
  
  @keyframes floatAndFade {
    0% {
      opacity: 0;
      transform: translateY(0);
    }
    20% {
      opacity: 1;
      transform: translateY(-10px);
    }
    100% {
      opacity: 0;
      transform: translateY(-30px);
    }
  }
`;

// Building purchased animation
const BuildingPurchased = styled.div`
  position: absolute;
  background: ${props => props.color || '#4299e1'};
  color: white;
  font-weight: bold;
  font-size: 14px;
  padding: 4px 8px;
  border-radius: 4px;
  pointer-events: none;
  opacity: 0;
  animation: popAndFade 1.5s ease-out forwards;
  
  @keyframes popAndFade {
    0% {
      opacity: 0;
      transform: scale(0.7);
    }
    20% {
      opacity: 1;
      transform: scale(1.1);
    }
    40% {
      transform: scale(1);
    }
    80% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
`;

// Research completed animation
const ResearchCompleted = styled.div`
  position: absolute;
  background: rgba(159, 122, 234, 0.9);
  color: white;
  font-weight: bold;
  font-size: 14px;
  padding: 8px 12px;
  border-radius: 4px;
  pointer-events: none;
  opacity: 0;
  animation: slideAndFade 2s ease-out forwards;
  
  @keyframes slideAndFade {
    0% {
      opacity: 0;
      transform: translateY(20px);
    }
    20% {
      opacity: 1;
      transform: translateY(0);
    }
    80% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
`;

const VisualEffects = () => {
  const [effects, setEffects] = useState([]);
  
  // Listen for custom events to trigger visual effects
  useEffect(() => {
    const handleResourceCollected = (event) => {
      const { resource, amount, x, y } = event.detail;
      
      // Map resources to colors
      const resourceColors = {
        energy: '#f6ad55',
        minerals: '#63b3ed',
        food: '#68d391',
        water: '#4299e1',
        research: '#9f7aea',
        population: '#fc8181',
        components: '#a0aec0'
      };
      
      const newEffect = {
        id: Date.now(),
        type: 'resourceCollected',
        text: `+${amount}`,
        color: resourceColors[resource] || '#4a5568',
        x,
        y,
        timestamp: Date.now()
      };
      
      setEffects(prev => [...prev, newEffect]);
      
      // Clean up effect after animation completes
      setTimeout(() => {
        setEffects(prev => prev.filter(effect => effect.id !== newEffect.id));
      }, 1000);
    };
    
    const handleBuildingPurchased = (event) => {
      const { building, x, y } = event.detail;
      
      const newEffect = {
        id: Date.now(),
        type: 'buildingPurchased',
        text: `Built ${building}`,
        color: '#48bb78',
        x,
        y,
        timestamp: Date.now()
      };
      
      setEffects(prev => [...prev, newEffect]);
      
      // Clean up effect after animation completes
      setTimeout(() => {
        setEffects(prev => prev.filter(effect => effect.id !== newEffect.id));
      }, 1500);
    };
    
    const handleResearchCompleted = (event) => {
      const { tech, x, y } = event.detail;
      
      const newEffect = {
        id: Date.now(),
        type: 'researchCompleted',
        text: `Research Complete: ${tech}`,
        x,
        y,
        timestamp: Date.now()
      };
      
      setEffects(prev => [...prev, newEffect]);
      
      // Clean up effect after animation completes
      setTimeout(() => {
        setEffects(prev => prev.filter(effect => effect.id !== newEffect.id));
      }, 2000);
    };
    
    // Register event listeners
    window.addEventListener('resourceCollected', handleResourceCollected);
    window.addEventListener('buildingPurchased', handleBuildingPurchased);
    window.addEventListener('researchCompleted', handleResearchCompleted);
    
    // Clean up event listeners on unmount
    return () => {
      window.removeEventListener('resourceCollected', handleResourceCollected);
      window.removeEventListener('buildingPurchased', handleBuildingPurchased);
      window.removeEventListener('researchCompleted', handleResearchCompleted);
    };
  }, []);
  
  return (
    <EffectsContainer>
      {effects.map(effect => {
        switch (effect.type) {
          case 'resourceCollected':
            return (
              <ResourceCollected 
                key={effect.id}
                style={{ top: effect.y, left: effect.x }}
                color={effect.color}
              >
                {effect.text}
              </ResourceCollected>
            );
          case 'buildingPurchased':
            return (
              <BuildingPurchased 
                key={effect.id}
                style={{ top: effect.y, left: effect.x }}
                color={effect.color}
              >
                {effect.text}
              </BuildingPurchased>
            );
          case 'researchCompleted':
            return (
              <ResearchCompleted 
                key={effect.id}
                style={{ top: effect.y, left: effect.x }}
              >
                {effect.text}
              </ResearchCompleted>
            );
          default:
            return null;
        }
      })}
    </EffectsContainer>
  );
};

export default VisualEffects;