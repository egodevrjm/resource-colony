// src/components/BuildingPanel.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import { purchaseBuilding, calculateCost } from '../redux/gameSlice';
import { FaSun, FaCubes, FaAppleAlt, FaWater, FaFlask, FaUsers, FaCogs, FaSearch, FaInfoCircle, FaPlus } from 'react-icons/fa';
import { SafeCostItem, safeNumber, isUnlocked } from './SafeWrappers';
import Tooltip from './Tooltip';
import HelpIcon from './HelpIcon';

const Panel = styled.div`
  background: var(--cardBackground);
  border-radius: 8px;
  padding: 16px;
  box-shadow: var(--panelShadow);
`;

const PanelTitle = styled.h2`
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

const SearchBar = styled.div`
  margin-bottom: 16px;
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 10px 10px 40px;
  border-radius: 4px;
  border: 1px solid #e2e8f0;
  font-size: 1rem;
  outline: none;
  
  &:focus {
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #a0aec0;
`;

const BuildingFilter = styled.div`
  display: flex;
  margin-bottom: 16px;
  border-radius: 4px;
  overflow: hidden;
  background: #e2e8f0;
`;

const FilterButton = styled(({ active, ...rest }) => <button {...rest} />)`
  flex: 1;
  padding: 8px;
  border: none;
  background: ${props => props.active ? '#4a6fa5' : 'transparent'};
  color: ${props => props.active ? 'white' : '#4a5568'};
  cursor: pointer;
  
  &:hover {
    background: ${props => props.active ? '#4a6fa5' : '#cbd5e0'};
  }
`;

const BuildingList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 600px;
  overflow-y: auto;
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
`;

const BuildingItem = styled.div`
  background: var(--cardBackground);
  padding: 16px;
  border-radius: 6px;
  box-shadow: var(--panelShadow);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid var(--border);
  transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
  position: relative;
  
  &:hover {
    border-color: var(--primary);
    transform: translateY(-2px);
    box-shadow: var(--elevatedShadow);
  }
  
  &.highlight {
    animation: ${pulse} 1s ease-in-out;
    border-color: var(--primary);
  }
`;

const BuildingInfo = styled.div`
  flex-grow: 1;
  position: relative;
`;

const BuildingIcon = styled.div`
  position: absolute;
  right: 10px;
  top: 0;
  font-size: 3rem;
  opacity: 0.05;
  color: var(--primary);
  pointer-events: none;
`;

const BuildingName = styled.div`
  font-weight: bold;
  margin-bottom: 4px;
  color: var(--text);
  display: flex;
  align-items: center;
`;

const InfoIconWrapper = styled.span`
  margin-left: 6px;
  font-size: 0.75rem;
  color: var(--textSecondary);
  opacity: 0.7;
  
  &:hover {
    opacity: 1;
    color: var(--primary);
  }
`;

const BuildingCount = styled.div`
  font-size: 0.9rem;
  color: var(--textSecondary);
  display: flex;
  align-items: center;
`;

const BuildingDescription = styled.div`
  font-size: 0.8rem;
  color: var(--textSecondary);
  margin-top: 4px;
  margin-bottom: 4px;
  line-height: 1.3;
  max-width: 80%;
`;

const BuildingOutput = styled.div`
  font-size: 0.85rem;
  color: var(--text);
  margin-top: 6px;
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
  max-width: 80%;
`;

const OutputItem = styled.div`
  display: inline-flex;
  align-items: center;
  background: var(--hoverBackground);
  border-radius: 4px;
  padding: 2px 6px;
  margin-right: 4px;
  margin-bottom: 4px;
  white-space: nowrap;
`;

const OutputIcon = styled.span`
  margin-right: 4px;
  color: ${props => props.color || 'var(--text)'};
`;

const CostItem = SafeCostItem;

const CostIcon = styled.span`
  margin-right: 2px;
  font-size: 12px;
`;

const PurchaseButton = styled.button`
  background-color: var(--primaryButton);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
  font-weight: bold;
  opacity: ${props => props.disabled ? 0.5 : 1};
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 5px;
  
  &:hover:not(:disabled) {
    background-color: var(--primaryButtonHover);
    transform: translateY(-2px);
  }
  
  &:active:not(:disabled) {
    transform: translateY(1px);
  }
  
  &:disabled {
    cursor: not-allowed;
  }
`;

const NoBuildingsMessage = styled.div`
  text-align: center;
  padding: 20px;
  color: #718096;
  background: white;
  border-radius: 6px;
`;

const BuildingHint = styled.div`
  text-align: center;
  margin-top: 10px;
  font-size: 0.8rem;
  color: #718096;
  font-style: italic;
`;

const BuildingPanel = () => {
  const dispatch = useDispatch();
  const resources = useSelector(state => state.game.resources);
  const buildings = useSelector(state => state.game.buildings);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const resourceIcons = {
    energy: <FaSun />,
    minerals: <FaCubes />,
    food: <FaAppleAlt />,
    water: <FaWater />,
    research: <FaFlask />,
    population: <FaUsers />,
    components: <FaCogs />,
  };
  
  const resourceColors = {
    energy: '#f6ad55',
    minerals: '#63b3ed',
    food: '#68d391',
    water: '#4299e1',
    research: '#9f7aea',
    population: '#fc8181',
    components: '#a0aec0'
  };
  
  const buildingIcons = {
    solarPanel: <FaSun />,
    mine: <FaCubes />,
    farm: <FaAppleAlt />,
    waterExtractor: <FaWater />,
    researchLab: <FaFlask />,
    habitat: <FaUsers />,
    factory: <FaCogs />,
    advancedSolarArray: <FaSun />,
    deepDrillingSite: <FaCubes />
  };
  
  const canAfford = (costs) => {
    return Object.entries(costs).every(([resource, amount]) => resources[resource] >= amount);
  };
  
  // Track recently purchased buildings
  const [recentlyPurchased, setRecentlyPurchased] = useState([]);
  
  // Add animation for recently purchased buildings
  useEffect(() => {
    if (recentlyPurchased.length > 0) {
      const timer = setTimeout(() => {
        setRecentlyPurchased([]);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [recentlyPurchased]);
  
  // Filter buildings based on filter type and search term
  const filteredBuildings = Object.entries(buildings).filter(([key, building]) => {
    // Debug logging to see what buildings are available
    console.log(`Building ${key}: unlocked=${building?.unlocked}, exists=${!!building}`);
    
    // Always make sure building exists and is properly initialized
    if (!building) return false;
    
    // Show buildings with basic resources always (for early game)
    const initialBuildingsVisible = (key === 'solarPanel' || key === 'mine' || 
                                   key === 'farm' || key === 'waterExtractor');
    
    // Filter by unlock status or show initial buildings
    if (!initialBuildingsVisible && building.unlocked !== true) return false;
    
    // Filter by category
    if (filter === 'basic' && 
        (key === 'researchLab' || key === 'habitat' || key === 'factory' || 
         key === 'advancedSolarArray' || key === 'deepDrillingSite')) {
      return false;
    }
    
    if (filter === 'advanced' && 
        (key === 'solarPanel' || key === 'mine' || key === 'farm' || key === 'waterExtractor')) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm && 
        !building.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !building.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  return (
    <Panel>
      <PanelTitle>
        <TitleWithHelp>
          Buildings
          <HelpIcon tooltip="Construct buildings to automate resource production. Each building has a specific output and cost that increases with each purchase." />
        </TitleWithHelp>
      </PanelTitle>
      
      <SearchBar>
        <SearchIcon>
          <FaSearch />
        </SearchIcon>
        <SearchInput 
          type="text"
          placeholder="Search buildings..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </SearchBar>
      
      <BuildingFilter>
        <FilterButton 
          active={filter === 'all'} 
          onClick={() => setFilter('all')}
        >
          All
        </FilterButton>
        <FilterButton 
          active={filter === 'basic'} 
          onClick={() => setFilter('basic')}
        >
          Basic
        </FilterButton>
        <FilterButton 
          active={filter === 'advanced'} 
          onClick={() => setFilter('advanced')}
        >
          Advanced
        </FilterButton>
      </BuildingFilter>
      
      <BuildingList>
        {filteredBuildings.length === 0 ? (
          <NoBuildingsMessage>
            {searchTerm ? "No buildings match your search" : "No buildings available"}
          </NoBuildingsMessage>
        ) : (
          filteredBuildings.map(([key, building]) => {
            const currentCost = calculateCost(building.baseCost, building.count);
            const affordable = canAfford(currentCost);
            
            return (
              <BuildingItem key={key}>
                <BuildingInfo>
                  <BuildingIcon>{buildingIcons[key]}</BuildingIcon>
                  <BuildingName>
                    {building.name}
                    <Tooltip content={`${building.description} - Each one produces ${Object.entries(building.baseOutput)
                      .map(([resource, amount]) => `${amount.toFixed(1)} ${resource}/sec`)
                      .join(', ')}.`}>
                      <InfoIconWrapper>
                        <FaInfoCircle />
                      </InfoIconWrapper>
                    </Tooltip>
                  </BuildingName>
                  <BuildingCount>Owned: {building.count}</BuildingCount>
                  <BuildingDescription>{building.description}</BuildingDescription>
                  <BuildingOutput>
                    Produces: 
                    {Object.entries(building.baseOutput).map(([resource, amount]) => (
                      <OutputItem key={resource}>
                        <OutputIcon color={resourceColors[resource]}>
                          {resourceIcons[resource]}
                        </OutputIcon>
                        {amount.toFixed(1)} {resource}/sec
                      </OutputItem>
                    ))}
                  </BuildingOutput>
                  <div>
                    {Object.entries(currentCost).map(([resource, amount]) => (
                      <CostItem key={resource} canAfford={resources[resource] >= amount}>
                        <CostIcon>{resourceIcons[resource]}</CostIcon>
                        {safeNumber(amount, 0).toFixed(0)}
                      </CostItem>
                    ))}
                  </div>
                </BuildingInfo>
                <PurchaseButton
                  onClick={(e) => {
                    dispatch(purchaseBuilding({ buildingType: key }));
                    
                    // Add to recently purchased list for animation
                    setRecentlyPurchased(prev => [...prev, key]);
                    
                    // Trigger visual effect for building purchase
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = rect.left + rect.width / 2;
                    const y = rect.top + rect.height / 2;
                    
                    window.dispatchEvent(new CustomEvent('buildingPurchased', {
                      detail: {
                        building: building.name,
                        x,
                        y
                      }
                    }));
                  }}
                  disabled={!affordable}
                >
                  <FaPlus size={12} /> Build
                </PurchaseButton>
              </BuildingItem>
            );
          })
        )}
      </BuildingList>
      {filteredBuildings.length > 0 && (
        <BuildingHint>Build structures to automate resource collection</BuildingHint>
      )}
    </Panel>
  );
};

export default BuildingPanel;