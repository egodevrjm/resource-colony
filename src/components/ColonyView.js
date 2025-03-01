// src/components/ColonyView.js
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { FaSun, FaCubes, FaAppleAlt, FaWater, FaFlask, FaUsers, FaCogs, FaHome, FaIndustry, FaSatelliteDish, FaDragon } from 'react-icons/fa';
import BuildingAnimation from './BuildingAnimation';
import ParticleEffect from './ParticleEffect';

const ViewContainer = styled.div`
  background: #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
  overflow: hidden;
`;

const ColonyTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 16px;
  color: #2d3748;
  font-size: 1.2rem;
  border-bottom: 1px solid #cbd5e0;
  padding-bottom: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ToggleButton = styled.button`
  background: #4a6fa5;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 0.8rem;
  cursor: pointer;
  
  &:hover {
    background: #3a5a8a;
  }
`;

const ColonyViewport = styled.div`
  position: relative;
  height: ${props => props.isExpanded ? '300px' : '150px'};
  background: linear-gradient(to bottom, #87ceeb 0%, #87ceeb 60%, #8b4513 60%, #8b4513 100%);
  border-radius: 6px;
  overflow: hidden;
  transition: height 0.3s ease-in-out;
`;

const BuildingContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 40%;
  display: flex;
  align-items: flex-end;
  padding: 0 10px;
`;

const Building = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 5px;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const BuildingIcon = styled.div`
  font-size: ${props => props.size || '24px'};
  color: ${props => props.color || '#4a5568'};
  background: ${props => props.background || 'transparent'};
  padding: ${props => props.padding || '0'};
  border-radius: 4px;
  margin-bottom: 2px;
  position: relative;
  
  ${props => props.count > 1 && `
    &::after {
      content: '${props.count}';
      position: absolute;
      top: -5px;
      right: -8px;
      background: #4a6fa5;
      color: white;
      border-radius: 50%;
      width: 16px;
      height: 16px;
      font-size: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `}
`;

const BuildingName = styled.div`
  font-size: 8px;
  color: #4a5568;
  text-align: center;
  max-width: 50px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Sun = styled.div`
  position: absolute;
  top: 20px;
  right: 40px;
  width: 40px;
  height: 40px;
  background: #ffd700;
  border-radius: 50%;
  box-shadow: 0 0 20px #ffd700;
`;

const Cloud = styled.div`
  position: absolute;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  width: ${props => props.size || '60px'};
  height: ${props => props.size || '20px'};
  top: ${props => props.top || '30px'};
  left: ${props => props.left || '50px'};
`;

const ResourceIndicator = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: ${props => props.color || '#4a5568'};
  opacity: 0;
  transform: translateY(0);
  animation: float 1.5s ease-out forwards;
  
  @keyframes float {
    0% {
      opacity: 0;
      transform: translateY(0);
    }
    20% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: translateY(-30px);
    }
  }
`;

const ColonyView = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [resourceIndicators, setResourceIndicators] = useState([]);
  const buildings = useSelector(state => state.game.buildings);
  const productionRates = useSelector(state => 
    Object.entries(state.game.resources).reduce((rates, [key, _]) => {
      rates[key] = 0;
      return rates;
    }, {})
  );
  
  // Debug logs to check component rendering
  useEffect(() => {
    console.log('ColonyView mounted');
    console.log('Buildings state:', buildings);
  }, [buildings]);
  
  // Map building types to visual representations
  const buildingConfig = {
    solarPanel: { 
      icon: <FaSun />, 
      color: '#f6ad55',
      background: '#f6ad554d',
      padding: '5px',
      size: '20px',
      name: 'Solar Panel'
    },
    mine: { 
      icon: <FaCubes />, 
      color: '#63b3ed',
      background: '#63b3ed4d',
      padding: '5px',
      size: '20px',
      name: 'Mine'
    },
    farm: { 
      icon: <FaAppleAlt />, 
      color: '#68d391',
      background: '#68d3914d',
      padding: '5px',
      size: '20px',
      name: 'Farm'
    },
    waterExtractor: { 
      icon: <FaWater />, 
      color: '#4299e1',
      background: '#4299e14d',
      padding: '5px',
      size: '20px',
      name: 'Water Extractor'
    },
    researchLab: { 
      icon: <FaFlask />, 
      color: '#9f7aea',
      background: '#9f7aea4d',
      padding: '5px',
      size: '20px',
      name: 'Research Lab'
    },
    habitat: { 
      icon: <FaHome />, 
      color: '#fc8181',
      background: '#fc81814d',
      padding: '5px',
      size: '20px',
      name: 'Habitat'
    },
    factory: { 
      icon: <FaIndustry />, 
      color: '#a0aec0',
      background: '#a0aec04d',
      padding: '5px',
      size: '20px',
      name: 'Factory'
    },
    advancedSolarArray: { 
      icon: <FaSatelliteDish />, 
      color: '#f6ad55',
      background: '#f6ad554d',
      padding: '5px',
      size: '20px',
      name: 'Advanced Solar Array'
    },
    deepDrillingSite: { 
      icon: <FaDragon />, 
      color: '#63b3ed',
      background: '#63b3ed4d',
      padding: '5px',
      size: '20px',
      name: 'Deep Drilling Site'
    }
  };
  
  // Resource colors for indicators
  const resourceColors = {
    energy: '#f6ad55',
    minerals: '#63b3ed',
    food: '#68d391',
    water: '#4299e1',
    research: '#9f7aea',
    population: '#fc8181',
    components: '#a0aec0'
  };
  
  // Add resource production indicators
  useEffect(() => {
    // Get buildings with counts > 0
    const activeBuildings = Object.entries(buildings)
      .filter(([_, building]) => building.count > 0);
    
    if (activeBuildings.length === 0) return;
    
    // Every few seconds, show resource production indicators
    const intervalId = setInterval(() => {
      // Pick a random building that has a count > 0
      const randomIndex = Math.floor(Math.random() * activeBuildings.length);
      const [buildingType, building] = activeBuildings[randomIndex];
      
      // Get the resources it produces
      const resources = Object.entries(building.baseOutput);
      if (resources.length === 0) return;
      
      // Pick a random resource it produces
      const randomResourceIndex = Math.floor(Math.random() * resources.length);
      const [resourceType, _] = resources[randomResourceIndex];
      
      // Add a new indicator
      const newIndicator = {
        id: Date.now(),
        buildingType,
        resourceType,
        left: 40 + Math.random() * 60, // Random position
        color: resourceColors[resourceType] || '#4a5568'
      };
      
      setResourceIndicators(prev => [...prev, newIndicator]);
      
      // Remove the indicator after animation completes
      setTimeout(() => {
        setResourceIndicators(prev => 
          prev.filter(indicator => indicator.id !== newIndicator.id)
        );
      }, 1500); // Match the animation duration
    }, 2000); // Every 2 seconds
    
    return () => clearInterval(intervalId);
  }, [buildings]);
  
  // Get all buildings with a count > 0, sorted by type
  const visibleBuildings = Object.entries(buildings)
    .filter(([_, building]) => building.count > 0)
    .sort(([keyA, _], [keyB, __]) => keyA.localeCompare(keyB));
  
  return (
    <ViewContainer>
      <ColonyTitle>
        Colony Overview
        <ToggleButton onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? 'Collapse' : 'Expand'}
        </ToggleButton>
      </ColonyTitle>
      
      <ColonyViewport isExpanded={isExpanded}>
        {/* Sky elements */}
        <Sun />
        <Cloud size="60px" top="30px" left="50px" />
        <Cloud size="40px" top="50px" left="150px" />
        <Cloud size="50px" top="20px" left="250px" />
        
        {/* Resource production indicators */}
        {resourceIndicators.map(indicator => (
          <ResourceIndicator 
            key={indicator.id}
            style={{ 
              bottom: '60px',
              left: `${indicator.left}%` 
            }}
            color={indicator.color}
          >
            +1
          </ResourceIndicator>
        ))}
        
        {/* Buildings */}
        <BuildingContainer>
          {/* Add particles for each active building type */}
          {visibleBuildings.map(([key, building], index) => {
            if (building.count > 0) {
              // Generate different colors for different resource types
              const resourceColors = {
                energy: 'rgba(246, 173, 85, 0.7)', // Solar panel (energy)
                minerals: 'rgba(99, 179, 237, 0.7)', // Mine (minerals)
                food: 'rgba(104, 211, 145, 0.7)',   // Farm (food)
                water: 'rgba(66, 153, 225, 0.7)',   // Water extractor (water)
                research: 'rgba(159, 122, 234, 0.7)', // Research lab (research)
                population: 'rgba(252, 129, 129, 0.7)', // Habitat (population)
                components: 'rgba(160, 174, 192, 0.7)'  // Factory (components)
              };
              
              // Determine which resource type this building produces
              const resourceType = Object.keys(building.baseOutput)[0] || 'energy';
              const particleColor = resourceColors[resourceType] || 'rgba(255, 255, 255, 0.7)';
              
              return (
                <ParticleEffect 
                  key={`particles-${key}`}
                  color={particleColor}
                  position={{ 
                    bottom: '70px', 
                    left: `${20 + index * 60}px`
                  }}
                  count={Math.min(building.count, 3)}
                  interval={10000} // Generate particles every 10 seconds
                  duration={4}
                />
              );
            }
            return null;
          })}
          
          {visibleBuildings.length === 0 ? (
            <BuildingName style={{ fontSize: '12px', marginBottom: '10px' }}>
              Start building your colony!
            </BuildingName>
          ) : (
            visibleBuildings.map(([key, building]) => {
              const config = buildingConfig[key] || {
                icon: <FaCogs />,
                color: '#4a5568',
                name: building.name || key
              };
              
              return (
                <Building key={key}>
                  <BuildingAnimation 
                    buildingType={key}
                    color={config.color}
                    isActive={building.count > 0}
                    shimmerEnabled={building.count > 1}
                  >
                    <BuildingIcon 
                      color={config.color}
                      background={config.background}
                      padding={config.padding}
                      size={config.size}
                      count={building.count}
                    >
                      {config.icon}
                    </BuildingIcon>
                  </BuildingAnimation>
                  <BuildingName>{config.name}</BuildingName>
                </Building>
              );
            })
          )}
        </BuildingContainer>
      </ColonyViewport>
    </ViewContainer>
  );
};

export default ColonyView;