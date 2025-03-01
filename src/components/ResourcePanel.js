// src/components/ResourcePanel.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { collectResource, calculateProductionRates } from '../redux/gameSlice';
import { FaSun, FaCubes, FaAppleAlt, FaWater, FaFlask, FaUsers, FaCogs, FaSort, FaInfoCircle } from 'react-icons/fa';
import { safeNumber } from './SafeWrappers';
import Tooltip from './Tooltip';
import HelpIcon from './HelpIcon';

const Panel = styled.div`
  background: var(--cardBackground);
  border-radius: 8px;
  padding: 16px;
  box-shadow: var(--panelShadow);
`;

const PanelTitle = styled.div`
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

const TitleWithHelp = styled.div`
  display: flex;
  align-items: center;
`;

const SortButton = styled.button`
  background: none;
  border: none;
  color: var(--textSecondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  padding: 4px 6px;
  border-radius: 4px;
  
  &:hover {
    background: var(--hoverBackground);
  }
  
  svg {
    margin-left: 4px;
  }
`;

const ResourceGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
  
  @media (max-width: 500px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const ResourceItem = styled(({ clickable, ...rest }) => {
  // Create a data attribute for clickable state
  const dataProps = {};
  if (clickable !== undefined) {
    dataProps['data-clickable'] = clickable ? 'true' : 'false';
  }
  return <div {...rest} {...dataProps} />;
})`
  background: var(--cardBackground);
  padding: 12px;
  border-radius: 6px;
  box-shadow: var(--panelShadow);
  display: flex;
  flex-direction: column;
  cursor: ${props => props['data-clickable'] === 'true' ? 'pointer' : 'default'};
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
  border: 1px solid var(--border);
  position: relative;
  
  &:hover {
    transform: ${props => props['data-clickable'] === 'true' ? 'translateY(-2px)' : 'none'};
    box-shadow: ${props => props['data-clickable'] === 'true' ? 'var(--elevatedShadow)' : 'var(--panelShadow)'};
    border-color: ${props => props['data-clickable'] === 'true' ? 'var(--primary)' : 'var(--border)'};
  }
  
  &:active {
    transform: ${props => props['data-clickable'] === 'true' ? 'translateY(1px)' : 'none'};
  }
`;

const ResourceHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

const ResourceIcon = styled.div`
  font-size: 20px;
  margin-right: 8px;
  color: ${props => props.color || '#4299e1'};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.background || 'transparent'};
  padding: 6px;
  border-radius: 6px;
`;

const ResourceDetails = styled.div`
  flex: 1;
`;

const ResourceName = styled.div`
  font-weight: bold;
  margin-bottom: 2px;
  color: var(--text);
  display: flex;
  align-items: center;
`;

const InfoIcon = styled.span`
  margin-left: 6px;
  font-size: 0.75rem;
  color: var(--textSecondary);
  opacity: 0.7;
  
  &:hover {
    opacity: 1;
    color: var(--primary);
  }
`;

const ResourceValue = styled.div`
  font-size: 1.1rem;
  color: var(--text);
  font-weight: 600;
`;

const ResourceInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const ResourceRate = styled.div`
  font-size: 0.75rem;
  color: var(--textSecondary);
  background: var(--hoverBackground);
  padding: 2px 6px;
  border-radius: 10px;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 6px;
  background: var(--progressBarBackground);
  border-radius: 3px;
  overflow: hidden;
  margin-top: 8px;
`;

const ProgressBarFill = styled.div`
  height: 100%;
  background: ${props => props.color || '#4299e1'};
  width: ${props => Math.min(props.percent || 0, 100)}%;
  transition: width 0.5s ease-out;
`;

const ClickableIndicator = styled.div`
  font-size: 0.7rem;
  color: var(--textSecondary);
  margin-top: 6px;
  text-align: center;
`;

const ClickEffect = styled.div`
  position: absolute;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  animation: ripple 0.8s ease-out;
  z-index: 100;
  pointer-events: none;
  background: ${props => props.color || 'rgba(66, 153, 225, 0.5)'};
  
  @keyframes ripple {
    0% {
      transform: scale(0);
      opacity: 1;
    }
    100% {
      transform: scale(2);
      opacity: 0;
    }
  }
`;

const CapacityInfo = styled.div`
  font-size: 0.7rem;
  color: var(--textSecondary);
  text-align: right;
`;

const ResourcePanel = () => {
  const dispatch = useDispatch();
  const resources = useSelector(state => state.game.resources);
  const gameState = useSelector(state => state.game);
  const productionRates = calculateProductionRates(gameState);
  const [clickEffects, setClickEffects] = useState([]);
  const [sortBy, setSortBy] = useState('name'); // Default sort by name
  
  const resourceConfig = {
    energy: { 
      name: 'Energy', 
      icon: <FaSun />, 
      color: '#f6ad55', 
      background: 'rgba(246, 173, 85, 0.1)',
      clickable: true,
      progressColor: '#f6ad55',
      description: 'Powers all your buildings and technologies. Essential for expanding your colony.'
    },
    minerals: { 
      name: 'Minerals', 
      icon: <FaCubes />, 
      color: '#63b3ed', 
      background: 'rgba(99, 179, 237, 0.1)',
      clickable: true,
      progressColor: '#63b3ed',
      description: 'Raw materials used for construction and manufacturing. Extracted from the planet surface.'
    },
    food: { 
      name: 'Food', 
      icon: <FaAppleAlt />, 
      color: '#68d391', 
      background: 'rgba(104, 211, 145, 0.1)',
      clickable: true,
      progressColor: '#68d391',
      description: 'Sustains your colonists and enables population growth. Produced in farms.'
    },
    water: { 
      name: 'Water', 
      icon: <FaWater />, 
      color: '#4299e1', 
      background: 'rgba(66, 153, 225, 0.1)',
      clickable: true,
      progressColor: '#4299e1',
      description: 'Essential for life support and farming. Extracted from the atmosphere or recycled.'
    },
    research: { 
      name: 'Research', 
      icon: <FaFlask />, 
      color: '#9f7aea', 
      background: 'rgba(159, 122, 234, 0.1)',
      clickable: true,
      progressColor: '#9f7aea',
      description: 'Scientific progress that unlocks new technologies, buildings and upgrades.'
    },
    population: { 
      name: 'Population', 
      icon: <FaUsers />, 
      color: '#fc8181', 
      background: 'rgba(252, 129, 129, 0.1)',
      clickable: false,
      progressColor: '#fc8181',
      description: 'Your colonists who operate buildings and enable certain advanced structures. Requires food and water.'
    },
    components: { 
      name: 'Components', 
      icon: <FaCogs />, 
      color: '#a0aec0', 
      background: 'rgba(160, 174, 192, 0.1)',
      clickable: false,
      progressColor: '#a0aec0',
      description: 'Advanced parts used for high-tech buildings and upgrades. Produced in factories.'
    }
  };
  
  // Calculate resource storage capacities (for progress bars)
  // This is a simplified example - you might want to base this on buildings/upgrades
  const resourceCapacities = {
    energy: 1000 + (gameState.buildings.solarPanel?.count || 0) * 100 + (gameState.buildings.advancedSolarArray?.count || 0) * 500,
    minerals: 1000 + (gameState.buildings.mine?.count || 0) * 100 + (gameState.buildings.deepDrillingSite?.count || 0) * 500,
    food: 1000 + (gameState.buildings.farm?.count || 0) * 100,
    water: 1000 + (gameState.buildings.waterExtractor?.count || 0) * 100,
    research: 500 + (gameState.buildings.researchLab?.count || 0) * 100,
    components: 500 + (gameState.buildings.factory?.count || 0) * 100,
    population: Math.max(10, (gameState.buildings.habitat?.count || 0) * 5)
  };
  
  const handleClick = (resource, event) => {
    // Only dispatch for clickable resources and if we have a config for it
    if (resourceConfig[resource] && resourceConfig[resource].clickable) {
      dispatch(collectResource({ resource }));
      
      // Add click effect
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      const newEffect = {
        id: Date.now(),
        resource,
        x, y,
        color: resourceConfig[resource].color
      };
      
      setClickEffects(prev => [...prev, newEffect]);
      
      // Remove the effect after animation completes
      setTimeout(() => {
        setClickEffects(prev => prev.filter(effect => effect.id !== newEffect.id));
      }, 800);
      
      // Dispatch a custom event for the visual effect
      window.dispatchEvent(new CustomEvent('resourceCollected', {
        detail: {
          resource,
          amount: 1, // Base amount (could be modified by upgrades)
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        }
      }));
    }
  };
  
  // Sort resources
  const sortResources = () => {
    let sortedResources = Object.entries(resources)
      .filter(([key]) => resourceConfig[key]); // Filter out resources without config
      
    switch(sortBy) {
      case 'name':
        return sortedResources.sort(([keyA], [keyB]) => 
          resourceConfig[keyA].name.localeCompare(resourceConfig[keyB].name));
      case 'value':
        return sortedResources.sort(([keyA, valueA], [keyB, valueB]) => valueB - valueA);
      case 'production':
        return sortedResources.sort(([keyA], [keyB]) => 
          (productionRates[keyB] || 0) - (productionRates[keyA] || 0));
      default:
        return sortedResources;
    }
  };
  
  // Toggle sort method
  const toggleSort = () => {
    const sortOptions = ['name', 'value', 'production'];
    const currentIndex = sortOptions.indexOf(sortBy);
    const nextIndex = (currentIndex + 1) % sortOptions.length;
    setSortBy(sortOptions[nextIndex]);
  };
  
  // Format the sort label
  const getSortLabel = () => {
    switch(sortBy) {
      case 'name': return 'Sort: Name';
      case 'value': return 'Sort: Amount';
      case 'production': return 'Sort: Production';
      default: return 'Sort';
    }
  };
  
  return (
    <Panel>
      <PanelTitle>
        <TitleWithHelp>
          Resources
          <HelpIcon tooltip="These are the resources you need to build and expand your colony. Click on resources to collect them manually." />
        </TitleWithHelp>
        <SortButton onClick={toggleSort}>
          {getSortLabel()} <FaSort />
        </SortButton>
      </PanelTitle>
      
      <ResourceGrid>
        {sortResources().map(([key, value]) => {
          // Skip rendering if we don't have config for this resource
          if (!resourceConfig[key]) return null;
          
          // Calculate percentage for progress bar
          const capacity = resourceCapacities[key] || 1000;
          const percentage = Math.min((value / capacity) * 100, 100);
          
          return (
            <ResourceItem 
              key={key} 
              onClick={(e) => handleClick(key, e)}
              clickable={resourceConfig[key].clickable}
            >
              {/* Render click effects */}
              {clickEffects
                .filter(effect => effect.resource === key)
                .map(effect => (
                  <ClickEffect 
                    key={effect.id}
                    style={{ left: effect.x + 'px', top: effect.y + 'px' }}
                    color={`${effect.color}80`} // Add transparency
                  />
                ))
              }
              
              <ResourceHeader>
                <ResourceIcon 
                  color={resourceConfig[key].color}
                  background={resourceConfig[key].background}
                >
                  {resourceConfig[key].icon}
                </ResourceIcon>
                <ResourceDetails>
                  <ResourceName>
                    {resourceConfig[key].name}
                    <Tooltip content={resourceConfig[key].description || ''}>
                      <InfoIcon>
                        <FaInfoCircle />
                      </InfoIcon>
                    </Tooltip>
                  </ResourceName>
                </ResourceDetails>
              </ResourceHeader>
              
              <ResourceInfo>
                <ResourceValue>{safeNumber(value, 0).toFixed(0)}</ResourceValue>
                <ResourceRate>
                  {(productionRates[key] > 0 ? '+' : '') + 
                   safeNumber(productionRates[key], 0).toFixed(1) + ' / sec'}
                </ResourceRate>
              </ResourceInfo>
              
              <ProgressBarContainer>
                <ProgressBarFill 
                  percent={percentage} 
                  color={resourceConfig[key].progressColor}
                />
              </ProgressBarContainer>
              
              <CapacityInfo>
                {safeNumber(value, 0).toFixed(0)} / {capacity.toLocaleString()}
              </CapacityInfo>
              
              {resourceConfig[key].clickable && (
                <ClickableIndicator>
                  Click to collect
                </ClickableIndicator>
              )}
            </ResourceItem>
          );
        })}
      </ResourceGrid>
    </Panel>
  );
};

export default ResourcePanel;