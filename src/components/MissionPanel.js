// src/components/MissionPanel.js
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled, { keyframes, css } from 'styled-components';
import { FaListUl, FaTasks, FaCheckCircle, FaLock, FaInfoCircle, FaChevronRight, FaSpaceShuttle, FaTrophy, FaFlask, FaCogs } from 'react-icons/fa';
import { safeNumber } from './SafeWrappers';
import HelpIcon from './HelpIcon';
import Tooltip from './Tooltip';

const PanelContainer = styled.div`
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

const ProgressCounter = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text);
  font-size: 0.9rem;
  font-weight: bold;
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

const MissionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 500px;
  overflow-y: auto;
  padding-right: 8px;
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
`;

const MissionCard = styled.div`
  background: ${props => props.active 
    ? 'var(--hoverBackground)' 
    : props.completed 
      ? 'rgba(72, 187, 120, 0.1)' 
      : 'var(--cardBackground)'
  };
  border: 1px solid ${props => props.active 
    ? 'var(--primary)' 
    : props.completed 
      ? 'var(--success)' 
      : 'var(--border)'
  };
  border-radius: 6px;
  padding: 16px;
  position: relative;
  transition: transform 0.2s, box-shadow 0.2s;
  
  ${props => props.active && css`
    animation: ${pulse} 2s infinite ease-in-out;
  `}
  
  ${props => !props.locked && !props.completed && `
    &:hover {
      transform: translateY(-3px);
      box-shadow: var(--elevatedShadow);
    }
  `}
  
  ${props => props.locked && `
    opacity: 0.6;
  `}
`;

const MissionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const MissionTitle = styled.div`
  font-weight: bold;
  font-size: 1.1rem;
  color: var(--text);
  display: flex;
  align-items: center;
  gap: 8px;
`;

const MissionIcon = styled.span`
  font-size: 1.2rem;
  color: ${props => props.locked 
    ? 'var(--textSecondary)'
    : props.completed 
      ? 'var(--success)' 
      : 'var(--primary)'
  };
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  padding: 4px 8px;
  border-radius: 12px;
  color: white;
  background: ${props => props.completed 
    ? 'var(--success)' 
    : props.active 
      ? 'var(--primary)' 
      : props.locked 
        ? 'var(--textSecondary)' 
        : 'var(--secondary)'
  };
`;

const MissionDescription = styled.div`
  font-size: 0.9rem;
  color: var(--textSecondary);
  margin-bottom: 12px;
  line-height: 1.4;
`;

const RewardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
`;

const Reward = styled.div`
  background: ${props => props.highlighted ? 'var(--primary)' : 'var(--hoverBackground)'};
  color: ${props => props.highlighted ? 'white' : 'var(--text)'};
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const RequirementsTitle = styled.div`
  font-size: 0.8rem;
  font-weight: bold;
  color: var(--textSecondary);
  margin-bottom: 6px;
`;

const RequirementsList = styled.div`
  margin-bottom: 16px;
`;

const RequirementItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
  font-size: 0.9rem;
  color: ${props => props.completed ? 'var(--success)' : 'var(--text)'};
  
  svg {
    color: ${props => props.completed ? 'var(--success)' : 'var(--textSecondary)'};
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: var(--progressBarBackground);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 8px;
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${props => props.percent || 0}%;
  background: ${props => props.color || 'var(--primary)'};
  border-radius: 3px;
  transition: width 0.3s ease;
`;

const ProgressText = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: var(--textSecondary);
`;

const ClaimButton = styled.button`
  width: 100%;
  padding: 8px 16px;
  background: ${props => props.completed ? 'var(--success)' : 'var(--primary)'};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.6 : 1};
  font-weight: bold;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
  
  &:active:not(:disabled) {
    transform: translateY(1px);
  }
`;

const CompletedTag = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--success);
  font-weight: bold;
  margin-top: 8px;
  font-size: 0.9rem;
`;

const MissionDetailsContainer = styled.div`
  background: var(--hoverBackground);
  border-radius: 6px;
  padding: 16px;
  margin-top: 20px;
`;

const DetailHeader = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--text);
  margin-bottom: 12px;
  border-bottom: 1px solid var(--border);
  padding-bottom: 8px;
`;

const DetailSection = styled.div`
  margin-bottom: 16px;
`;

const DetailTitle = styled.div`
  font-weight: bold;
  color: var(--text);
  margin-bottom: 8px;
`;

const DetailText = styled.div`
  font-size: 0.9rem;
  color: var(--textSecondary);
  line-height: 1.5;
`;

// Mock mission data
const missionData = [
  {
    id: 'firstSteps',
    title: 'First Steps',
    description: 'Establish basic resource production to sustain your colony.',
    icon: <FaSpaceShuttle />,
    requirements: [
      { id: 'buildSolar', label: 'Build 5 Solar Panels', target: 5, current: 0, completed: false },
      { id: 'buildMine', label: 'Build 3 Mines', target: 3, current: 0, completed: false },
      { id: 'buildWater', label: 'Build 2 Water Extractors', target: 2, current: 0, completed: false }
    ],
    rewards: [
      { type: 'resource', resource: 'energy', amount: 100 },
      { type: 'resource', resource: 'minerals', amount: 100 },
      { type: 'resource', resource: 'water', amount: 50 },
    ],
    completed: false,
    locked: false,
    active: true,
    spotlight: 'energy'
  },
  {
    id: 'expandColony',
    title: 'Expand Your Colony',
    description: 'Grow your colony with additional buildings and infrastructure.',
    icon: <FaTasks />,
    requirements: [
      { id: 'buildFarm', label: 'Build 3 Farms', target: 3, current: 0, completed: false },
      { id: 'buildHabitat', label: 'Build 1 Habitat', target: 1, current: 0, completed: false },
      { id: 'reachPopulation', label: 'Reach 5 Population', target: 5, current: 0, completed: false }
    ],
    rewards: [
      { type: 'resource', resource: 'food', amount: 200 },
      { type: 'resource', resource: 'water', amount: 150 },
      { type: 'resource', resource: 'energy', amount: 150 },
    ],
    completed: false,
    locked: true,
    active: false,
    spotlight: 'population'
  },
  {
    id: 'scientificProgress',
    title: 'Scientific Progress',
    description: 'Develop your research capabilities and unlock new technologies.',
    icon: <FaFlask />,
    requirements: [
      { id: 'buildLab', label: 'Build 2 Research Labs', target: 2, current: 0, completed: false },
      { id: 'assignScientist', label: 'Assign 3 Scientists', target: 3, current: 0, completed: false },
      { id: 'researchTech', label: 'Research 3 Technologies', target: 3, current: 0, completed: false }
    ],
    rewards: [
      { type: 'resource', resource: 'research', amount: 300 },
      { type: 'building', building: 'advancedLab', count: 1 },
      { type: 'technology', technology: 'efficientResearch' }
    ],
    completed: false,
    locked: true,
    active: false,
    spotlight: 'research'
  },
  {
    id: 'industrialRevolution',
    title: 'Industrial Revolution',
    description: 'Establish an industrial base for advanced manufacturing.',
    icon: <FaCogs />,
    requirements: [
      { id: 'buildFactory', label: 'Build 2 Factories', target: 2, current: 0, completed: false },
      { id: 'assignEngineers', label: 'Assign 5 Engineers', target: 5, current: 0, completed: false },
      { id: 'produceComponents', label: 'Produce 50 Components', target: 50, current: 0, completed: false }
    ],
    rewards: [
      { type: 'resource', resource: 'components', amount: 100 },
      { type: 'resource', resource: 'minerals', amount: 300 },
      { type: 'resource', resource: 'energy', amount: 300 }
    ],
    completed: false,
    locked: true,
    active: false,
    spotlight: 'components'
  }
];

const MissionPanel = () => {
  const dispatch = useDispatch();
  const resources = useSelector(state => state.game.resources);
  const buildings = useSelector(state => state.game.buildings);
  const [activeTab, setActiveTab] = useState('current');
  const [selectedMission, setSelectedMission] = useState(null);
  
  // In a real implementation, you'd access this from Redux state
  const [missions, setMissions] = useState(missionData.map(mission => {
    return {
      ...mission,
      requirements: mission.requirements.map(req => {
        // For this demo, set fake progress values
        let currentValue = 0;
        
        if (req.id === 'buildSolar') {
          currentValue = safeNumber(buildings.solarPanel?.count, 0);
        } else if (req.id === 'buildMine') {
          currentValue = safeNumber(buildings.mine?.count, 0);
        } else if (req.id === 'buildWater') {
          currentValue = safeNumber(buildings.waterExtractor?.count, 0);
        } else if (req.id === 'buildFarm') {
          currentValue = safeNumber(buildings.farm?.count, 0);
        } else if (req.id === 'buildHabitat') {
          currentValue = safeNumber(buildings.habitat?.count, 0);
        } else if (req.id === 'reachPopulation') {
          currentValue = Math.floor(safeNumber(resources.population, 0));
        }
        
        return {
          ...req,
          current: currentValue,
          completed: currentValue >= req.target
        };
      })
    };
  }));
  
  // Get current active missions
  const currentMissions = missions.filter(mission => !mission.completed && !mission.locked);
  const completedMissions = missions.filter(mission => mission.completed);
  const lockedMissions = missions.filter(mission => mission.locked && !mission.completed);
  
  // Calculate overall mission progress for display
  const totalMissions = missions.length;
  const completedCount = completedMissions.length;
  const progressPercent = (completedCount / totalMissions) * 100;
  
  // Calculate completion status for a mission
  const getMissionProgress = (mission) => {
    const totalRequirements = mission.requirements.length;
    const completedRequirements = mission.requirements.filter(req => req.completed).length;
    return {
      completedCount: completedRequirements,
      totalCount: totalRequirements,
      percent: (completedRequirements / totalRequirements) * 100
    };
  };
  
  // Handle claiming mission rewards
  const handleClaimRewards = (missionId) => {
    // Find the mission
    const mission = missions.find(m => m.id === missionId);
    if (!mission) return;
    
    // In a real implementation, you'd dispatch an action to update the game state
    // and apply the rewards
    
    // Mark the mission as completed
    setMissions(prevMissions => {
      return prevMissions.map(m => {
        if (m.id === missionId) {
          return { ...m, completed: true, active: false };
        }
        
        // Unlock the next mission if this one is completed
        if (m.locked && prevMissions.findIndex(pm => pm.id === missionId) + 1 === prevMissions.findIndex(pm => pm.id === m.id)) {
          return { ...m, locked: false, active: true };
        }
        
        return m;
      });
    });
    
    // Clear the selected mission if it was this one
    if (selectedMission && selectedMission.id === missionId) {
      setSelectedMission(null);
    }
    
    // dispatch(claimMissionRewards({ missionId }));
  };
  
  return (
    <PanelContainer>
      <PanelHeader>
        <Title>
          <FaListUl /> Colony Missions
          <HelpIcon tooltip="Complete missions to earn rewards and advance your colony's development." />
        </Title>
        <ProgressCounter>
          <FaTrophy /> {completedCount}/{totalMissions} Completed
        </ProgressCounter>
      </PanelHeader>
      
      <TabsContainer>
        <Tab 
          active={activeTab === 'current'} 
          onClick={() => setActiveTab('current')}
        >
          Active Missions
        </Tab>
        <Tab 
          active={activeTab === 'completed'} 
          onClick={() => setActiveTab('completed')}
        >
          Completed
        </Tab>
        <Tab 
          active={activeTab === 'locked'} 
          onClick={() => setActiveTab('locked')}
        >
          Locked
        </Tab>
      </TabsContainer>
      
      {activeTab === 'current' && (
        <>
          <MissionsList>
            {currentMissions.length > 0 ? (
              currentMissions.map(mission => {
                const progress = getMissionProgress(mission);
                const canClaim = progress.percent === 100 && !mission.completed;
                
                return (
                  <MissionCard 
                    key={mission.id}
                    active={mission.active}
                    completed={mission.completed}
                    onClick={() => setSelectedMission(mission)}
                  >
                    <MissionHeader>
                      <MissionTitle>
                        <MissionIcon completed={mission.completed}>
                          {mission.icon}
                        </MissionIcon>
                        {mission.title}
                      </MissionTitle>
                      
                      <StatusIndicator active={mission.active}>
                        {mission.active ? 'ACTIVE' : 'AVAILABLE'}
                      </StatusIndicator>
                    </MissionHeader>
                    
                    <MissionDescription>
                      {mission.description}
                    </MissionDescription>
                    
                    <RequirementsTitle>Requirements:</RequirementsTitle>
                    <RequirementsList>
                      {mission.requirements.map(req => (
                        <RequirementItem key={req.id} completed={req.completed}>
                          {req.completed ? <FaCheckCircle /> : <FaChevronRight />}
                          {req.label} ({req.current}/{req.target})
                        </RequirementItem>
                      ))}
                    </RequirementsList>
                    
                    <ProgressBar>
                      <ProgressFill 
                        percent={progress.percent}
                        color={progress.percent === 100 ? 'var(--success)' : 'var(--primary)'}
                      />
                    </ProgressBar>
                    
                    <ProgressText>
                      <span>Progress: {progress.completedCount}/{progress.totalCount}</span>
                      <span>{progress.percent.toFixed(0)}%</span>
                    </ProgressText>
                    
                    <ClaimButton 
                      onClick={() => handleClaimRewards(mission.id)}
                      disabled={!canClaim}
                      completed={mission.completed}
                    >
                      {canClaim ? (
                        <>
                          <FaTrophy /> Claim Rewards
                        </>
                      ) : (
                        <>
                          <FaTasks /> In Progress
                        </>
                      )}
                    </ClaimButton>
                  </MissionCard>
                );
              })
            ) : (
              <div>No active missions available.</div>
            )}
          </MissionsList>
          
          {selectedMission && (
            <MissionDetailsContainer>
              <DetailHeader>
                Mission Details: {selectedMission.title}
              </DetailHeader>
              
              <DetailSection>
                <DetailTitle>Description</DetailTitle>
                <DetailText>{selectedMission.description}</DetailText>
              </DetailSection>
              
              <DetailSection>
                <DetailTitle>Rewards</DetailTitle>
                <RewardContainer>
                  {selectedMission.rewards.map((reward, index) => (
                    <Tooltip
                      key={index}
                      content={`${reward.type === 'resource' 
                        ? `Gain ${reward.amount} ${reward.resource}` 
                        : reward.type === 'building' 
                          ? `Unlock a free ${reward.building}` 
                          : `Unlock ${reward.technology} technology`}`}
                    >
                      <Reward highlighted={reward.resource === selectedMission.spotlight}>
                        {reward.type === 'resource' && (
                          <>{reward.resource.charAt(0).toUpperCase() + reward.resource.slice(1)}: +{reward.amount}</>
                        )}
                        {reward.type === 'building' && (
                          <>Free {reward.building}</>
                        )}
                        {reward.type === 'technology' && (
                          <>Unlock: {reward.technology}</>
                        )}
                      </Reward>
                    </Tooltip>
                  ))}
                </RewardContainer>
              </DetailSection>
              
              <DetailSection>
                <DetailTitle>Completion Criteria</DetailTitle>
                <DetailText>
                  Complete all required objectives to claim your rewards. Each requirement contributes to the overall mission progress.
                </DetailText>
              </DetailSection>
            </MissionDetailsContainer>
          )}
        </>
      )}
      
      {activeTab === 'completed' && (
        <MissionsList>
          {completedMissions.length > 0 ? (
            completedMissions.map(mission => (
              <MissionCard 
                key={mission.id}
                completed={true}
                onClick={() => setSelectedMission(mission)}
              >
                <MissionHeader>
                  <MissionTitle>
                    <MissionIcon completed={true}>
                      {mission.icon}
                    </MissionIcon>
                    {mission.title}
                  </MissionTitle>
                  
                  <StatusIndicator completed={true}>
                    COMPLETED
                  </StatusIndicator>
                </MissionHeader>
                
                <MissionDescription>
                  {mission.description}
                </MissionDescription>
                
                <RequirementsTitle>Requirements:</RequirementsTitle>
                <RequirementsList>
                  {mission.requirements.map(req => (
                    <RequirementItem key={req.id} completed={true}>
                      <FaCheckCircle />
                      {req.label}
                    </RequirementItem>
                  ))}
                </RequirementsList>
                
                <CompletedTag>
                  <FaCheckCircle /> Mission Completed - Rewards Claimed
                </CompletedTag>
              </MissionCard>
            ))
          ) : (
            <div>No completed missions yet.</div>
          )}
        </MissionsList>
      )}
      
      {activeTab === 'locked' && (
        <MissionsList>
          {lockedMissions.length > 0 ? (
            lockedMissions.map(mission => (
              <MissionCard 
                key={mission.id}
                locked={true}
              >
                <MissionHeader>
                  <MissionTitle>
                    <MissionIcon locked={true}>
                      <FaLock />
                    </MissionIcon>
                    {mission.title}
                  </MissionTitle>
                  
                  <StatusIndicator locked={true}>
                    LOCKED
                  </StatusIndicator>
                </MissionHeader>
                
                <MissionDescription>
                  {mission.description}
                </MissionDescription>
                
                <RequirementsTitle>Unlock Requirement:</RequirementsTitle>
                <RequirementItem>
                  <FaInfoCircle />
                  Complete previous mission to unlock
                </RequirementItem>
              </MissionCard>
            ))
          ) : (
            <div>No locked missions available.</div>
          )}
        </MissionsList>
      )}
    </PanelContainer>
  );
};

export default MissionPanel;