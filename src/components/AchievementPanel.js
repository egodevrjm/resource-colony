// src/components/AchievementPanel.js
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { FaTrophy, FaLock, FaUnlock } from 'react-icons/fa';
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
  display: flex;
  align-items: center;
`;

const TrophyIcon = styled.span`
  color: #f6ad55;
  margin-right: 8px;
`;

const StatsContainer = styled.div`
  background: white;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 16px;
  display: flex;
  justify-content: space-around;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #2d3748;
  white-space: nowrap;
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: #718096;
`;

const AchievementGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  max-height: 500px;
  overflow-y: auto;
`;

const AchievementItem = styled(({ unlocked, ...rest }) => {
  // Create a data attribute for unlocked state instead of passing directly to DOM
  const safeProps = { ...rest };
  if (unlocked !== undefined) {
    safeProps['data-unlocked'] = unlocked === true ? 'true' : 'false';
  }
  return <div {...safeProps} />;
})`
  background: white;
  border-radius: 6px;
  padding: 12px;
  display: flex;
  align-items: center;
  border-left: 4px solid ${props => props['data-unlocked'] === 'true' ? '#48bb78' : '#cbd5e0'};
  opacity: ${props => props['data-unlocked'] === 'true' ? 1 : 0.7};
`;

const AchievementIcon = styled(({ unlocked, ...rest }) => {
  // Create a data attribute for unlocked state
  const safeProps = { ...rest };
  if (unlocked !== undefined) {
    safeProps['data-unlocked'] = unlocked === true ? 'true' : 'false';
  }
  return <div {...safeProps} />;
})`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${props => props['data-unlocked'] === 'true' ? '#48bb78' : '#e2e8f0'};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  font-size: 1.2rem;
`;

const AchievementInfo = styled.div`
  flex-grow: 1;
`;

const AchievementName = styled.div`
  font-weight: bold;
  color: #2d3748;
`;

const AchievementDescription = styled.div`
  font-size: 0.8rem;
  color: #718096;
  margin-top: 4px;
`;

const NoAchievementsMessage = styled.div`
  text-align: center;
  padding: 20px;
  color: #718096;
  background: white;
  border-radius: 6px;
`;

const AchievementPanel = () => {
  const achievements = useSelector(state => state.game.achievements);
  
  // Count unlocked achievements
  const unlockedCount = Object.values(achievements).filter(a => a && a.unlocked === true).length;
  const totalCount = Object.values(achievements).length;
  const percentComplete = Math.round(safeNumber((unlockedCount / totalCount) * 100)) || 0;
  
  return (
    <Panel>
      <PanelTitle>
        <TrophyIcon><FaTrophy /></TrophyIcon>
        Achievements
      </PanelTitle>
      
      <StatsContainer>
        <StatItem>
        <StatValue>{String(isNaN(unlockedCount) ? 0 : unlockedCount)}</StatValue>
        <StatLabel>Unlocked</StatLabel>
        </StatItem>
        <StatItem>
        <StatValue>{String(isNaN(totalCount) ? 0 : totalCount)}</StatValue>
        <StatLabel>Total</StatLabel>
        </StatItem>
        <StatItem>
        <StatValue>{String(isNaN(percentComplete) ? 0 : percentComplete)}%</StatValue>
        <StatLabel>Complete</StatLabel>
        </StatItem>
      </StatsContainer>
      
      <AchievementGrid>
        {Object.entries(achievements).length === 0 ? (
          <NoAchievementsMessage>
            No achievements available yet
          </NoAchievementsMessage>
        ) : (
          Object.entries(achievements)
            .sort(([, a], [, b]) => {
              // Sort by unlocked first, then by name
              if (a && b) {
                if (a.unlocked === true && b.unlocked !== true) return -1;
                if (a.unlocked !== true && b.unlocked === true) return 1;
                return (a.name || '').localeCompare(b.name || '');
              }
              return 0;
            })
            .map(([id, achievement]) => (
              <AchievementItem key={id} unlocked={achievement && achievement.unlocked === true}>
                <AchievementIcon unlocked={achievement && achievement.unlocked === true}>
                  {achievement && achievement.unlocked === true ? <FaUnlock /> : <FaLock />}
                </AchievementIcon>
                <AchievementInfo>
                  <AchievementName>{achievement && achievement.name || ''}</AchievementName>
                  <AchievementDescription>{achievement && achievement.description || ''}</AchievementDescription>
                </AchievementInfo>
              </AchievementItem>
            ))
        )}
      </AchievementGrid>
    </Panel>
  );
};

export default AchievementPanel;