// src/components/ColonistPanel.js
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { FaUsers, FaAppleAlt, FaWater, FaHome, FaArrowUp, FaInfoCircle } from 'react-icons/fa';
import { safeNumber } from './SafeWrappers';

const Panel = styled.div`
  background: #f0f4f8;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
`;

const PanelTitle = styled.h2`
  margin-top: 0;
  margin-bottom: 16px;
  color: #2d3748;
  font-size: 1.2rem;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TitleWithIcon = styled.div`
  display: flex;
  align-items: center;
`;

const TitleIcon = styled.span`
  margin-right: 8px;
  color: #4a6fa5;
`;

const InfoIcon = styled.span`
  color: #718096;
  cursor: pointer;
  transition: color 0.2s;
  
  &:hover {
    color: #4a6fa5;
  }
`;

const PopulationDisplay = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 16px;
`;

const PopulationCount = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PopulationValue = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #4a6fa5;
`;

const PopulationLabel = styled.div`
  font-size: 0.8rem;
  color: #718096;
`;

const GrowthRate = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: ${props => props.positive ? '#48bb78' : '#e53e3e'};
`;

const GrowthIcon = styled.span`
  margin-right: 4px;
`;

const RequirementsList = styled.div`
  margin-bottom: 16px;
`;

const RequirementItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #edf2f7;
  
  &:last-child {
    border-bottom: none;
  }
`;

const RequirementName = styled.div`
  display: flex;
  align-items: center;
`;

const RequirementIcon = styled.span`
  margin-right: 8px;
  color: ${props => props.color || '#4a5568'};
`;

const RequirementStatus = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: ${props => props.met ? '#48bb78' : '#e53e3e'};
`;

const PopulationInfoBox = styled.div`
  background: #edf2f7;
  padding: 12px;
  border-radius: 6px;
  margin-top: 16px;
  font-size: 0.9rem;
  color: #4a5568;
  display: ${props => props.visible ? 'block' : 'none'};
`;

const NeedsHeader = styled.div`
  font-weight: bold;
  margin-bottom: 8px;
`;

const NeedsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
`;

const NeedItem = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 8px;
  background: white;
  border-radius: 4px;
  font-size: 0.8rem;
  color: ${props => props.satisfied ? '#48bb78' : '#e53e3e'};
  border: 1px solid ${props => props.satisfied ? '#c6f6d5' : '#fed7d7'};
`;

const NeedIcon = styled.span`
  margin-right: 4px;
`;

const ColonistPanel = () => {
  const dispatch = useDispatch();
  const resources = useSelector(state => state.game.resources);
  const buildings = useSelector(state => state.game.buildings);
  const [showInfo, setShowInfo] = useState(false);
  
  // Current population
  const population = safeNumber(resources.population, 0);
  
  // Check if basic colonist needs are met
  const foodProduced = buildings.farm?.count > 0;
  const waterProduced = buildings.waterExtractor?.count > 0;
  const housingAvailable = buildings.habitat?.count > 0;
  
  // Calculate number of habitats
  const habitats = buildings.habitat?.count || 0;
  
  // Calculate maximum population based on habitats
  // Each habitat supports 5 colonists
  const maxPopulation = habitats * 5;
  
  // Check if the colony can support more colonists
  const canGrow = foodProduced && waterProduced && housingAvailable && population < maxPopulation;
  
  // Calculate growth rate based on conditions
  // Base growth is 0.1 per second if all conditions are met
  const baseGrowthRate = 0.1;
  let actualGrowthRate = 0;
  
  if (canGrow) {
    actualGrowthRate = baseGrowthRate;
    
    // Multiply by habitability factors (food, water quality)
    const foodQuality = Math.min(resources.food / Math.max(population, 1), 2);
    const waterQuality = Math.min(resources.water / Math.max(population, 1), 2);
    
    actualGrowthRate *= (foodQuality + waterQuality) / 2;
  }
  
  // Format growth rate for display
  const formattedGrowthRate = actualGrowthRate.toFixed(2);
  
  return (
    <Panel>
      <PanelTitle>
        <TitleWithIcon>
          <TitleIcon><FaUsers /></TitleIcon>
          Colony Population
        </TitleWithIcon>
        <InfoIcon onClick={() => setShowInfo(!showInfo)}>
          <FaInfoCircle />
        </InfoIcon>
      </PanelTitle>
      
      <PopulationDisplay>
        <PopulationCount>
          <PopulationValue>{Math.floor(population)}</PopulationValue>
          <PopulationLabel>Colonists</PopulationLabel>
        </PopulationCount>
        
        <GrowthRate positive={actualGrowthRate > 0}>
          <GrowthIcon>
            <FaArrowUp style={{ transform: actualGrowthRate > 0 ? 'none' : 'rotate(180deg)' }} />
          </GrowthIcon>
          {formattedGrowthRate}/sec
        </GrowthRate>
        
        <PopulationCount>
          <PopulationValue>{maxPopulation}</PopulationValue>
          <PopulationLabel>Max Capacity</PopulationLabel>
        </PopulationCount>
      </PopulationDisplay>
      
      <RequirementsList>
        <RequirementItem>
          <RequirementName>
            <RequirementIcon color="#68d391"><FaAppleAlt /></RequirementIcon>
            Food Production
          </RequirementName>
          <RequirementStatus met={foodProduced}>
            {foodProduced ? 'Active' : 'Required'}
          </RequirementStatus>
        </RequirementItem>
        
        <RequirementItem>
          <RequirementName>
            <RequirementIcon color="#4299e1"><FaWater /></RequirementIcon>
            Water Production
          </RequirementName>
          <RequirementStatus met={waterProduced}>
            {waterProduced ? 'Active' : 'Required'}
          </RequirementStatus>
        </RequirementItem>
        
        <RequirementItem>
          <RequirementName>
            <RequirementIcon color="#fc8181"><FaHome /></RequirementIcon>
            Housing
          </RequirementName>
          <RequirementStatus met={housingAvailable}>
            {housingAvailable ? `${habitats} Habitats (${maxPopulation} capacity)` : 'Required'}
          </RequirementStatus>
        </RequirementItem>
      </RequirementsList>
      
      <PopulationInfoBox visible={showInfo}>
        <NeedsHeader>Colonist Needs</NeedsHeader>
        <NeedsList>
          <NeedItem satisfied={foodProduced}>
            <NeedIcon><FaAppleAlt /></NeedIcon>
            Food
          </NeedItem>
          <NeedItem satisfied={waterProduced}>
            <NeedIcon><FaWater /></NeedIcon>
            Water
          </NeedItem>
          <NeedItem satisfied={housingAvailable}>
            <NeedIcon><FaHome /></NeedIcon>
            Housing
          </NeedItem>
        </NeedsList>
        
        <p>
          Colonists require food, water, and housing to survive. Growth rate is affected by 
          resource availability and quality. Each habitat can support up to 5 colonists.
        </p>
        
        <p>
          Population growth is automatic once the basic needs are met, but can be 
          accelerated by ensuring a surplus of resources.
        </p>
      </PopulationInfoBox>
    </Panel>
  );
};

export default ColonistPanel;