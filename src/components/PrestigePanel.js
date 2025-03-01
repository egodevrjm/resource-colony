// src/components/PrestigePanel.js
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { prestige, spendPrestigePoints, calculatePrestigePoints } from '../redux/gameSlice';
import { FaRedo, FaBolt, FaHandPointer, FaCoins, FaFlask } from 'react-icons/fa';
import { safeNumber } from './SafeWrappers';

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

const PrestigeInfoContainer = styled.div`
  background: white;
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 16px;
`;

const PrestigeDescription = styled.p`
  margin: 0 0 16px 0;
  color: #4a5568;
`;

const PrestigePointsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 12px;
  background: #ebf8ff;
  border-radius: 6px;
`;

const PrestigePoints = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: #2b6cb0;
`;

const PointsLabel = styled.div`
  font-size: 0.9rem;
  color: #4a5568;
`;

const MultipliersGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin-bottom: 16px;
`;

const MultiplierItem = styled.div`
  background: white;
  border-radius: 6px;
  padding: 12px;
  border: 1px solid #e2e8f0;
`;

const MultiplierHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const MultiplierName = styled.div`
  font-weight: bold;
  color: #2d3748;
  display: flex;
  align-items: center;
`;

const MultiplierIcon = styled.span`
  margin-right: 8px;
  color: #4299e1;
`;

const MultiplierValue = styled.div`
  font-weight: bold;
  color: #2b6cb0;
`;

const MultiplierDescription = styled.div`
  font-size: 0.8rem;
  color: #718096;
  margin-bottom: 8px;
`;

const PointsControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
`;

const PointsInput = styled.div`
  display: flex;
  align-items: center;
`;

const PointsButton = styled.button`
  width: 30px;
  height: 30px;
  border-radius: 4px;
  border: none;
  background: #e2e8f0;
  color: #4a5568;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: #cbd5e0;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PointsValue = styled.div`
  width: 40px;
  text-align: center;
  font-weight: bold;
  color: #2d3748;
`;

const SpendButton = styled.button`
  background-color: #4299e1;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
  font-weight: bold;
  
  &:hover {
    background-color: #3182ce;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PrestigeButtonContainer = styled.div`
  margin-top: 16px;
`;

const PrestigeButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: ${props => props.disabled ? '#cbd5e0' : '#805ad5'};
  color: white;
  border: none;
  border-radius: 6px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-weight: bold;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  
  &:hover:not(:disabled) {
    background-color: #6b46c1;
  }
`;

const PrestigeButtonIcon = styled.span`
  margin-right: 8px;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ModalTitle = styled.h2`
  margin-top: 0;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e2e8f0;
`;

const ModalFooter = styled.div`
  margin-top: 20px;
  padding-top: 10px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const Button = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  
  background-color: ${props => 
    props.danger ? '#f56565' : 
    props.primary ? '#4299e1' : 
    '#e2e8f0'};
    
  color: ${props => 
    (props.danger || props.primary) ? 'white' : '#4a5568'};
  
  &:hover {
    background-color: ${props => 
      props.danger ? '#e53e3e' : 
      props.primary ? '#3182ce' : 
      '#cbd5e0'};
  }
`;

const PrestigePanel = ({ addNotification }) => {
  const dispatch = useDispatch();
  const prestigeState = useSelector(state => state.game.prestige);
  const resources = useSelector(state => state.game.resources);
  const buildings = useSelector(state => state.game.buildings);
  
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [pointsToSpend, setPointsToSpend] = useState({
    productionSpeed: 0,
    clickValue: 0,
    buildingCost: 0,
    researchSpeed: 0
  });
  
  // Calculate potential prestige points
  const potentialPoints = safeNumber(calculatePrestigePoints({ resources, buildings }), 0);
  
  const handlePointChange = (multiplier, amount) => {
    setPointsToSpend(prev => ({
      ...prev,
      [multiplier]: Math.max(0, prev[multiplier] + amount)
    }));
  };
  
  const canSpendPoints = (multiplier) => {
    return pointsToSpend[multiplier] > 0 && prestigeState.availablePoints >= pointsToSpend[multiplier];
  };
  
  const handleSpendPoints = (multiplier) => {
    if (canSpendPoints(multiplier)) {
      dispatch(spendPrestigePoints({ 
        multiplier, 
        amount: pointsToSpend[multiplier] 
      }));
      
      addNotification && addNotification(
        'Prestige Points Spent', 
        `Applied ${pointsToSpend[multiplier]} points to ${multiplier} multiplier.`, 
        'success'
      );
      
      setPointsToSpend(prev => ({
        ...prev,
        [multiplier]: 0
      }));
    }
  };
  
  const handlePrestige = () => {
    dispatch(prestige());
    if (addNotification) {
      addNotification(
        'Colony Reset', 
        `Your colony has been reset with ${potentialPoints} prestige points.`, 
        'success'
      );
    }
    setConfirmModalOpen(false);
  };
  
  const multiplierInfo = {
    productionSpeed: {
      name: 'Production Speed',
      icon: <FaBolt />,
      description: 'Increases the rate at which all buildings produce resources (+10% per point)'
    },
    clickValue: {
      name: 'Click Value',
      icon: <FaHandPointer />,
      description: 'Increases the amount of resources gained from manual collection (+20% per point)'
    },
    buildingCost: {
      name: 'Building Cost Reduction',
      icon: <FaCoins />,
      description: 'Reduces the cost of buildings (-5% per point, minimum 50% of original)'
    },
    researchSpeed: {
      name: 'Research Speed',
      icon: <FaFlask />,
      description: 'Increases the rate at which research is generated (+10% per point)'
    }
  };
  
  return (
    <Panel>
      <PanelTitle>Prestige</PanelTitle>
      
      <PrestigeInfoContainer>
        <PrestigeDescription>
          Prestige allows you to reset your progress and start over with powerful permanent bonuses.
          The more resources and buildings you have, the more prestige points you'll earn.
        </PrestigeDescription>
        
        <PrestigePointsContainer>
          <div>
            <PointsLabel>Available Points</PointsLabel>
            <PrestigePoints>{prestigeState.availablePoints}</PrestigePoints>
          </div>
          <div>
            <PointsLabel>Total Earned</PointsLabel>
            <PrestigePoints>{prestigeState.totalEarned}</PrestigePoints>
          </div>
          <div>
            <PointsLabel>Potential Points</PointsLabel>
            <PrestigePoints>{potentialPoints}</PrestigePoints>
          </div>
        </PrestigePointsContainer>
        
        <MultipliersGrid>
          {Object.entries(multiplierInfo).map(([key, info]) => (
            <MultiplierItem key={key}>
              <MultiplierHeader>
                <MultiplierName>
                  <MultiplierIcon>{info.icon}</MultiplierIcon>
                  {info.name}
                </MultiplierName>
                <MultiplierValue>
                  {key === 'buildingCost' 
                    ? `${(100 - prestigeState.multipliers[key] * 100).toFixed(0)}%` 
                    : `${(prestigeState.multipliers[key] * 100).toFixed(0)}%`}
                </MultiplierValue>
              </MultiplierHeader>
              
              <MultiplierDescription>{info.description}</MultiplierDescription>
              
              <PointsControls>
                <PointsInput>
                  <PointsButton 
                    onClick={() => handlePointChange(key, -1)}
                    disabled={pointsToSpend[key] <= 0}
                  >
                    -
                  </PointsButton>
                  <PointsValue>{pointsToSpend[key]}</PointsValue>
                  <PointsButton 
                    onClick={() => handlePointChange(key, 1)}
                    disabled={pointsToSpend[key] >= prestigeState.availablePoints}
                  >
                    +
                  </PointsButton>
                </PointsInput>
                
                <SpendButton 
                  onClick={() => handleSpendPoints(key)}
                  disabled={!canSpendPoints(key)}
                >
                  Apply
                </SpendButton>
              </PointsControls>
            </MultiplierItem>
          ))}
        </MultipliersGrid>
        
        <PrestigeButtonContainer>
          <PrestigeButton 
            onClick={() => setConfirmModalOpen(true)}
            disabled={potentialPoints <= 0}
          >
            <PrestigeButtonIcon><FaRedo /></PrestigeButtonIcon>
            Reset Colony ({potentialPoints} points)
          </PrestigeButton>
        </PrestigeButtonContainer>
      </PrestigeInfoContainer>
      
      {/* Confirmation Modal */}
      {confirmModalOpen && (
        <ModalOverlay onClick={() => setConfirmModalOpen(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalTitle>Confirm Prestige Reset</ModalTitle>
            
            <p>Are you sure you want to reset your colony? You will:</p>
            
            <ul>
              <li>Lose all current resources, buildings, upgrades, and research</li>
              <li>Gain {potentialPoints} prestige points</li>
              <li>Keep your current prestige upgrades</li>
              <li>Start over from the beginning</li>
            </ul>
            
            <p>This action cannot be undone.</p>
            
            <ModalFooter>
              <Button danger onClick={handlePrestige}>Reset Colony</Button>
              <Button onClick={() => setConfirmModalOpen(false)}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}
    </Panel>
  );
};

export default PrestigePanel;