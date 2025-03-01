// src/components/ColonyVisualizer.js
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled, { keyframes, css } from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { 
  FaSun, FaCubes, FaAppleAlt, FaWater, FaFlask, FaUsers, 
  FaCogs, FaHome, FaIndustry, FaSatelliteDish, FaDragon,
  FaTree, FaMountain, FaCloud, FaCloudRain, FaStar, FaRocket,
  FaBiohazard, FaWind, FaLeaf, FaMoon
} from 'react-icons/fa';

const ViewContainer = styled.div`
  background: var(--cardBackground);
  border-radius: 8px;
  padding: 16px;
  box-shadow: var(--panelShadow);
  margin-top: 20px;
`;

const VisualizerTitle = styled.h2`
  margin-top: 0;
  margin-bottom: 16px;
  color: var(--text);
  font-size: 1.2rem;
  border-bottom: 1px solid var(--border);
  padding-bottom: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ControlPanel = styled.div`
  display: flex;
  gap: 8px;
`;

const ControlButton = styled.button`
  background: var(--primaryButton);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 0.8rem;
  cursor: pointer;
  
  &:hover {
    background: var(--primaryButtonHover);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const shimmer = keyframes`
  0% { opacity: 0.7; }
  50% { opacity: 1; }
  100% { opacity: 0.7; }
`;

const move = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(20px); }
`;

const twinkle = keyframes`
  0% { opacity: 0.3; }
  50% { opacity: 1; }
  100% { opacity: 0.3; }
`;

const ColonyScene = styled.div`
  position: relative;
  height: ${props => props.isExpanded ? '500px' : '250px'};
  background: ${props => {
    if (props.theme === 'space') {
      return 'linear-gradient(to bottom, #050c2e 0%, #0a1550 60%, #20093d 60%, #150729 100%)';
    } else if (props.isDark) {
      return 'linear-gradient(to bottom, #1a365d 0%, #2a4365 60%, #513224 60%, #3c271a 100%)';
    } else {
      return 'linear-gradient(to bottom, #87ceeb 0%, #87ceeb 60%, #8b4513 60%, #8b4513 100%)';
    }
  }};
  border-radius: 8px;
  overflow: hidden;
  transition: height 0.3s ease-in-out, background 0.3s ease;
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.2);
`;

const SunOrMoon = styled.div`
  position: absolute;
  top: ${props => props.isNight ? '40px' : '30px'};
  right: ${props => props.isNight ? '60px' : '80px'};
  width: ${props => props.isNight ? '30px' : '50px'};
  height: ${props => props.isNight ? '30px' : '50px'};
  background: ${props => {
    if (props.theme === 'space') {
      return props.isNight ? '#e2e8f0' : '#ff6b6b';
    }
    return props.isNight ? '#e2e8f0' : '#ffd700';
  }};
  border-radius: 50%;
  box-shadow: 0 0 20px ${props => {
    if (props.theme === 'space') {
      return props.isNight ? '#e2e8f0' : '#ff6b6b';
    }
    return props.isNight ? '#e2e8f0' : '#ffd700';
  }};
  z-index: 1;
  animation: ${shimmer} 4s infinite ease-in-out;
`;

const Star = styled.div`
  position: absolute;
  width: ${props => props.size || '2px'};
  height: ${props => props.size || '2px'};
  background: white;
  border-radius: 50%;
  box-shadow: 0 0 ${props => props.glow || '2px'} white;
  opacity: ${props => {
    if (props.theme === 'space') return 1;
    return props.isNight ? 1 : 0;
  }};
  transition: opacity 1s ease;
  z-index: 1;
  animation: ${props => props.twinkle ? css`${twinkle} ${props.twinkleDuration || '3s'} infinite ease-in-out` : 'none'};
`;

const Cloud = styled.div`
  position: absolute;
  color: ${props => {
    if (props.theme === 'space') {
      return 'rgba(99, 102, 241, 0.3)';
    }
    return props.isDark ? '#8496b0' : 'rgba(255, 255, 255, 0.9)';
  }};
  font-size: ${props => props.size || '40px'};
  top: ${props => props.top || '30px'};
  left: ${props => props.left || '50px'};
  z-index: 2;
  animation: ${props => css`
    ${float} ${props.duration || '6s'} infinite ease-in-out, 
    ${move} ${props.moveDuration || '60s'} infinite alternate linear
  `};
  opacity: ${props => {
    if (props.theme === 'space') {
      return 0.4; // Lower opacity for space theme
    }
    return props.isNight ? 0.6 : 1;
  }};
  transition: opacity 1s ease, color 0.3s ease;
  display: ${props => props.theme === 'space' && !props.showInSpace ? 'none' : 'block'};
`;

const Rain = styled.div`
  position: absolute;
  top: ${props => props.top || '70px'};
  left: ${props => props.left || '60px'};
  color: ${props => {
    if (props.theme === 'space') {
      return '#a78bfa';
    }
    return props.isDark ? '#4299e1' : '#63b3ed';
  }};
  font-size: ${props => props.size || '30px'};
  z-index: 3;
  opacity: ${props => props.isRaining ? 1 : 0};
  transition: opacity 0.5s ease;
  animation: ${props => css`${float} 3s infinite ease-in-out`};
  display: ${props => props.theme === 'space' ? 'none' : 'block'};
`;

const Mountain = styled.div`
  position: absolute;
  color: ${props => {
    if (props.theme === 'space') {
      return '#4f46e5';
    }
    return props.isDark ? '#4a5568' : '#718096';
  }};
  font-size: ${props => props.size || '60px'};
  bottom: ${props => props.bottom || '40%'};
  left: ${props => props.left || '10%'};
  z-index: 2;
  transform: ${props => props.flip ? 'scaleX(-1)' : 'none'};
`;

const Tree = styled.div`
  position: absolute;
  color: ${props => {
    if (props.theme === 'space') {
      return '#4f46e5';
    }
    return props.isDark ? '#276749' : '#38a169';
  }};
  font-size: ${props => props.size || '30px'};
  bottom: ${props => props.bottom || '40%'};
  left: ${props => props.left || '30%'};
  z-index: 3;
  animation: ${props => props.animate ? css`${float} 8s infinite ease-in-out` : 'none'};
  display: ${props => props.theme === 'space' && !props.showInSpace ? 'none' : 'block'};
`;

const BuildingLayer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 40%;
  display: flex;
  align-items: flex-end;
  padding: 0 10px;
  z-index: 5;
`;

const BuildingGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 5px;
  position: relative;
`;

const BuildingTooltip = styled.div`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: var(--tooltipBackground);
  color: var(--tooltipText);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s, visibility 0.2s;
  z-index: 10;
  
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: var(--tooltipBackground) transparent transparent transparent;
  }
`;

const BuildingStack = styled.div`
  position: relative;
  margin-bottom: 5px;
  cursor: pointer;
  
  &:hover ${BuildingTooltip} {
    opacity: 1;
    visibility: visible;
  }
`;

const BuildingIcon = styled.div`
  font-size: ${props => props.size || '24px'};
  color: ${props => props.color || '#4a5568'};
  background: ${props => props.background || 'transparent'};
  padding: ${props => props.padding || '0'};
  border-radius: 4px;
  position: relative;
  transition: transform 0.2s;
  margin-bottom: ${props => props.count > 1 ? '0' : '2px'};
  z-index: ${props => props.zIndex || 1};
  
  &:hover {
    transform: translateY(-5px);
  }
  
  animation: ${props => props.animate ? css`${pulse} ${props.duration || '2s'} infinite` : 'none'};
`;

const BuildingCount = styled.div`
  position: absolute;
  top: -5px;
  right: -8px;
  background: var(--primaryButton);
  color: white;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
`;

const BuildingName = styled.div`
  font-size: 8px;
  color: var(--text);
  text-align: center;
  max-width: 50px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ColonistArea = styled.div`
  position: absolute;
  bottom: 10px;
  right: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 10;
`;

const ColonistIcon = styled.div`
  font-size: 24px;
  color: #fc8181;
  margin-bottom: 4px;
  animation: ${css`${pulse} 3s infinite ease-in-out`};
`;

const ColonistCount = styled.div`
  font-size: 12px;
  color: white;
  background: #4a6fa5;
  border-radius: 10px;
  padding: 2px 8px;
  margin-bottom: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const EmptyColonyMessage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: var(--text);
  font-size: 14px;
  background: ${props => props.isDark ? 'rgba(45, 55, 72, 0.7)' : 'rgba(255, 255, 255, 0.7)'};
  padding: 10px 15px;
  border-radius: 6px;
  z-index: 10;
`;

const ResourceIndicator = styled.div`
  position: absolute;
  top: ${props => props.top || '45%'};
  left: ${props => props.left || '20%'};
  font-size: ${props => props.size || '20px'};
  color: ${props => props.color || 'white'};
  z-index: 4;
  animation: ${props => css`${float} ${props.duration || '4s'} infinite ease-in-out`};
  opacity: ${props => props.active ? 1 : 0};
  transition: opacity 0.5s ease;
`;

const EventOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${props => props.background || 'rgba(0, 0, 0, 0)'};
  z-index: 20;
  opacity: ${props => props.active ? 0.5 : 0};
  transition: opacity 0.5s ease;
  pointer-events: none;
`;

const EventIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 60px;
  color: ${props => props.color || 'white'};
  z-index: 21;
  animation: ${props => css`${pulse} 2s infinite ease-in-out`};
  opacity: ${props => props.active ? 1 : 0};
  transition: opacity 0.5s ease;
  pointer-events: none;
`;

const EventLabel = styled.div`
  position: absolute;
  top: 65%;
  left: 50%;
  transform: translateX(-50%);
  background: var(--cardBackground);
  color: var(--text);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 14px;
  z-index: 22;
  opacity: ${props => props.active ? 1 : 0};
  transition: opacity 0.5s ease;
  pointer-events: none;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
`;

const ColonyVisualizer = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isNight, setIsNight] = useState(false);
  const [isRaining, setIsRaining] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const buildings = useSelector(state => state.game.buildings);
  const resources = useSelector(state => state.game.resources);
  const events = useSelector(state => state.game.events);
  const { theme } = useTheme();
  const isDark = theme.name === 'dark';
  
  // Generate stars for night sky and space theme
  const [stars] = useState(() => {
    const starsArray = [];
    const starCount = 100; // More stars for better effect
    
    for (let i = 0; i < starCount; i++) {
      starsArray.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 60, // Allow stars to appear lower in the sky
        size: Math.random() * 3 + 1 + 'px',
        glow: Math.random() * 4 + 1 + 'px', // Variable glow effect
        twinkle: Math.random() > 0.7 // Some stars will twinkle
      });
    }
    return starsArray;
  });
  
  // Map building types to visual representations
  const buildingConfig = {
    solarPanel: { 
      icon: <FaSun />, 
      color: '#f6ad55',
      background: '#f6ad554d',
      padding: '5px',
      size: '24px',
      name: 'Solar Panel',
      group: 'energy',
      description: 'Generates energy from the sun',
      animate: true,
      duration: '3s'
    },
    mine: { 
      icon: <FaCubes />, 
      color: '#63b3ed',
      background: '#63b3ed4d',
      padding: '5px',
      size: '24px',
      name: 'Mine',
      group: 'resources',
      description: 'Extracts minerals from the surface'
    },
    farm: { 
      icon: <FaAppleAlt />, 
      color: '#68d391',
      background: '#68d3914d',
      padding: '5px',
      size: '24px',
      name: 'Farm',
      group: 'resources',
      description: 'Grows food for your colonists',
      animate: true,
      duration: '4s'
    },
    waterExtractor: { 
      icon: <FaWater />, 
      color: '#4299e1',
      background: '#4299e14d',
      padding: '5px',
      size: '24px',
      name: 'Water Extractor',
      group: 'resources',
      description: 'Pulls water from the atmosphere',
      animate: true,
      duration: '2.5s'
    },
    researchLab: { 
      icon: <FaFlask />, 
      color: '#9f7aea',
      background: '#9f7aea4d',
      padding: '5px',
      size: '24px',
      name: 'Research Lab',
      group: 'science',
      description: 'Generates research points for new technologies'
    },
    habitat: { 
      icon: <FaHome />, 
      color: '#fc8181',
      background: '#fc81814d',
      padding: '5px',
      size: '24px',
      name: 'Habitat',
      group: 'habitat',
      description: 'Houses colonists to grow your population'
    },
    factory: { 
      icon: <FaIndustry />, 
      color: '#a0aec0',
      background: '#a0aec04d',
      padding: '5px',
      size: '24px',
      name: 'Factory',
      group: 'industry',
      description: 'Produces components for advanced buildings'
    },
    advancedSolarArray: { 
      icon: <FaSatelliteDish />, 
      color: '#f6ad55',
      background: '#f6ad554d',
      padding: '5px',
      size: '24px',
      name: 'Advanced Solar Array',
      group: 'energy',
      description: 'High-efficiency energy generation',
      animate: true,
      duration: '2s'
    },
    deepDrillingSite: { 
      icon: <FaDragon />, 
      color: '#63b3ed',
      background: '#63b3ed4d',
      padding: '5px',
      size: '24px',
      name: 'Deep Drilling Site',
      group: 'resources',
      description: 'Extract minerals from deep underground'
    }
  };
  
  // Get all buildings with a count > 0
  const activeBuildings = Object.entries(buildings)
    .filter(([_, building]) => building && building.count > 0);
  
  // Group buildings by type
  const groupedBuildings = activeBuildings.reduce((groups, [key, building]) => {
    const config = buildingConfig[key] || { group: 'other' };
    if (!groups[config.group]) {
      groups[config.group] = [];
    }
    groups[config.group].push({ key, building, config });
    return groups;
  }, {});
  
  // Current population
  const population = Math.floor(resources.population || 0);
  
  // Event information
  const activeEvent = events?.active || null;
  let eventOverlay = {
    active: false,
    background: 'rgba(0, 0, 0, 0)',
    icon: null,
    color: 'white',
    label: ''
  };
  
  if (activeEvent) {
    switch(activeEvent.id) {
      case 'solarFlare':
        eventOverlay = {
          active: true,
          background: 'rgba(246, 173, 85, 0.3)',
          icon: <FaSun />,
          color: '#f6ad55',
          label: 'Solar Flare'
        };
        break;
      case 'mineralDeposit':
        eventOverlay = {
          active: true,
          background: 'rgba(99, 179, 237, 0.3)',
          icon: <FaCubes />,
          color: '#63b3ed',
          label: 'Rich Mineral Deposit'
        };
        break;
      case 'waterLeak':
        eventOverlay = {
          active: true,
          background: 'rgba(66, 153, 225, 0.3)',
          icon: <FaWater />,
          color: '#4299e1',
          label: 'Water System Leak'
        };
        break;
      case 'researchBreakthrough':
        eventOverlay = {
          active: true,
          background: 'rgba(159, 122, 234, 0.3)',
          icon: <FaFlask />,
          color: '#9f7aea',
          label: 'Research Breakthrough'
        };
        break;
      case 'clickFrenzy':
        eventOverlay = {
          active: true,
          background: 'rgba(255, 255, 255, 0.2)',
          icon: <FaRocket />,
          color: '#fc8181',
          label: 'Click Frenzy'
        };
        break;
      default:
        eventOverlay.active = false;
    }
  }
  
  // Toggle day/night cycle
  const toggleDayNight = () => {
    setIsNight(prev => !prev);
  };
  
  // Toggle weather (rain)
  const toggleWeather = () => {
    setIsRaining(prev => !prev);
  };
  
  const renderBuildingGroups = () => {
    return Object.entries(groupedBuildings).map(([group, buildings], groupIndex) => (
      <BuildingGroup key={group} style={{ zIndex: 10 - groupIndex }}>
        {buildings.map(({ key, building, config }) => (
          <BuildingStack 
            key={key} 
            onClick={() => setSelectedBuilding(key)}
          >
            <BuildingTooltip>
              {config.name} (x{building.count})<br/>
              {config.description}
            </BuildingTooltip>
            <BuildingIcon 
              color={config.color}
              background={config.background}
              padding={config.padding}
              size={config.size}
              animate={config.animate}
              duration={config.duration}
              zIndex={building.count > 1 ? 3 : 1}
            >
              {config.icon}
              {building.count > 1 && <BuildingCount>{building.count}</BuildingCount>}
            </BuildingIcon>
            <BuildingName>{config.name}</BuildingName>
          </BuildingStack>
        ))}
      </BuildingGroup>
    ));
  };
  
  // Resource indicators shown on the scene
  const resourceIndicators = [
    { resource: 'energy', icon: <FaSun />, color: '#f6ad55', top: '25%', left: '75%', size: '24px', duration: '4s' },
    { resource: 'minerals', icon: <FaCubes />, color: '#63b3ed', top: '65%', left: '25%', size: '24px', duration: '5s' },
    { resource: 'food', icon: <FaAppleAlt />, color: '#68d391', top: '55%', left: '35%', size: '24px', duration: '3.5s' },
    { resource: 'water', icon: <FaWater />, color: '#4299e1', top: '45%', left: '85%', size: '24px', duration: '4.5s' },
    { resource: 'research', icon: <FaFlask />, color: '#9f7aea', top: '35%', left: '45%', size: '24px', duration: '3s' }
  ];
  
  // Check if a resource has production
  const hasProduction = (resource) => {
    // Only show the indicator if we have a building that produces this resource
    switch(resource) {
      case 'energy':
        return (buildings.solarPanel?.count > 0 || buildings.advancedSolarArray?.count > 0);
      case 'minerals':
        return (buildings.mine?.count > 0 || buildings.deepDrillingSite?.count > 0);
      case 'food':
        return (buildings.farm?.count > 0);
      case 'water':
        return (buildings.waterExtractor?.count > 0);
      case 'research':
        return (buildings.researchLab?.count > 0);
      default:
        return false;
    }
  };
  
  return (
    <ViewContainer>
      <VisualizerTitle>
        Colony Visualizer
        <ControlPanel>
          <ControlButton onClick={toggleDayNight}>
            {isNight ? 'Day Mode' : 'Night Mode'}
          </ControlButton>
          <ControlButton onClick={toggleWeather}>
            {isRaining ? 'Clear Weather' : 'Rain'}
          </ControlButton>
          <ControlButton onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? 'Collapse' : 'Expand'}
          </ControlButton>
        </ControlPanel>
      </VisualizerTitle>
      
      <ColonyScene isExpanded={isExpanded} isDark={isDark} theme={theme.name}>
        {/* Sun or Moon */}
        <SunOrMoon isNight={isNight} theme={theme.name} />
        
        {/* Stars (only visible at night) */}
        {stars.map(star => (
          <Star 
            key={star.id}
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
            }}
            size={star.size}
            glow={star.glow}
            isNight={isNight}
            theme={theme.name}
            twinkle={star.twinkle}
            twinkleDuration={`${2 + Math.random() * 3}s`}
          />
        ))}
        
        {/* Clouds */}
        <Cloud isDark={isDark} theme={theme.name} size="40px" top="30px" left="50px" duration="7s" moveDuration="80s" isNight={isNight}>
          <FaCloud />
        </Cloud>
        <Cloud isDark={isDark} theme={theme.name} size="30px" top="60px" left="180px" duration="5s" moveDuration="60s" isNight={isNight} showInSpace={true}>
          <FaCloud />
        </Cloud>
        <Cloud isDark={isDark} theme={theme.name} size="50px" top="40px" left="300px" duration="9s" moveDuration="70s" isNight={isNight}>
          <FaCloud />
        </Cloud>
        
        {/* Rain (conditionally rendered) */}
        <Rain isDark={isDark} theme={theme.name} size="30px" top="70px" left="60px" isRaining={isRaining}>
          <FaCloudRain />
        </Rain>
        <Rain isDark={isDark} theme={theme.name} size="25px" top="80px" left="180px" isRaining={isRaining}>
          <FaCloudRain />
        </Rain>
        <Rain isDark={isDark} theme={theme.name} size="35px" top="65px" left="300px" isRaining={isRaining}>
          <FaCloudRain />
        </Rain>
        
        {/* Mountains and Trees */}
        <Mountain isDark={isDark} theme={theme.name} size="80px" bottom="40%" left="5%">
          <FaMountain />
        </Mountain>
        <Mountain isDark={isDark} theme={theme.name} size="60px" bottom="40%" left="25%" flip>
          <FaMountain />
        </Mountain>
        <Mountain isDark={isDark} theme={theme.name} size="70px" bottom="40%" left="65%">
          <FaMountain />
        </Mountain>
        
        <Tree isDark={isDark} theme={theme.name} size="35px" bottom="40%" left="15%" animate>
          <FaTree />
        </Tree>
        <Tree isDark={isDark} theme={theme.name} size="25px" bottom="40%" left="40%" showInSpace={true}>
          <FaTree />
        </Tree>
        <Tree isDark={isDark} theme={theme.name} size="30px" bottom="40%" left="75%" animate>
          <FaTree />
        </Tree>
        <Tree isDark={isDark} theme={theme.name} size="20px" bottom="40%" left="90%">
          <FaTree />
        </Tree>
        
        {/* Resource Indicators */}
        {resourceIndicators.map((indicator, index) => (
          <ResourceIndicator
            key={index}
            color={indicator.color}
            top={indicator.top}
            left={indicator.left}
            size={indicator.size}
            duration={indicator.duration}
            active={hasProduction(indicator.resource)}
          >
            {indicator.icon}
          </ResourceIndicator>
        ))}
        
        {/* Buildings */}
        {activeBuildings.length > 0 ? (
          <BuildingLayer>
            {renderBuildingGroups()}
          </BuildingLayer>
        ) : (
          <EmptyColonyMessage isDark={isDark}>
            Start building structures to visualize your colony!
          </EmptyColonyMessage>
        )}
        
        {/* Colonists */}
        {population > 0 && (
          <ColonistArea>
            <ColonistIcon>
              <FaUsers />
            </ColonistIcon>
            <ColonistCount>{population}</ColonistCount>
          </ColonistArea>
        )}
        
        {/* Event Overlay */}
        <EventOverlay 
          active={eventOverlay.active} 
          background={eventOverlay.background}
        />
        
        {eventOverlay.active && (
          <>
            <EventIcon active={eventOverlay.active} color={eventOverlay.color}>
              {eventOverlay.icon}
            </EventIcon>
            <EventLabel active={eventOverlay.active}>
              {eventOverlay.label}
            </EventLabel>
          </>
        )}
      </ColonyScene>
    </ViewContainer>
  );
};

export default ColonyVisualizer;