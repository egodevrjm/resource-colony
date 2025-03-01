// src/App.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { updateGameState, loadGame } from './redux/gameSlice';
import ResourcePanel from './components/ResourcePanel';
import BuildingPanel from './components/BuildingPanel';
import UpgradePanel from './components/UpgradePanel';
import StatsPanel from './components/StatsPanel';
import TechPanel from './components/TechPanel';
import EventPanel from './components/EventPanel';
import AchievementPanel from './components/AchievementPanel';
import PrestigePanel from './components/PrestigePanel';
import TutorialOverlay from './components/TutorialOverlay';
import GameHeader from './components/GameHeader';
import DebugMonitor from './components/DebugMonitor';
import VisualEffects from './components/VisualEffects';
import ResourceAnimation from './components/ResourceAnimation';
import ColonyVisualizer from './components/ColonyVisualizer';
import ColonistPanel from './components/ColonistPanel';
import CustomizableLayout from './components/CustomizableLayout';
import TabPanel from './components/TabPanel';
import ThemeToggle from './components/ThemeToggle';
import MainColonyView from './components/MainColonyView';
import ResourceTrading from './components/ResourceTrading';
import { NotificationProvider, useNotifications } from './contexts/NotificationContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Import new components
import StatsDashboard from './components/StatsDashboard';
import ColonistManagement from './components/ColonistManagement';
import MissionPanel from './components/MissionPanel';
import EnhancedTrading from './components/EnhancedTrading';
import ExpeditionSystem from './components/ExpeditionSystem';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
  background-color: var(--background);
  color: var(--text);
  min-height: 100vh;
  transition: background-color 0.3s, color 0.3s;
`;

const MainContent = styled.main`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const LeftPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const RightPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const AppContent = () => {
  const dispatch = useDispatch();
  const gameState = useSelector(state => state.game);
  const tutorial = useSelector(state => state.game.tutorial);
  const settings = useSelector(state => state.game.settings);
  const { addNotification } = useNotifications();
  
  // Define tabs for right panel
  const rightPanelTabs = [
    {
      id: 'buildings',
      label: 'Buildings',
      content: <BuildingPanel />
    },
    {
      id: 'upgrades',
      label: 'Upgrades',
      content: <UpgradePanel />
    },
    {
      id: 'research',
      label: 'Research',
      content: <TechPanel />
    },
    {
      id: 'market',
      label: 'Trading',
      content: <EnhancedTrading />
    },
    {
      id: 'expeditions',
      label: 'Expeditions',
      content: <ExpeditionSystem />
    },
    {
      id: 'missions',
      label: 'Missions',
      content: <MissionPanel />
    },
    {
      id: 'achievements',
      label: 'Achievements',
      content: <AchievementPanel />
    },
    {
      id: 'prestige',
      label: 'Prestige',
      content: <PrestigePanel addNotification={addNotification} />
    }
  ];
  
  // Define panels for left column (customizable)
  const leftPanels = [
    {
      id: 'resources',
      title: 'Resources',
      component: <ResourcePanel />,
      defaultVisible: true
    },
    {
      id: 'statistics',
      title: 'Colony Dashboard',
      component: <StatsDashboard />,
      defaultVisible: true
    }
  ];
  
  // Add event panel conditionally
  if (gameState?.events?.active) {
    leftPanels.push({
      id: 'event',
      title: 'Active Event',
      component: <EventPanel />,
      defaultVisible: true
    });
  }
  
  // Game loop - update resources based on production every 100ms
  useEffect(() => {
    const gameLoop = setInterval(() => {
      try {
        dispatch(updateGameState());
      } catch (error) {
        console.error('Error in game loop:', error);
      }
    }, 100);
    
    return () => clearInterval(gameLoop);
  }, [dispatch]);
  
  // Load saved game on initial render or start a new game
  useEffect(() => {
    try {
      const savedGame = localStorage.getItem('resourceColonySave');
      if (savedGame) {
        const parsedSave = JSON.parse(savedGame);
        // Check if saved game has basic resources - if not, start fresh
        if (!parsedSave.resources || 
            (parsedSave.resources.energy === 0 && 
             parsedSave.resources.minerals === 0 && 
             parsedSave.resources.food === 0)) {
          console.log('Starting new game - saved game had no resources');
          localStorage.removeItem('resourceColonySave'); // Clear corrupted save
          return; // Let the game start fresh
        }
        dispatch(loadGame(parsedSave));
      }
    } catch (e) {
      console.error('Failed to load saved game:', e);
      localStorage.removeItem('resourceColonySave'); // Clear corrupted save
    }
  }, [dispatch]);
  
  // Auto-save game every 30 seconds
  useEffect(() => {
    if (!settings?.autoSaveInterval) return;
    
    const autoSave = setInterval(() => {
      localStorage.setItem('resourceColonySave', JSON.stringify(gameState));
      if (settings?.notifications) {
        addNotification('Auto-Save', 'Game progress has been saved.', 'info');
      }
    }, settings.autoSaveInterval * 1000);
    
    return () => clearInterval(autoSave);
  }, [gameState, settings, addNotification]);
  
  // Add a manual save function
  const handleManualSave = () => {
    localStorage.setItem('resourceColonySave', JSON.stringify(gameState));
    addNotification('Manual Save', 'Game progress has been saved successfully!', 'success');
  };
  
  // Export save function for GameHeader
  useEffect(() => {
    window.saveGame = handleManualSave;
    return () => {
      delete window.saveGame;
    };
  }, [gameState]);
  
  // Monitor for achievement unlocks - without directly modifying state
  useEffect(() => {
    if (!gameState?.achievements) return;
    
    const achievements = gameState.achievements;
    Object.entries(achievements).forEach(([id, achievement]) => {
      if (achievement && achievement.unlocked === true && achievement.notified !== true) {
        addNotification(
          'Achievement Unlocked!', 
          (achievement.name || '') + ': ' + (achievement.description || ''), 
          'success'
        );
        
        // Don't modify Redux state directly, it's immutable
        // Let the gameState update itself in its own way
      }
    });
  }, [gameState?.achievements, addNotification]);
  
  // Monitor for tech unlocks - without directly modifying state
  useEffect(() => {
    if (!gameState?.tech) return;
    
    const techs = gameState.tech;
    Object.entries(techs).forEach(([id, tech]) => {
      if (tech && tech.unlocked === true && tech.notified !== true) {
        addNotification(
          'Technology Researched!', 
          (tech.name || '') + ': ' + (tech.description || ''), 
          'success'
        );
        
        // Don't modify Redux state directly, it's immutable
      }
    });
  }, [gameState?.tech, addNotification]);
  
  // Monitor for events - without directly modifying state
  useEffect(() => {
    if (!gameState?.events?.active) return;
    
    const event = gameState.events.active;
    if (event.notified === true) return;
    
    const hasNegativeEffect = event.effects && 
                            event.effects.productionMultipliers && 
                            Object.values(event.effects.productionMultipliers).some(val => val < 1);
    
    addNotification(
      'Event Started!', 
      (event.name || '') + ': ' + (event.description || ''), 
      hasNegativeEffect ? 'warning' : 'info'
    );
    
    // Don't modify Redux state directly, it's immutable
  }, [gameState?.events?.active, addNotification]);
  
  return (
    <AppContainer>
      <DebugMonitor />
      <GameHeader addNotification={addNotification} />
      
      <MainContent>
        <LeftPanel>
          {/* Replace the hardcoded panels with CustomizableLayout */}
          <CustomizableLayout panels={leftPanels} />
        </LeftPanel>
        
        <RightPanel>
          {/* Use the new MainColonyView component */}
          <MainColonyView tabs={rightPanelTabs} />
        </RightPanel>
      </MainContent>
      
      {/* Visual effects layers - always visible */}
      <VisualEffects />
      <ResourceAnimation />
      
      {/* Theme toggle is now handled in the GameHeader component */}
      
      {tutorial && !tutorial.completed && <TutorialOverlay />}
      {tutorial && !tutorial.completed && tutorial.steps && tutorial.step !== undefined && <TutorialOverlay />}
    </AppContainer>
  );
};

// Main App component that provides the notification context and theme context
function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;