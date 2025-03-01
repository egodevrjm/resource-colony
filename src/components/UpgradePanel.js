// src/components/UpgradePanel.js
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { purchaseUpgrade, calculateCost } from '../redux/gameSlice';
import { FaSun, FaCubes, FaAppleAlt, FaWater, FaFlask, FaUsers, FaCogs, FaSearch } from 'react-icons/fa';
import { SafeCostItem, safeNumber, isUnlocked } from './SafeWrappers';

const Panel = styled.div`
  background: #f0f4f8;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const PanelTitle = styled.h2`
  margin-top: 0;
  margin-bottom: 16px;
  color: #2d3748;
  font-size: 1.2rem;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 8px;
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

const UpgradeFilter = styled.div`
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

const UpgradeList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 600px;
  overflow-y: auto;
`;

const UpgradeItem = styled.div`
  background: white;
  padding: 16px;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const UpgradeInfo = styled.div`
  flex-grow: 1;
`;

const UpgradeName = styled.div`
  font-weight: bold;
  margin-bottom: 4px;
`;

const UpgradeLevel = styled.div`
  font-size: 0.9rem;
  color: #4a5568;
`;

const UpgradeDescription = styled.div`
  font-size: 0.8rem;
  color: #718096;
  margin-top: 4px;
  margin-bottom: 4px;
`;

const UpgradeEffect = styled.div`
  font-size: 0.8rem;
  color: #718096;
  margin-top: 4px;
`;

const CostItem = SafeCostItem;

const CostIcon = styled.span`
  margin-right: 2px;
  font-size: 12px;
`;

const PurchaseButton = styled.button`
  background-color: #4299e1;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
  font-weight: bold;
  opacity: ${props => props.disabled ? 0.5 : 1};
  transition: background-color 0.2s;
  
  &:hover:not(:disabled) {
    background-color: #3182ce;
  }
  
  &:disabled {
    cursor: not-allowed;
  }
`;

const NoUpgradesMessage = styled.div`
  text-align: center;
  padding: 20px;
  color: #718096;
  background: white;
  border-radius: 6px;
`;

const UpgradePanel = () => {
  const dispatch = useDispatch();
  const resources = useSelector(state => state.game.resources);
  const upgrades = useSelector(state => state.game.upgrades);
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
  
  const canAfford = (costs) => {
    return Object.entries(costs).every(([resource, amount]) => resources[resource] >= amount);
  };
  
  const formatEffect = (effect, level) => {
    const percentage = ((Math.pow(effect, level + 1) - Math.pow(effect, level)) * 100).toFixed(0);
    return `+${percentage}% production`;
  };
  
  // Filter upgrades based on filter type and search term
  const filteredUpgrades = Object.entries(upgrades).filter(([key, upgrade]) => {
    // Filter by unlock status
    if (upgrade?.unlocked !== true) return false;
    
    // Filter by category
    if (filter === 'basic' && 
        (key === 'clickEfficiency' || key === 'researchEfficiency' || 
         key === 'populationGrowth' || key === 'componentProduction')) {
      return false;
    }
    
    if (filter === 'advanced' && 
        (key === 'energyEfficiency' || key === 'advancedMining' || 
         key === 'hydroponics' || key === 'waterRecycling')) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm && 
        !upgrade.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !upgrade.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  return (
    <Panel>
      <PanelTitle>Upgrades</PanelTitle>
      
      <SearchBar>
        <SearchIcon>
          <FaSearch />
        </SearchIcon>
        <SearchInput 
          type="text"
          placeholder="Search upgrades..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </SearchBar>
      
      <UpgradeFilter>
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
      </UpgradeFilter>
      
      <UpgradeList>
        {filteredUpgrades.length === 0 ? (
          <NoUpgradesMessage>
            {searchTerm ? "No upgrades match your search" : "No upgrades available"}
          </NoUpgradesMessage>
        ) : (
          filteredUpgrades.map(([key, upgrade]) => {
            const currentCost = calculateCost(upgrade.baseCost, upgrade.level);
            const affordable = canAfford(currentCost);
            
            return (
              <UpgradeItem key={key}>
                <UpgradeInfo>
                  <UpgradeName>{upgrade.name}</UpgradeName>
                  <UpgradeLevel>Level: {upgrade.level}</UpgradeLevel>
                  <UpgradeDescription>{upgrade.description}</UpgradeDescription>
                  <UpgradeEffect>
                    Next Level: {formatEffect(upgrade.effect, upgrade.level)}
                  </UpgradeEffect>
                  <div>
                    {Object.entries(currentCost).map(([resource, amount]) => (
                      <CostItem key={resource} canAfford={resources[resource] >= amount}>
                        <CostIcon>{resourceIcons[resource]}</CostIcon>
                        {safeNumber(amount, 0).toFixed(0)}
                      </CostItem>
                    ))}
                  </div>
                </UpgradeInfo>
                <PurchaseButton
                  onClick={() => dispatch(purchaseUpgrade({ upgradeType: key }))}
                  disabled={!affordable}
                >
                  Upgrade
                </PurchaseButton>
              </UpgradeItem>
            );
          })
        )}
      </UpgradeList>
    </Panel>
  );
};

export default UpgradePanel;