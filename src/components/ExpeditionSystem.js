// src/components/ExpeditionSystem.js
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import { 
  FaUsers, FaMapMarkedAlt, FaHourglassHalf, 
  FaCheckCircle, FaExclamationTriangle, FaTimesCircle, 
  FaPlay, FaRedo, FaSpaceShuttle, FaCrosshairs, FaSatellite,
  FaMountain, FaWater, FaTree, FaLock, FaInfoCircle, 
  FaList, FaHistory, FaPlusCircle, FaCubes, FaFlask
} from 'react-icons/fa';
import { safeNumber } from './SafeWrappers';
import Tooltip from './Tooltip';
import HelpIcon from './HelpIcon';

// Styled components for the expedition panel
const Panel = styled.div`
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

const ExpeditionIntro = styled.p`
  color: var(--textSecondary);
  font-size: 0.9rem;
  margin-bottom: 16px;
  line-height: 1.5;
`;

const ExpeditionsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
`;

const ExpeditionCard = styled.div`
  background: var(--hoverBackground);
  border: 1px solid ${props => props.active 
    ? 'var(--primary)' 
    : props.completed 
      ? 'var(--success)' 
      : props.locked 
        ? 'var(--border)' 
        : 'var(--border)'};
  border-radius: 6px;
  padding: 16px;
  position: relative;
  transition: transform 0.2s, box-shadow 0.2s;
  
  ${props => props.locked ? `
    opacity: 0.7;
  ` : `
    &:hover {
      transform: translateY(-3px);
      box-shadow: var(--elevatedShadow);
    }
  `}
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const ExpeditionTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  color: var(--text);
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ExpeditionIcon = styled.span`
  color: ${props => props.color || 'var(--primary)'};
  display: flex;
  align-items: center;
`;

const StatusBadge = styled.div`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: bold;
  text-transform: uppercase;
  color: white;
  background-color: ${props => props.status === 'active' 
    ? 'var(--primary)' 
    : props.status === 'completed' 
      ? 'var(--success)' 
      : props.status === 'failed' 
        ? 'var(--danger)' 
        : props.status === 'locked' 
          ? 'var(--textSecondary)' 
          : 'var(--secondary)'};
`;

const ExpeditionDescription = styled.p`
  color: var(--textSecondary);
  font-size: 0.9rem;
  margin-bottom: 12px;
  line-height: 1.4;
`;

const LocationInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--textSecondary);
  font-size: 0.85rem;
  margin-bottom: 8px;
`;

const RequirementsList = styled.div`
  margin-bottom: 12px;
`;

const RequirementItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.9rem;
  color: ${props => props.met ? 'var(--success)' : 'var(--danger)'};
  margin-bottom: 6px;
  padding: 4px 8px;
  background: ${props => props.met 
    ? 'rgba(72, 187, 120, 0.1)' 
    : 'rgba(245, 101, 101, 0.1)'};
  border-radius: 4px;
`;

const RequirementLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const RequirementValue = styled.div`
  font-weight: bold;
`;

const RewardItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.9rem;
  color: var(--text);
  margin-bottom: 4px;
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(66, 153, 225, 0.5); }
  70% { box-shadow: 0 0 0 8px rgba(66, 153, 225, 0); }
  100% { box-shadow: 0 0 0 0 rgba(66, 153, 225, 0); }
`;

const progress = keyframes`
  0% { width: 0%; }
  100% { width: 100%; }
`;

const DurationBar = styled.div`
  width: 100%;
  height: 8px;
  background: var(--progressBarBackground);
  border-radius: 4px;
  overflow: hidden;
  margin: 10px 0;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: ${props => props.status === 'active' 
    ? 'var(--primary)' 
    : props.status === 'completed' 
      ? 'var(--success)' 
      : 'var(--danger)'};
  width: ${props => props.percent || 0}%;
  border-radius: 4px;
  transition: width 1s linear;
  animation: ${props => props.animate ? progress : 'none'} ${props => props.duration || '60s'} linear forwards;
`;

const TimerText = styled.div`
  font-size: 0.8rem;
  color: var(--textSecondary);
  text-align: center;
  margin-bottom: 10px;
`;

const ExpeditionButton = styled.button`
  width: 100%;
  padding: 8px 12px;
  background: ${props => 
    props.success 
      ? 'var(--success)' 
      : props.danger 
        ? 'var(--danger)' 
        : 'var(--primaryButton)'};
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
  margin-top: 16px;
  
  &:hover:not(:disabled) {
    background: ${props => 
      props.success 
        ? '#38a169' 
        : props.danger 
          ? '#e53e3e' 
          : 'var(--primaryButtonHover)'};
    transform: translateY(-2px);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  }
  
  &:active:not(:disabled) {
    transform: translateY(1px);
  }
  
  ${props => props.pulsing && `
    animation: ${pulse} 2s infinite;
  `}
`;

const ActiveExpeditionsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  color: var(--text);
  margin: 24px 0 12px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const HistoryList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
`;

const ResultList = styled.div`
  margin-top: 12px;
`;

const ResultItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 8px;
  font-size: 0.9rem;
  color: var(--text);
  border-bottom: 1px solid var(--border);
  
  &:last-child {
    border-bottom: none;
  }
`;

const ResultAmount = styled.div`
  font-weight: bold;
  color: ${props => props.positive ? 'var(--success)' : 'var(--danger)'};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: var(--textSecondary);
  background: var(--hoverBackground);
  border-radius: 8px;
  font-style: italic;
`;

// Mock data for expeditions
const expeditionData = [
  {
    id: 'mineral_survey',
    title: 'Mineral Survey',
    icon: <FaMountain />,
    iconColor: '#63b3ed',
    description: 'Survey nearby mountain ranges for mineral deposits.',
    location: 'Mountain Range',
    locationIcon: <FaMountain />,
    requirements: [
      { id: 'colonists', label: 'Colonists', amount: 2 },
      { id: 'energy', label: 'Energy', amount: 150 }
    ],
    rewards: [
      { type: 'resource', resource: 'minerals', minAmount: 200, maxAmount: 300 },
      { type: 'resource', resource: 'research', minAmount: 20, maxAmount: 50 }
    ],
    duration: 180, // seconds
    successRate: 0.9,
    unlocked: true
  },
  {
    id: 'water_expedition',
    title: 'Water Exploration',
    icon: <FaWater />,
    iconColor: '#4299e1',
    description: 'Search for underground water reservoirs.',
    location: 'Canyon Lands',
    locationIcon: <FaWater />,
    requirements: [
      { id: 'colonists', label: 'Colonists', amount: 3 },
      { id: 'energy', label: 'Energy', amount: 200 }
    ],
    rewards: [
      { type: 'resource', resource: 'water', minAmount: 300, maxAmount: 500 },
      { type: 'resource', resource: 'research', minAmount: 30, maxAmount: 70 }
    ],
    duration: 240, // seconds
    successRate: 0.85,
    unlocked: true
  },
  {
    id: 'botanical_survey',
    title: 'Botanical Survey',
    icon: <FaTree />,
    iconColor: '#68d391',
    description: 'Study local plant life for agricultural insights.',
    location: 'Fertile Valley',
    locationIcon: <FaTree />,
    requirements: [
      { id: 'colonists', label: 'Colonists', amount: 2 },
      { id: 'energy', label: 'Energy', amount: 100 },
      { id: 'water', label: 'Water', amount: 150 }
    ],
    rewards: [
      { type: 'resource', resource: 'food', minAmount: 250, maxAmount: 450 },
      { type: 'resource', resource: 'research', minAmount: 50, maxAmount: 100 }
    ],
    duration: 210, // seconds
    successRate: 0.95,
    unlocked: true
  },
  {
    id: 'deep_mining',
    title: 'Deep Mining Expedition',
    icon: <FaCubes />,
    iconColor: '#805ad5',
    description: 'Drill deep into the planet\'s crust to find rare minerals.',
    location: 'Magma Fields',
    locationIcon: <FaMountain />,
    requirements: [
      { id: 'colonists', label: 'Colonists', amount: 5 },
      { id: 'energy', label: 'Energy', amount: 400 },
      { id: 'components', label: 'Components', amount: 20 }
    ],
    rewards: [
      { type: 'resource', resource: 'minerals', minAmount: 500, maxAmount: 800 },
      { type: 'resource', resource: 'research', minAmount: 100, maxAmount: 200 }
    ],
    duration: 300, // seconds
    successRate: 0.7,
    unlocked: false,
    requiredTech: 'deepDrilling'
  },
  {
    id: 'orbital_scan',
    title: 'Orbital Scan',
    icon: <FaSatellite />,
    iconColor: '#f6ad55',
    description: 'Launch a satellite to scan the planet for resource deposits.',
    location: 'Orbital',
    locationIcon: <FaSatellite />,
    requirements: [
      { id: 'colonists', label: 'Colonists', amount: 3 },
      { id: 'energy', label: 'Energy', amount: 500 },
      { id: 'components', label: 'Components', amount: 30 }
    ],
    rewards: [
      { type: 'resource', resource: 'research', minAmount: 300, maxAmount: 500 },
      { type: 'special', label: 'Unlock new expedition', value: 'advanced_tech_salvage' }
    ],
    duration: 360, // seconds
    successRate: 0.8,
    unlocked: false,
    requiredTech: 'advancedEnergy'
  },
  {
    id: 'advanced_tech_salvage',
    title: 'Ancient Tech Salvage',
    icon: <FaFlask />,
    iconColor: '#9f7aea',
    description: 'Salvage ancient technology from a discovered crash site.',
    location: 'Crash Site',
    locationIcon: <FaSpaceShuttle />,
    requirements: [
      { id: 'colonists', label: 'Colonists', amount: 7 },
      { id: 'energy', label: 'Energy', amount: 700 },
      { id: 'components', label: 'Components', amount: 50 }
    ],
    rewards: [
      { type: 'resource', resource: 'research', minAmount: 500, maxAmount: 1000 },
      { type: 'resource', resource: 'components', minAmount: 100, maxAmount: 200 },
      { type: 'special', label: 'New Technology Insight', value: 'tech_boost' }
    ],
    duration: 450, // seconds
    successRate: 0.6,
    unlocked: false,
    requiredSpecialUnlock: 'orbital_scan'
  }
];

const ExpeditionSystem = () => {
  const dispatch = useDispatch();
  const resources = useSelector(state => state.game.resources);
  const tech = useSelector(state => state.game.tech);
  const [activeTab, setActiveTab] = useState('available');
  
  // Local state for tracking expeditions
  const [expeditions, setExpeditions] = useState(expeditionData);
  const [activeExpeditions, setActiveExpeditions] = useState([]);
  const [expeditionHistory, setExpeditionHistory] = useState([]);
  
  // Initialize expeditions on component mount
  useEffect(() => {
    // Check for tech unlocks
    const updatedExpeditions = expeditions.map(expedition => {
      let isUnlocked = expedition.unlocked;
      
      // Check if required tech is unlocked
      if (expedition.requiredTech && tech[expedition.requiredTech]?.unlocked) {
        isUnlocked = true;
      }
      
      // Check for special unlocks from previous expeditions
      if (expedition.requiredSpecialUnlock) {
        const unlockedBy = expeditionHistory.find(
          history => history.id === expedition.requiredSpecialUnlock && history.successful
        );
        if (unlockedBy) {
          isUnlocked = true;
        }
      }
      
      return {
        ...expedition,
        unlocked: isUnlocked
      };
    });
    
    setExpeditions(updatedExpeditions);
  }, [tech, expeditionHistory]);
  
  // Update active expeditions and check for completion
  useEffect(() => {
    if (activeExpeditions.length > 0) {
      const interval = setInterval(() => {
        const now = Date.now();
        
        // Check for completed expeditions
        const { completed, ongoing } = activeExpeditions.reduce(
          (result, expedition) => {
            if (now >= expedition.endTime) {
              result.completed.push(expedition);
            } else {
              result.ongoing.push(expedition);
            }
            return result;
          },
          { completed: [], ongoing: [] }
        );
        
        if (completed.length > 0) {
          // Process completed expeditions
          const newHistory = completed.map(expedition => {
            // Determine success based on success rate
            const success = Math.random() < expedition.successRate;
            
            // Generate rewards
            const rewards = success 
              ? expedition.rewards.map(reward => {
                  if (reward.type === 'resource') {
                    const amount = Math.floor(
                      reward.minAmount + Math.random() * (reward.maxAmount - reward.minAmount)
                    );
                    return { ...reward, amount };
                  }
                  return reward;
                })
              : [];
              
            // Return history entry
            return {
              ...expedition,
              completedAt: now,
              successful: success,
              rewards: rewards
            };
          });
          
          // Update history and active expeditions
          setExpeditionHistory(prev => [...newHistory, ...prev]);
          setActiveExpeditions(ongoing);
          
          // Award resources for successful expeditions
          newHistory.forEach(historyItem => {
            if (historyItem.successful) {
              historyItem.rewards.forEach(reward => {
                if (reward.type === 'resource') {
                  // Dispatch action to add resources
                  dispatch({
                    type: 'game/collectResource',
                    payload: { resource: reward.resource, amount: reward.amount }
                  });
                }
              });
            }
            
            // Return colonists regardless of success
            dispatch({
              type: 'game/collectResource',
              payload: { resource: 'population', amount: historyItem.requirements.find(r => r.id === 'colonists').amount }
            });
          });
        }
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [activeExpeditions, dispatch]);
  
  // Check if requirements are met for an expedition
  const checkRequirementsMet = (requirements) => {
    return requirements.every(req => {
      if (req.id === 'colonists') {
        return safeNumber(resources.population, 0) >= req.amount;
      }
      return safeNumber(resources[req.id], 0) >= req.amount;
    });
  };
  
  // Launch an expedition
  const launchExpedition = (expeditionId) => {
    const expedition = expeditions.find(exp => exp.id === expeditionId);
    if (!expedition) return;
    
    // Check if requirements are met
    if (!checkRequirementsMet(expedition.requirements)) return;
    
    // Consume resources
    expedition.requirements.forEach(req => {
      if (req.id === 'colonists') {
        dispatch({
          type: 'game/collectResource',
          payload: { resource: 'population', amount: -req.amount }
        });
      } else {
        dispatch({
          type: 'game/collectResource',
          payload: { resource: req.id, amount: -req.amount }
        });
      }
    });
    
    // Add to active expeditions
    const activeExpedition = {
      ...expedition,
      startTime: Date.now(),
      endTime: Date.now() + (expedition.duration * 1000),
      progress: 0
    };
    
    setActiveExpeditions(prev => [...prev, activeExpedition]);
  };
  
  // Calculate expedition progress
  const calculateProgress = (expedition) => {
    const now = Date.now();
    const totalDuration = expedition.endTime - expedition.startTime;
    const elapsed = now - expedition.startTime;
    
    return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
  };
  
  // Format time remaining
  const formatTimeRemaining = (expedition) => {
    const now = Date.now();
    const remainingMs = Math.max(0, expedition.endTime - now);
    const minutes = Math.floor(remainingMs / 60000);
    const seconds = Math.floor((remainingMs % 60000) / 1000);
    
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  return (
    <Panel>
      <PanelHeader>
        <Title>
          <FaMapMarkedAlt /> Expedition System
          <HelpIcon tooltip="Send colonists on expeditions to gather resources and discover new technologies." />
        </Title>
      </PanelHeader>
      
      <ExpeditionIntro>
        Launch expeditions to explore the surrounding areas and gather valuable resources. 
        Each expedition requires colonists and resources, and has a chance of success or failure. 
        Colonists will return regardless of the outcome, but resources used are consumed.
      </ExpeditionIntro>
      
      <TabsContainer>
        <Tab 
          active={activeTab === 'available'} 
          onClick={() => setActiveTab('available')}
        >
          Available Expeditions
        </Tab>
        <Tab 
          active={activeTab === 'active'} 
          onClick={() => setActiveTab('active')}
        >
          Active ({activeExpeditions.length})
        </Tab>
        <Tab 
          active={activeTab === 'history'} 
          onClick={() => setActiveTab('history')}
        >
          History
        </Tab>
      </TabsContainer>
      
      {activeTab === 'available' && (
        <>
          {activeExpeditions.length > 0 && (
            <>
              <SectionTitle>
                <FaHourglassHalf /> In Progress
              </SectionTitle>
              <ActiveExpeditionsList>
                {activeExpeditions.map(expedition => (
                  <ExpeditionCard key={expedition.id} active>
                    <CardHeader>
                      <ExpeditionTitle>
                        <ExpeditionIcon color={expedition.iconColor}>
                          {expedition.icon}
                        </ExpeditionIcon>
                        {expedition.title}
                      </ExpeditionTitle>
                      <StatusBadge status="active">In Progress</StatusBadge>
                    </CardHeader>
                    
                    <LocationInfo>
                      <ExpeditionIcon>{expedition.locationIcon}</ExpeditionIcon>
                      Location: {expedition.location}
                    </LocationInfo>
                    
                    <TimerText>
                      Time Remaining: {formatTimeRemaining(expedition)}
                    </TimerText>
                    
                    <DurationBar>
                      <ProgressFill 
                        status="active" 
                        percent={calculateProgress(expedition)}
                      />
                    </DurationBar>
                  </ExpeditionCard>
                ))}
              </ActiveExpeditionsList>
            </>
          )}
          
          <SectionTitle>
            <FaCrosshairs /> Available Expeditions
          </SectionTitle>
          <ExpeditionsList>
            {expeditions
              .filter(expedition => expedition.unlocked && !activeExpeditions.some(active => active.id === expedition.id))
              .map(expedition => {
                const requirementsMet = checkRequirementsMet(expedition.requirements);
                
                return (
                  <ExpeditionCard key={expedition.id}>
                    <CardHeader>
                      <ExpeditionTitle>
                        <ExpeditionIcon color={expedition.iconColor}>
                          {expedition.icon}
                        </ExpeditionIcon>
                        {expedition.title}
                      </ExpeditionTitle>
                      <StatusBadge status="available">Available</StatusBadge>
                    </CardHeader>
                    
                    <ExpeditionDescription>
                      {expedition.description}
                    </ExpeditionDescription>
                    
                    <LocationInfo>
                      <ExpeditionIcon>{expedition.locationIcon}</ExpeditionIcon>
                      Location: {expedition.location}
                    </LocationInfo>
                    
                    <RequirementsList>
                      {expedition.requirements.map(req => {
                        const available = req.id === 'colonists' 
                          ? safeNumber(resources.population, 0) 
                          : safeNumber(resources[req.id], 0);
                          
                        const met = available >= req.amount;
                        
                        return (
                          <RequirementItem key={req.id} met={met}>
                            <RequirementLabel>
                              {req.id === 'colonists' ? <FaUsers /> : null}
                              {req.label}
                            </RequirementLabel>
                            <RequirementValue>
                              {available}/{req.amount}
                            </RequirementValue>
                          </RequirementItem>
                        );
                      })}
                    </RequirementsList>
                    
                    <SectionTitle>
                      <FaPlusCircle /> Potential Rewards
                    </SectionTitle>
                    
                    {expedition.rewards.map((reward, index) => (
                      <RewardItem key={index}>
                        <span>
                          {reward.type === 'resource' 
                            ? `${reward.resource.charAt(0).toUpperCase() + reward.resource.slice(1)}` 
                            : reward.label}
                        </span>
                        <span>
                          {reward.type === 'resource' 
                            ? `${reward.minAmount} - ${reward.maxAmount}` 
                            : ''}
                        </span>
                      </RewardItem>
                    ))}
                    
                    <TimerText>
                      Duration: {Math.floor(expedition.duration / 60)}:{expedition.duration % 60 < 10 ? '0' : ''}{expedition.duration % 60}
                    </TimerText>
                    
                    <ExpeditionButton
                      onClick={() => launchExpedition(expedition.id)}
                      disabled={!requirementsMet}
                    >
                      <FaPlay /> Launch Expedition
                    </ExpeditionButton>
                  </ExpeditionCard>
                );
              })}
              
            {expeditions
              .filter(expedition => !expedition.unlocked)
              .map(expedition => (
                <ExpeditionCard key={expedition.id} locked>
                  <CardHeader>
                    <ExpeditionTitle>
                      <ExpeditionIcon color="var(--textSecondary)">
                        <FaLock />
                      </ExpeditionIcon>
                      {expedition.title}
                    </ExpeditionTitle>
                    <StatusBadge status="locked">Locked</StatusBadge>
                  </CardHeader>
                  
                  <ExpeditionDescription>
                    This expedition requires additional research or discoveries to unlock.
                  </ExpeditionDescription>
                  
                  {expedition.requiredTech && (
                    <RequirementItem met={false}>
                      <RequirementLabel>
                        <FaFlask /> Required Technology
                      </RequirementLabel>
                      <RequirementValue>
                        {tech[expedition.requiredTech]?.name || expedition.requiredTech}
                      </RequirementValue>
                    </RequirementItem>
                  )}
                  
                  {expedition.requiredSpecialUnlock && (
                    <RequirementItem met={false}>
                      <RequirementLabel>
                        <FaMapMarkedAlt /> Required Discovery
                      </RequirementLabel>
                      <RequirementValue>
                        Undiscovered Location
                      </RequirementValue>
                    </RequirementItem>
                  )}
                  
                  <ExpeditionButton disabled>
                    <FaLock /> Unavailable
                  </ExpeditionButton>
                </ExpeditionCard>
              ))}
          </ExpeditionsList>
        </>
      )}
      
      {activeTab === 'active' && (
        <>
          {activeExpeditions.length > 0 ? (
            <ExpeditionsList>
              {activeExpeditions.map(expedition => (
                <ExpeditionCard key={expedition.id} active>
                  <CardHeader>
                    <ExpeditionTitle>
                      <ExpeditionIcon color={expedition.iconColor}>
                        {expedition.icon}
                      </ExpeditionIcon>
                      {expedition.title}
                    </ExpeditionTitle>
                    <StatusBadge status="active">In Progress</StatusBadge>
                  </CardHeader>
                  
                  <ExpeditionDescription>
                    {expedition.description}
                  </ExpeditionDescription>
                  
                  <LocationInfo>
                    <ExpeditionIcon>{expedition.locationIcon}</ExpeditionIcon>
                    Location: {expedition.location}
                  </LocationInfo>
                  
                  <RequirementsList>
                    {expedition.requirements.map(req => (
                      <RequirementItem key={req.id} met={true}>
                        <RequirementLabel>
                          {req.id === 'colonists' ? <FaUsers /> : null}
                          {req.label}
                        </RequirementLabel>
                        <RequirementValue>
                          {req.amount}
                        </RequirementValue>
                      </RequirementItem>
                    ))}
                  </RequirementsList>
                  
                  <SectionTitle>
                    <FaHourglassHalf /> Status
                  </SectionTitle>
                  
                  <TimerText>
                    Time Remaining: {formatTimeRemaining(expedition)}
                  </TimerText>
                  
                  <DurationBar>
                    <ProgressFill 
                      status="active" 
                      percent={calculateProgress(expedition)}
                    />
                  </DurationBar>
                  
                  <ExpeditionButton disabled>
                    <FaHourglassHalf /> Expedition in Progress
                  </ExpeditionButton>
                </ExpeditionCard>
              ))}
            </ExpeditionsList>
          ) : (
            <EmptyState>
              No active expeditions. Launch an expedition from the Available tab.
            </EmptyState>
          )}
        </>
      )}
      
      {activeTab === 'history' && (
        <>
          {expeditionHistory.length > 0 ? (
            <HistoryList>
              {expeditionHistory.map((history, index) => (
                <ExpeditionCard 
                  key={`${history.id}-${index}`} 
                  completed={history.successful}
                >
                  <CardHeader>
                    <ExpeditionTitle>
                      <ExpeditionIcon color={history.iconColor}>
                        {history.icon}
                      </ExpeditionIcon>
                      {history.title}
                    </ExpeditionTitle>
                    <StatusBadge status={history.successful ? 'completed' : 'failed'}>
                      {history.successful ? 'Success' : 'Failed'}
                    </StatusBadge>
                  </CardHeader>
                  
                  <LocationInfo>
                    <ExpeditionIcon>{history.locationIcon}</ExpeditionIcon>
                    Location: {history.location}
                  </LocationInfo>
                  
                  <TimerText>
                    Completed: {new Date(history.completedAt).toLocaleTimeString()}
                  </TimerText>
                  
                  {history.successful && (
                    <>
                      <SectionTitle>
                        <FaCheckCircle /> Rewards Collected
                      </SectionTitle>
                      <ResultList>
                        {history.rewards.map((reward, idx) => (
                          <ResultItem key={idx}>
                            <span>
                              {reward.type === 'resource' 
                                ? `${reward.resource.charAt(0).toUpperCase() + reward.resource.slice(1)}` 
                                : reward.label}
                            </span>
                            <ResultAmount positive>
                              {reward.type === 'resource' ? `+${reward.amount}` : ''}
                            </ResultAmount>
                          </ResultItem>
                        ))}
                      </ResultList>
                    </>
                  )}
                  
                  {!history.successful && (
                    <ExpeditionDescription>
                      The expedition failed to achieve its objectives. Your colonists returned safely, but no resources were collected.
                    </ExpeditionDescription>
                  )}
                  
                  <DurationBar>
                    <ProgressFill 
                      status={history.successful ? 'completed' : 'failed'} 
                      percent={100}
                    />
                  </DurationBar>
                  
                  <ExpeditionButton
                    success={history.successful}
                    danger={!history.successful}
                  >
                    {history.successful 
                      ? <><FaCheckCircle /> Expedition Successful</> 
                      : <><FaTimesCircle /> Expedition Failed</>}
                  </ExpeditionButton>
                </ExpeditionCard>
              ))}
            </HistoryList>
          ) : (
            <EmptyState>
              No expedition history yet. Complete expeditions to see results here.
            </EmptyState>
          )}
        </>
      )}
    </Panel>
  );
};

export default ExpeditionSystem;