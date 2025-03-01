// src/components/GameHeader.js
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { resetGame, resetTutorial, setSetting } from '../redux/gameSlice';
import { FaCog, FaQuestionCircle, FaInfoCircle, FaSave } from 'react-icons/fa';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';

const Header = styled.header`
  text-align: center;
  margin-bottom: 20px;
  position: relative;
  color: var(--text);
`;

const Title = styled.h1`
  color: var(--primaryButton);
  margin: 0;
`;

const Subtitle = styled.p`
  color: var(--textSecondary);
  margin: 5px 0 0;
`;

const ButtonBar = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  gap: 10px;
  z-index: 10;
`;

const IconButton = styled.button`
  background: ${props => props.primary ? 'var(--primary)' : 'transparent'};
  border: none;
  color: ${props => props.primary ? 'white' : 'var(--primaryButton)'};
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.primary ? 'var(--primaryButtonHover)' : 'var(--menuBackground)'};
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(1px);
  }
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
  background: var(--cardBackground);
  color: var(--text);
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
  border-bottom: 1px solid var(--border);
`;

const ModalFooter = styled.div`
  margin-top: 20px;
  padding-top: 10px;
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const Button = styled(({ danger, primary, ...rest }) => {
  const buttonProps = { ...rest };
  // Set data attributes instead of passing boolean props to DOM
  if (danger !== undefined) buttonProps['data-danger'] = danger ? 'true' : 'false';
  if (primary !== undefined) buttonProps['data-primary'] = primary ? 'true' : 'false';
  return <button {...buttonProps} />;
})`
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  
  background-color: ${props => 
    props['data-danger'] === 'true' ? 'var(--error)' : 
    props['data-primary'] === 'true' ? 'var(--primaryButton)' : 
    'var(--menuBackground)'};
    
  color: ${props => 
    (props['data-danger'] === 'true' || props['data-primary'] === 'true') ? 'white' : 'var(--text)'};
  
  &:hover {
    background-color: ${props => 
      props['data-danger'] === 'true' ? '#e53e3e' : 
      props['data-primary'] === 'true' ? 'var(--primaryButtonHover)' : 
      'var(--menuItemHover)'};
  }
`;

const SettingRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const SettingLabel = styled.div`
  font-weight: bold;
`;

const SettingControl = styled.div`
  display: flex;
  align-items: center;
`;

const RangeInput = styled.input`
  width: 100%;
  margin-top: 5px;
`;

const RangeValue = styled.span`
  margin-left: 10px;
  min-width: 30px;
  text-align: right;
`;

const Toggle = styled.div`
  position: relative;
  width: 50px;
  height: 24px;
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  
  &:checked + span {
    background-color: var(--primaryButton);
  }
  
  &:checked + span:before {
    transform: translateX(26px);
  }
`;

const ToggleSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--disabledButton);
  transition: 0.4s;
  border-radius: 34px;
  
  &:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
  }
`;

const GameHeader = ({ addNotification }) => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const settings = useSelector(state => state.game.settings);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  
  const gameState = useSelector(state => state.game);

  const handleManualSave = () => {
    // Call the save function defined in App.js
    if (typeof window.saveGame === 'function') {
      window.saveGame();
    } else {
      // Fallback if the window.saveGame function is not available
      localStorage.setItem('resourceColonySave', JSON.stringify(gameState));
      addNotification('Game Saved', 'Your game has been saved manually.', 'success');
    }
  };
  
  const handleResetGame = () => {
    // Clear local storage first to ensure a completely fresh start
    localStorage.removeItem('resourceColonySave');
    dispatch(resetGame());
    dispatch(resetTutorial());
    addNotification('Game Reset', 'Your game has been reset to the beginning state.', 'warning');
    setConfirmResetOpen(false);
    setSettingsModalOpen(false);
  };
  
  const handleSpeedChange = (e) => {
    const value = parseFloat(e.target.value);
    dispatch(setSetting({ setting: 'gameSpeed', value }));
  };
  
  const handleToggleNotifications = () => {
    dispatch(setSetting({ 
      setting: 'notifications', 
      value: !settings.notifications 
    }));
  };
  
  const handleAutoSaveIntervalChange = (e) => {
    const value = parseInt(e.target.value, 10);
    dispatch(setSetting({ setting: 'autoSaveInterval', value }));
  };
  
  return (
    <Header>
      <Title>Resource Colony: Space Frontier</Title>
      <Subtitle>Build and manage your interplanetary colony</Subtitle>
      
      <ButtonBar>
        <IconButton onClick={handleManualSave} title="Save Game" primary>
          <FaSave />
        </IconButton>
        <ThemeToggle showLabel={false} />
        <IconButton onClick={() => setHelpModalOpen(true)} title="Help">
          <FaQuestionCircle />
        </IconButton>
        <IconButton onClick={() => setSettingsModalOpen(true)} title="Settings">
          <FaCog />
        </IconButton>
        <IconButton onClick={() => setAboutModalOpen(true)} title="About">
          <FaInfoCircle />
        </IconButton>
      </ButtonBar>
      
      {/* Settings Modal */}
      {settingsModalOpen && (
        <ModalOverlay onClick={() => setSettingsModalOpen(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalTitle>Game Settings</ModalTitle>
            
            <SettingRow>
              <SettingLabel>Manual Save</SettingLabel>
              <SettingControl>
                <Button primary onClick={handleManualSave}>Save Game</Button>
              </SettingControl>
            </SettingRow>
            
            <SettingRow>
              <SettingLabel>Game Speed</SettingLabel>
              <SettingControl>
                <div>
                  <RangeInput 
                    type="range" 
                    min="0.5" 
                    max="5" 
                    step="0.5" 
                    value={settings.gameSpeed} 
                    onChange={handleSpeedChange} 
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>0.5x</span>
                    <span>5x</span>
                  </div>
                </div>
                <RangeValue>{settings.gameSpeed}x</RangeValue>
              </SettingControl>
            </SettingRow>
            
            <SettingRow>
              <SettingLabel>Notifications</SettingLabel>
              <SettingControl>
                <Toggle>
                  <ToggleInput 
                    type="checkbox" 
                    checked={settings.notifications} 
                    onChange={handleToggleNotifications} 
                  />
                  <ToggleSlider />
                </Toggle>
              </SettingControl>
            </SettingRow>
            
            <SettingRow>
              <SettingLabel>Auto-Save Interval (seconds)</SettingLabel>
              <SettingControl>
                <div>
                  <RangeInput 
                    type="range" 
                    min="10" 
                    max="120" 
                    step="10" 
                    value={settings.autoSaveInterval} 
                    onChange={handleAutoSaveIntervalChange} 
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>10s</span>
                    <span>120s</span>
                  </div>
                </div>
                <RangeValue>{settings.autoSaveInterval}s</RangeValue>
              </SettingControl>
            </SettingRow>
            
            <SettingRow>
              <SettingLabel>Theme Mode</SettingLabel>
              <SettingControl>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span>{theme.name === 'light' ? 'Light' : 'Dark'} Mode</span>
                  <ThemeToggle />
                </div>
              </SettingControl>
            </SettingRow>
            
            <Button danger onClick={() => setConfirmResetOpen(true)}>Reset Game</Button>
            
            <ModalFooter>
              <Button onClick={() => setSettingsModalOpen(false)}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}
      
      {/* Help Modal */}
      {helpModalOpen && (
        <ModalOverlay onClick={() => setHelpModalOpen(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalTitle>How to Play</ModalTitle>
            
            <h3>Getting Started</h3>
            <p>Click on resources to collect them manually. Use these resources to build structures that will automatically generate resources for you.</p>
            
            <h3>Buildings</h3>
            <p>Buildings produce resources automatically over time. The more buildings you have, the more resources you'll generate.</p>
            
            <h3>Upgrades</h3>
            <p>Upgrades improve the efficiency of your buildings, allowing them to produce more resources.</p>
            
            <h3>Research</h3>
            <p>Research new technologies to unlock advanced buildings and upgrades. Some technologies require other technologies to be researched first.</p>
            
            <h3>Colonist Roles</h3>
            <p>Assign roles to your colonists to maximize production efficiency. Different roles provide different bonuses to your colony.</p>
            
            <h3>Missions</h3>
            <p>Complete missions to earn rewards and progress through the game. Each mission has specific requirements to fulfil.</p>
            
            <h3>Events</h3>
            <p>Random events will occur during gameplay. These can have positive or negative effects on your production.</p>
            
            <h3>Prestige</h3>
            <p>Once you've built up your colony, you can prestige to start over with powerful bonuses.</p>
            
            <h3>Starting Over</h3>
            <p>If you encounter any issues or want a fresh start, you can reset the game from the Settings menu (cogwheel icon). This will clear your save data and start with a new colony.</p>
            
            <ModalFooter>
              <Button primary onClick={() => dispatch(resetTutorial())}>Restart Tutorial</Button>
              <Button onClick={() => setHelpModalOpen(false)}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}
      
      {/* About Modal */}
      {aboutModalOpen && (
        <ModalOverlay onClick={() => setAboutModalOpen(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalTitle>About Resource Colony</ModalTitle>
            
            <p>Resource Colony: Space Frontier is an idle clicker game where you build and manage a colony on a distant planet.</p>
            
            <p>This game is a demonstration of what can be built with React and Redux.</p>
            
            <ModalFooter>
              <Button onClick={() => setAboutModalOpen(false)}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}
      
      {/* Confirm Reset Modal */}
      {confirmResetOpen && (
        <ModalOverlay onClick={() => setConfirmResetOpen(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalTitle>Reset Game?</ModalTitle>
            
            <p>Are you sure you want to reset your game? This will erase all progress and start you over with fresh resources. This action cannot be undone.</p>
            <p><strong>Note:</strong> If you're experiencing issues with the game, resetting can often fix them.</p>
            
            <ModalFooter>
              <Button danger onClick={handleResetGame}>Reset Game</Button>
              <Button onClick={() => setConfirmResetOpen(false)}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}
    </Header>
  );
};

export default GameHeader;