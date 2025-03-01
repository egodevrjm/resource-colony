// src/components/StatsPanel.js
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { FaHistory, FaBuilding, FaArrowUp, FaFlask, FaBolt, FaRedo } from 'react-icons/fa';
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

const StatsList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  
  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

const StatItem = styled.div`
  background: white;
  padding: 12px;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
`;

const StatIcon = styled.div`
  width: 36px;
  height: 36px;
  background: ${props => props.color || '#4299e1'};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  color: white;
`;

const StatInfo = styled.div`
  flex-grow: 1;
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: #718096;
  margin-bottom: 4px;
`;

const StatValue = styled.div`
  font-weight: bold;
  font-size: 1.1rem;
  color: #2d3748;
`;

const formatTime = (seconds) => {
  if (isNaN(seconds)) return '0h 0m';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
};

const StatsPanel = () => {
  const stats = useSelector(state => state.game.stats);
  const currentTime = Date.now();
  
  // Current play time calculation
  const totalPlayTimeSeconds = safeNumber(stats.colonyAge + (currentTime - stats.lastUpdate) / 1000);
  
  const statsConfig = [
    {
      label: 'Colony Age',
      value: formatTime(totalPlayTimeSeconds),
      icon: <FaHistory />,
      color: '#4299e1'
    },
    {
      label: 'Total Clicks',
      value: safeNumber(stats.totalClicks),
      icon: <FaHistory />,
      color: '#f6ad55'
    },
    {
      label: 'Buildings Built',
      value: safeNumber(stats.buildingsConstructed),
      icon: <FaBuilding />,
      color: '#48bb78'
    },
    {
      label: 'Upgrades Purchased',
      value: safeNumber(stats.upgradesPurchased),
      icon: <FaArrowUp />,
      color: '#9f7aea'
    },
    {
      label: 'Technologies Researched',
      value: safeNumber(stats.techResearched),
      icon: <FaFlask />,
      color: '#ed8936'
    },
    {
      label: 'Events Survived',
      value: safeNumber(stats.eventsSurvived),
      icon: <FaBolt />,
      color: '#e53e3e'
    },
    {
      label: 'Prestige Count',
      value: safeNumber(stats.prestigeCount),
      icon: <FaRedo />,
      color: '#805ad5'
    }
  ];
  
  return (
    <Panel>
      <PanelTitle>Colony Statistics</PanelTitle>
      <StatsList>
        {statsConfig.map((stat, index) => (
          <StatItem key={index}>
            <StatIcon color={stat.color}>
              {stat.icon}
            </StatIcon>
            <StatInfo>
              <StatLabel>{stat.label}</StatLabel>
              <StatValue>{stat.value}</StatValue>
            </StatInfo>
          </StatItem>
        ))}
      </StatsList>
    </Panel>
  );
};

export default StatsPanel;