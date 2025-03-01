// src/components/ThemeCustomizer.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaPalette, FaSave, FaUndo } from 'react-icons/fa';

const ThemeButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #4a6fa5;
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  
  &:hover {
    background: #3a5a8a;
  }
`;

const ThemePanel = styled.div`
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: 300px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  padding: 16px;
  transform-origin: bottom right;
  transition: transform 0.3s ease, opacity 0.3s ease;
  transform: ${props => props.isOpen ? 'scale(1)' : 'scale(0.9)'};
  opacity: ${props => props.isOpen ? '1' : '0'};
  pointer-events: ${props => props.isOpen ? 'all' : 'none'};
`;

const ThemeHeader = styled.h3`
  margin-top: 0;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e2e8f0;
  font-size: 1rem;
`;

const ThemeOption = styled.div`
  margin-bottom: 16px;
`;

const OptionLabel = styled.div`
  font-weight: bold;
  margin-bottom: 8px;
  font-size: 0.9rem;
  color: #4a5568;
`;

const ColorPickerRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
`;

const ColorSwatch = styled.button`
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: 2px solid ${props => props.selected ? '#4a6fa5' : 'transparent'};
  background-color: ${props => props.color};
  cursor: pointer;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const FontSelect = styled.select`
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #e2e8f0;
  background: white;
  font-size: 0.9rem;
`;

const SizeSelector = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SizeLabel = styled.div`
  font-size: 0.8rem;
  color: #718096;
  width: 80px;
`;

const SizeSlider = styled.input`
  flex-grow: 1;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
`;

const ThemeButton2 = styled.button`
  padding: 8px 12px;
  border-radius: 4px;
  border: none;
  background: ${props => props.primary ? '#4a6fa5' : '#e2e8f0'};
  color: ${props => props.primary ? 'white' : '#4a5568'};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  
  &:hover {
    background: ${props => props.primary ? '#3a5a8a' : '#cbd5e0'};
  }
`;

// Default theme options
const defaultTheme = {
  primaryColor: '#4a6fa5',
  secondaryColor: '#48bb78',
  backgroundColor: '#f0f4f8',
  textColor: '#2d3748',
  fontFamily: 'Arial, sans-serif',
  fontSize: 16,
  borderRadius: 8
};

// Color palettes
const colorPalettes = [
  { primary: '#4a6fa5', secondary: '#48bb78', name: 'Blue & Green (Default)' },
  { primary: '#805ad5', secondary: '#f6ad55', name: 'Purple & Orange' },
  { primary: '#e53e3e', secondary: '#38b2ac', name: 'Red & Teal' },
  { primary: '#2b6cb0', secondary: '#ed8936', name: 'Royal Blue & Orange' },
  { primary: '#3c366b', secondary: '#f56565', name: 'Indigo & Red' },
  { primary: '#2c7a7b', secondary: '#d69e2e', name: 'Teal & Yellow' },
  { primary: '#1a365d', secondary: '#c05621', name: 'Navy & Burnt Orange' },
  { primary: '#2d3748', secondary: '#4a5568', name: 'Dark Mode' }
];

// Font options
const fontOptions = [
  'Arial, sans-serif',
  'Verdana, sans-serif',
  'Helvetica, sans-serif',
  'Tahoma, sans-serif',
  'Trebuchet MS, sans-serif',
  'Times New Roman, serif',
  'Georgia, serif',
  'Courier New, monospace'
];

const ThemeCustomizer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState(defaultTheme);
  const [selectedPalette, setSelectedPalette] = useState(0);
  
  // Load saved theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('resourceColonyTheme');
    if (savedTheme) {
      try {
        const parsedTheme = JSON.parse(savedTheme);
        setTheme(parsedTheme);
        
        // Find matching palette
        const paletteIndex = colorPalettes.findIndex(
          palette => palette.primary === parsedTheme.primaryColor && 
                    palette.secondary === parsedTheme.secondaryColor
        );
        
        if (paletteIndex !== -1) {
          setSelectedPalette(paletteIndex);
        }
      } catch (e) {
        console.error('Error loading saved theme:', e);
      }
    }
    
    // Apply theme
    applyThemeToDOM(theme);
  }, []);
  
  // Apply theme changes to the DOM
  const applyThemeToDOM = (themeSettings) => {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', themeSettings.primaryColor);
    root.style.setProperty('--secondary-color', themeSettings.secondaryColor);
    root.style.setProperty('--background-color', themeSettings.backgroundColor);
    root.style.setProperty('--text-color', themeSettings.textColor);
    root.style.setProperty('--font-family', themeSettings.fontFamily);
    root.style.setProperty('--font-size', `${themeSettings.fontSize}px`);
    root.style.setProperty('--border-radius', `${themeSettings.borderRadius}px`);
  };
  
  // Handle theme changes
  const handleThemeChange = (key, value) => {
    const newTheme = { ...theme, [key]: value };
    setTheme(newTheme);
    applyThemeToDOM(newTheme);
  };
  
  // Apply color palette
  const applyColorPalette = (index) => {
    const palette = colorPalettes[index];
    setSelectedPalette(index);
    
    const newTheme = {
      ...theme,
      primaryColor: palette.primary,
      secondaryColor: palette.secondary
    };
    
    setTheme(newTheme);
    applyThemeToDOM(newTheme);
  };
  
  // Save theme to localStorage
  const saveTheme = () => {
    localStorage.setItem('resourceColonyTheme', JSON.stringify(theme));
    setIsOpen(false);
  };
  
  // Reset theme to defaults
  const resetTheme = () => {
    setTheme(defaultTheme);
    setSelectedPalette(0);
    applyThemeToDOM(defaultTheme);
  };
  
  return (
    <>
      <ThemeButton onClick={() => setIsOpen(!isOpen)}>
        <FaPalette />
      </ThemeButton>
      
      <ThemePanel isOpen={isOpen}>
        <ThemeHeader>Customize Theme</ThemeHeader>
        
        <ThemeOption>
          <OptionLabel>Color Scheme</OptionLabel>
          <ColorPickerRow>
            {colorPalettes.map((palette, index) => (
              <ColorSwatch
                key={index}
                color={palette.primary}
                selected={index === selectedPalette}
                onClick={() => applyColorPalette(index)}
                title={palette.name}
              />
            ))}
          </ColorPickerRow>
        </ThemeOption>
        
        <ThemeOption>
          <OptionLabel>Font Family</OptionLabel>
          <FontSelect
            value={theme.fontFamily}
            onChange={(e) => handleThemeChange('fontFamily', e.target.value)}
          >
            {fontOptions.map((font, index) => (
              <option key={index} value={font}>
                {font.split(',')[0]}
              </option>
            ))}
          </FontSelect>
        </ThemeOption>
        
        <ThemeOption>
          <OptionLabel>Font Size</OptionLabel>
          <SizeSelector>
            <SizeSlider
              type="range"
              min="12"
              max="20"
              value={theme.fontSize}
              onChange={(e) => handleThemeChange('fontSize', parseInt(e.target.value))}
            />
            <SizeLabel>{theme.fontSize}px</SizeLabel>
          </SizeSelector>
        </ThemeOption>
        
        <ThemeOption>
          <OptionLabel>Border Radius</OptionLabel>
          <SizeSelector>
            <SizeSlider
              type="range"
              min="0"
              max="16"
              value={theme.borderRadius}
              onChange={(e) => handleThemeChange('borderRadius', parseInt(e.target.value))}
            />
            <SizeLabel>{theme.borderRadius}px</SizeLabel>
          </SizeSelector>
        </ThemeOption>
        
        <ButtonRow>
          <ThemeButton2 onClick={resetTheme}>
            <FaUndo /> Reset
          </ThemeButton2>
          <ThemeButton2 primary onClick={saveTheme}>
            <FaSave /> Save
          </ThemeButton2>
        </ButtonRow>
      </ThemePanel>
    </>
  );
};

export default ThemeCustomizer;