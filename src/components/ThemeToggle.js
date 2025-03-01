// src/components/ThemeToggle.js
import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaSun, FaMoon, FaRocket, FaChevronDown } from 'react-icons/fa';
import { useTheme } from '../contexts/ThemeContext';
import Tooltip from './Tooltip';

const ToggleContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-left: 8px;
  z-index: 10;
`;

const ToggleButton = styled.button`
  background: var(--cardBackground);
  color: var(--text);
  border: 2px solid var(--primary);
  border-radius: 30px;
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  font-size: 1.2rem;
  
  &:hover {
    box-shadow: 0 0 8px var(--primary);
    transform: translateY(-2px);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(66, 153, 225, 0.7); }
  70% { box-shadow: 0 0 0 8px rgba(66, 153, 225, 0); }
  100% { box-shadow: 0 0 0 0 rgba(66, 153, 225, 0); }
`;

const ThemeIconContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => {
    switch (props.themeName) {
      case 'light': return '#f6ad55';
      case 'dark': return '#3b82f6';
      case 'space': return '#6366f1';
      default: return 'var(--primary)';
    }
  }};
  animation: ${props => props.animate ? pulse : 'none'} 2s infinite;
`;

const ThemeSelector = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  width: 120px;
  padding: 8px;
  background: var(--cardBackground);
  border-radius: 8px;
  box-shadow: var(--elevatedShadow);
  margin-top: 5px;
  z-index: 100;
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transform: translateY(${props => props.isOpen ? '0' : '-10px'});
  transition: opacity 0.2s, visibility 0.2s, transform 0.2s;
`;

const ThemeOption = styled.div`
  display: flex;
  align-items: center;
  padding: 8px;
  cursor: pointer;
  color: var(--text);
  border-radius: 4px;
  transition: background-color 0.2s;
  
  &:hover {
    background: var(--hoverBackground);
  }
  
  &.active {
    background: var(--primary);
    color: white;
  }
`;

const OptionIcon = styled.div`
  margin-right: 8px;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  
  color: ${props => {
    switch (props.themeName) {
      case 'light': return '#f6ad55';
      case 'dark': return '#3b82f6';
      case 'space': return '#6366f1';
      default: return 'currentColor';
    }
  }};
  
  .active & {
    color: white;
  }
`;

const OptionLabel = styled.div`
  font-size: 0.9rem;
  font-weight: 500;
`;

const Dropdown = styled.div`
  position: relative;
  display: inline-block;
`;

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 50;
  display: ${props => props.isOpen ? 'block' : 'none'};
`;

const ThemeLabel = styled.span`
  font-size: 0.9rem;
  margin-right: 10px;
  color: var(--text);
  font-weight: 500;
`;

const ThemeToggle = ({ showLabel = true }) => {
  const { theme, toggleTheme, setThemeByName } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const getThemeIcon = () => {
    switch (theme.name) {
      case 'light': return <FaSun />;
      case 'dark': return <FaMoon />;
      case 'space': return <FaRocket />;
      default: return <FaSun />;
    }
  };
  
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  
  const closeDropdown = () => {
    setDropdownOpen(false);
  };
  
  const handleThemeSelect = (themeName) => {
    setThemeByName(themeName);
    closeDropdown();
  };
  
  return (
    <ToggleContainer>
      {showLabel && <ThemeLabel>Theme</ThemeLabel>}
      <Dropdown>
        <Tooltip content="Change theme">
          <ToggleButton 
            onClick={toggleDropdown}
            aria-label="Toggle theme selector"
          >
            <ThemeIconContainer themeName={theme.name} animate={dropdownOpen}>
              {getThemeIcon()}
            </ThemeIconContainer>
          </ToggleButton>
        </Tooltip>
        
        <Backdrop isOpen={dropdownOpen} onClick={closeDropdown} />
        
        <ThemeSelector isOpen={dropdownOpen}>
          <ThemeOption 
            className={theme.name === 'light' ? 'active' : ''}
            onClick={() => handleThemeSelect('light')}
          >
            <OptionIcon themeName="light"><FaSun /></OptionIcon>
            <OptionLabel>Light</OptionLabel>
          </ThemeOption>
          
          <ThemeOption 
            className={theme.name === 'dark' ? 'active' : ''}
            onClick={() => handleThemeSelect('dark')}
          >
            <OptionIcon themeName="dark"><FaMoon /></OptionIcon>
            <OptionLabel>Dark</OptionLabel>
          </ThemeOption>
          
          <ThemeOption 
            className={theme.name === 'space' ? 'active' : ''}
            onClick={() => handleThemeSelect('space')}
          >
            <OptionIcon themeName="space"><FaRocket /></OptionIcon>
            <OptionLabel>Space</OptionLabel>
          </ThemeOption>
        </ThemeSelector>
      </Dropdown>
    </ToggleContainer>
  );
};

export default ThemeToggle;