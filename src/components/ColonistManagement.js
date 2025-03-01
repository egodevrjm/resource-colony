// src/components/ColonistManagement.js
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { FaUsers, FaUserPlus, FaUserMinus, FaUserCog, FaFlask, FaCogs, FaHammer, FaLeaf, FaWrench, FaInfo } from 'react-icons/fa';
import { safeNumber } from './SafeWrappers';
import Tooltip from './Tooltip';
import HelpIcon from './HelpIcon';

const ColonistPanel = styled.div`
  background: var(--cardBackground);
  border-radius: 8px;
  padding: 16px;
  box-shadow: var(--panelShadow);
`;

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  border-bottom: 1px solid var(--border);
  padding-bottom: 8px;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.2rem;
  color: var(--text);
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PopulationCounter = styled.div`
  font-size: 1rem;
  font-weight: bold;
  color: var(--text);
  background: var(--hoverBackground);
  padding: 4px 10px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const ColonistSummary = styled.div`
  background: var(--hoverBackground);
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SummaryItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SummaryLabel = styled.div`
  font-size: 0.8rem;
  color: var(--textSecondary);
  margin-bottom: 4px;
`;

const SummaryValue = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--text);
`;

const GrowthStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding: 8px 12px;
  border-radius: 6px;
  background: ${props => props.positive ? 'rgba(72, 187, 120, 0.1)' : 'rgba(245, 101, 101, 0.1)'};
  color: ${props => props.positive ? 'var(--success)' : 'var(--danger)'};
  font-size: 0.9rem;
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`;

const Tab = styled.button`
  padding: 8px 16px;
  background: ${props => props.active ? 'var(--primary)' : 'transparent'};
  color: ${props => props.active ? 'white' : 'var(--text)'};
  border: 1px solid ${props => props.active ? 'var(--primary)' : 'var(--border)'};
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
  
  &:hover {
    background: ${props => props.active ? 'var(--primary)' : 'var(--hoverBackground)'};
  }
`;

const RolesList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
`;

const RoleCard = styled.div`
  background: var(--cardBackground);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 12px;
  position: relative;
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: var(--elevatedShadow);
    border-color: var(--primary);
  }
`;

const RoleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const RoleName = styled.div`
  font-weight: bold;
  color: var(--text);
  display: flex;
  align-items: center;
  gap: 8px;
`;

const RoleIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => props.color || 'var(--primary)'};
  color: white;
  font-size: 1rem;
`;

const RoleDescription = styled.div`
  font-size: 0.85rem;
  color: var(--textSecondary);
  margin-bottom: 12px;
  line-height: 1.4;
`;

const RoleStats = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const RoleStat = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const RoleStatLabel = styled.div`
  font-size: 0.7rem;
  color: var(--textSecondary);
`;

const RoleStatValue = styled.div`
  font-size: 0.9rem;
  font-weight: bold;
  color: var(--text);
`;

const RoleActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AssignButton = styled.button`
  padding: 6px 12px;
  background: ${props => props.disabled ? 'var(--hoverBackground)' : 'var(--primary)'};
  color: ${props => props.disabled ? 'var(--textSecondary)' : 'white'};
  border: none;
  border-radius: 4px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s;
  
  &:hover:not(:disabled) {
    background: var(--primaryButtonHover);
    transform: translateY(-2px);
  }
`;

const RemoveButton = styled(AssignButton)`
  background: ${props => props.disabled ? 'var(--hoverBackground)' : 'var(--danger)'};
  
  &:hover:not(:disabled) {
    background: #e53e3e;
  }
`;

const AssignedCount = styled.div`
  font-size: 0.9rem;
  font-weight: bold;
  color: var(--text);
  background: var(--hoverBackground);
  padding: 4px 8px;
  border-radius: 4px;
`;

const NoColonistsMessage = styled.div`
  text-align: center;
  padding: 30px;
  color: var(--textSecondary);
  background: var(--hoverBackground);
  border-radius: 8px;
  border: 1px dashed var(--border);
  font-style: italic;
`;

const InfoNote = styled.div`
  font-size: 0.85rem;
  color: var(--textSecondary);
  background: var(--hoverBackground);
  padding: 8px 12px;
  border-radius: 4px;
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

// Mock data for colonist roles
const roleDefinitions = [
  {
    id: 'scientist',
    name: 'Scientist',
    icon: <FaFlask />,
    color: '#9f7aea',
    description: 'Scientists boost research production and enable advanced technological breakthroughs.',
    effects: {
      research: 0.1, // +10% research per scientist
    }
  },
  {
    id: 'engineer',
    name: 'Engineer',
    icon: <FaCogs />,
    color: '#a0aec0',
    description: 'Engineers improve component production efficiency and reduce building costs.',
    effects: {
      components: 0.1, // +10% component production
      buildingCost: -0.05, // -5% building cost per engineer
    }
  },
  {
    id: 'miner',
    name: 'Miner',
    icon: <FaHammer />,
    color: '#63b3ed',
    description: 'Miners improve mineral extraction rates from mines and drilling sites.',
    effects: {
      minerals: 0.15, // +15% mineral production
    }
  },
  {
    id: 'farmer',
    name: 'Farmer',
    icon: <FaLeaf />,
    color: '#68d391',
    description: 'Farmers increase food production and enable larger population growth.',
    effects: {
      food: 0.15, // +15% food production
      populationGrowth: 0.05, // +5% population growth
    }
  },
  {
    id: 'technician',
    name: 'Technician',
    icon: <FaWrench />,
    color: '#f6ad55',
    description: 'Technicians improve energy production efficiency and maintain infrastructure.',
    effects: {
      energy: 0.15, // +15% energy production
      waterProduction: 0.1, // +10% water production
    }
  }
];

const ColonistManagement = () => {
  const dispatch = useDispatch();
  const resources = useSelector(state => state.game.resources);
  const buildings = useSelector(state => state.game.buildings);
  const [activeTab, setActiveTab] = useState('roles');
  
  // Assuming these would be part of your gameState in reality
  const [assignedRoles, setAssignedRoles] = useState({
    scientist: 0,
    engineer: 0,
    miner: 0,
    farmer: 0,
    technician: 0
  });
  
  const totalPopulation = safeNumber(resources.population, 0);
  const assignedPopulation = Object.values(assignedRoles).reduce((sum, count) => sum + count, 0);
  const unassignedPopulation = totalPopulation - assignedPopulation;
  
  // Mock growth rate
  const growthRate = safeNumber(buildings.habitat?.count, 0) * 0.05;
  const canGrow = buildings.farm?.count > 0 && buildings.waterExtractor?.count > 0;
  
  const handleAssignRole = (roleId) => {
    if (unassignedPopulation <= 0) return;
    
    setAssignedRoles(prev => ({
      ...prev,
      [roleId]: prev[roleId] + 1
    }));
    
    // In a real implementation, you'd dispatch an action to update the game state
    // dispatch(assignColonistRole({ roleId }));
  };
  
  const handleRemoveRole = (roleId) => {
    if (assignedRoles[roleId] <= 0) return;
    
    setAssignedRoles(prev => ({
      ...prev,
      [roleId]: prev[roleId] - 1
    }));
    
    // In a real implementation, you'd dispatch an action to update the game state
    // dispatch(removeColonistRole({ roleId }));
  };
  
  // Calculate efficiency bonuses based on role assignments
  const calculateEfficiencyBonus = (resource) => {
    let bonus = 0;
    
    roleDefinitions.forEach(role => {
      if (role.effects[resource]) {
        bonus += role.effects[resource] * assignedRoles[role.id];
      }
    });
    
    return (bonus * 100).toFixed(0);
  };
  
  return (
    <ColonistPanel>
      <PanelHeader>
        <Title>
          <FaUsers /> Colony Population
          <HelpIcon tooltip="Manage your colonists by assigning them to specialized roles to maximize efficiency." />
        </Title>
        <PopulationCounter>
          <FaUsers /> {totalPopulation}
        </PopulationCounter>
      </PanelHeader>
      
      <ColonistSummary>
        <SummaryItem>
          <SummaryLabel>Total</SummaryLabel>
          <SummaryValue>{totalPopulation}</SummaryValue>
        </SummaryItem>
        <SummaryItem>
          <SummaryLabel>Assigned</SummaryLabel>
          <SummaryValue>{assignedPopulation}</SummaryValue>
        </SummaryItem>
        <SummaryItem>
          <SummaryLabel>Unassigned</SummaryLabel>
          <SummaryValue>{unassignedPopulation}</SummaryValue>
        </SummaryItem>
        <SummaryItem>
          <SummaryLabel>Habitats</SummaryLabel>
          <SummaryValue>{safeNumber(buildings.habitat?.count, 0)}</SummaryValue>
        </SummaryItem>
        <SummaryItem>
          <SummaryLabel>Capacity</SummaryLabel>
          <SummaryValue>{safeNumber(buildings.habitat?.count, 0) * 5}</SummaryValue>
        </SummaryItem>
      </ColonistSummary>
      
      <GrowthStatus positive={canGrow && growthRate > 0}>
        {canGrow 
          ? growthRate > 0 
            ? <><FaUserPlus /> Population growing at {(growthRate).toFixed(2)} colonists/min</>
            : <><FaUserMinus /> Population growth stalled - build more habitats</>
          : <><FaUserMinus /> Cannot grow - need food and water production</>
        }
      </GrowthStatus>
      
      <TabsContainer>
        <Tab 
          active={activeTab === 'roles'} 
          onClick={() => setActiveTab('roles')}
        >
          Colonist Roles
        </Tab>
        <Tab 
          active={activeTab === 'efficiency'} 
          onClick={() => setActiveTab('efficiency')}
        >
          Efficiency Bonuses
        </Tab>
      </TabsContainer>
      
      {activeTab === 'roles' && (
        <>
          {totalPopulation > 0 ? (
            <RolesList>
              {roleDefinitions.map(role => (
                <RoleCard key={role.id}>
                  <RoleHeader>
                    <RoleName>
                      <RoleIcon color={role.color}>
                        {role.icon}
                      </RoleIcon>
                      {role.name}
                    </RoleName>
                    
                    <Tooltip content="Current number of colonists assigned to this role">
                      <AssignedCount>
                        {assignedRoles[role.id]}
                      </AssignedCount>
                    </Tooltip>
                  </RoleHeader>
                  
                  <RoleDescription>
                    {role.description}
                  </RoleDescription>
                  
                  <RoleStats>
                    {Object.entries(role.effects).map(([effect, value]) => (
                      <RoleStat key={effect}>
                        <RoleStatLabel>
                          {effect.charAt(0).toUpperCase() + effect.slice(1)}
                        </RoleStatLabel>
                        <RoleStatValue>
                          {value > 0 ? '+' : ''}{value * 100}%
                        </RoleStatValue>
                      </RoleStat>
                    ))}
                  </RoleStats>
                  
                  <RoleActions>
                    <AssignButton 
                      onClick={() => handleAssignRole(role.id)}
                      disabled={unassignedPopulation <= 0}
                      title={unassignedPopulation <= 0 ? "No unassigned colonists available" : "Assign colonist to this role"}
                    >
                      <FaUserPlus /> Assign
                    </AssignButton>
                    
                    <RemoveButton
                      onClick={() => handleRemoveRole(role.id)}
                      disabled={assignedRoles[role.id] <= 0}
                      title={assignedRoles[role.id] <= 0 ? "No colonists assigned to this role" : "Remove colonist from this role"}
                    >
                      <FaUserMinus /> Remove
                    </RemoveButton>
                  </RoleActions>
                </RoleCard>
              ))}
            </RolesList>
          ) : (
            <NoColonistsMessage>
              No colonists available yet. Build habitats to grow your population.
            </NoColonistsMessage>
          )}
          
          <InfoNote>
            <FaInfo /> 
            <span>Assigning roles to your colonists provides efficiency bonuses to different parts of your colony.</span>
          </InfoNote>
        </>
      )}
      
      {activeTab === 'efficiency' && (
        <>
          <RolesList>
            <RoleCard>
              <RoleName>Energy Production</RoleName>
              <RoleStatValue>+{calculateEfficiencyBonus('energy')}%</RoleStatValue>
            </RoleCard>
            
            <RoleCard>
              <RoleName>Mineral Production</RoleName>
              <RoleStatValue>+{calculateEfficiencyBonus('minerals')}%</RoleStatValue>
            </RoleCard>
            
            <RoleCard>
              <RoleName>Food Production</RoleName>
              <RoleStatValue>+{calculateEfficiencyBonus('food')}%</RoleStatValue>
            </RoleCard>
            
            <RoleCard>
              <RoleName>Water Production</RoleName>
              <RoleStatValue>+{calculateEfficiencyBonus('waterProduction')}%</RoleStatValue>
            </RoleCard>
            
            <RoleCard>
              <RoleName>Research Speed</RoleName>
              <RoleStatValue>+{calculateEfficiencyBonus('research')}%</RoleStatValue>
            </RoleCard>
            
            <RoleCard>
              <RoleName>Component Production</RoleName>
              <RoleStatValue>+{calculateEfficiencyBonus('components')}%</RoleStatValue>
            </RoleCard>
            
            <RoleCard>
              <RoleName>Building Cost Reduction</RoleName>
              <RoleStatValue>-{calculateEfficiencyBonus('buildingCost')}%</RoleStatValue>
            </RoleCard>
            
            <RoleCard>
              <RoleName>Population Growth</RoleName>
              <RoleStatValue>+{calculateEfficiencyBonus('populationGrowth')}%</RoleStatValue>
            </RoleCard>
          </RolesList>
        </>
      )}
    </ColonistPanel>
  );
};

export default ColonistManagement;