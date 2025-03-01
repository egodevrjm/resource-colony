// src/components/CustomizableLayout.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import DraggablePanel from './DraggablePanel';
import { FaCog, FaUndo } from 'react-icons/fa';

const LayoutContainer = styled.div`
  position: relative;
`;

const LayoutControls = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-bottom: 10px;
`;

const ControlButton = styled.button`
  background: #4a6fa5;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: #3a5a8a;
  }
`;

const SettingsModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
`;

const SettingsTitle = styled.h2`
  margin-top: 0;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e2e8f0;
`;

const SettingOption = styled.div`
  margin-bottom: 15px;
`;

const OptionLabel = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-bottom: 8px;
`;

const Checkbox = styled.input`
  margin-right: 8px;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #e2e8f0;
`;

const ActionButton = styled.button`
  background: ${props => props.primary ? '#4a6fa5' : '#e2e8f0'};
  color: ${props => props.primary ? 'white' : '#4a5568'};
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  
  &:hover {
    background: ${props => props.primary ? '#3a5a8a' : '#cbd5e0'};
  }
`;

const CustomizableLayout = ({ panels }) => {
  // The panels prop is an array of objects like:
  // { id: 'uniqueId', title: 'Panel Title', component: <Component />, defaultVisible: true }
  
  // State to manage the order and visibility of panels
  const [panelOrder, setPanelOrder] = useState([]);
  const [visiblePanels, setVisiblePanels] = useState({});
  const [showSettings, setShowSettings] = useState(false);
  
  // Initialize panel order and visibility
  useEffect(() => {
    // Try to load saved layout from localStorage
    const savedLayout = localStorage.getItem('resourceColonyLayout');
    
    if (savedLayout) {
      try {
        const { order, visibility } = JSON.parse(savedLayout);
        
        // Validate saved order against available panels
        const validOrder = order.filter(id => panels.some(panel => panel.id === id));
        
        // Add any new panels that might not be in the saved order
        panels.forEach(panel => {
          if (!validOrder.includes(panel.id)) {
            validOrder.push(panel.id);
          }
        });
        
        setPanelOrder(validOrder);
        
        // Initialize visibility with saved settings or defaults
        const newVisibility = {};
        panels.forEach(panel => {
          const savedVisibility = visibility && visibility[panel.id];
          newVisibility[panel.id] = savedVisibility !== undefined ? savedVisibility : panel.defaultVisible;
        });
        
        setVisiblePanels(newVisibility);
      } catch (e) {
        console.error('Error loading saved layout:', e);
        initializeDefaultLayout();
      }
    } else {
      initializeDefaultLayout();
    }
  }, [panels]);
  
  // Initialize default layout
  const initializeDefaultLayout = () => {
    const defaultOrder = panels.map(panel => panel.id);
    setPanelOrder(defaultOrder);
    
    const defaultVisibility = {};
    panels.forEach(panel => {
      defaultVisibility[panel.id] = panel.defaultVisible !== false;
    });
    setVisiblePanels(defaultVisibility);
  };
  
  // Save current layout to localStorage
  const saveLayout = () => {
    const layoutData = {
      order: panelOrder,
      visibility: visiblePanels
    };
    
    localStorage.setItem('resourceColonyLayout', JSON.stringify(layoutData));
  };
  
  // Handle panel movement (drag and drop)
  const handlePanelMove = (panelId, newIndex) => {
    setPanelOrder(prevOrder => {
      const currentIndex = prevOrder.indexOf(panelId);
      if (currentIndex === -1) return prevOrder;
      
      // Create a new array without the moved panel
      const newOrder = prevOrder.filter(id => id !== panelId);
      
      // Insert the panel at the new position
      newOrder.splice(newIndex, 0, panelId);
      
      return newOrder;
    });
  };
  
  // Toggle panel visibility
  const togglePanelVisibility = (panelId) => {
    setVisiblePanels(prev => ({
      ...prev,
      [panelId]: !prev[panelId]
    }));
  };
  
  // Reset to default layout
  const resetLayout = () => {
    initializeDefaultLayout();
    saveLayout();
    setShowSettings(false);
  };
  
  // Apply settings changes
  const applySettings = () => {
    saveLayout();
    setShowSettings(false);
  };
  
  // Render the panels in their current order, respecting visibility
  const renderPanels = () => {
    return panelOrder
      .filter(panelId => visiblePanels[panelId])
      .map((panelId, index, filteredArray) => {
        const panel = panels.find(p => p.id === panelId);
        if (!panel) return null;
        
        return (
          <DraggablePanel
            key={panelId}
            id={panelId}
            title={panel.title}
            index={index}
            totalPanels={filteredArray.length}
            onMove={handlePanelMove}
            onSaveLayout={saveLayout}
          >
            {panel.component}
          </DraggablePanel>
        );
      });
  };
  
  return (
    <LayoutContainer>
      <LayoutControls>
        <ControlButton onClick={() => setShowSettings(true)}>
          <FaCog /> Customize Layout
        </ControlButton>
      </LayoutControls>
      
      {renderPanels()}
      
      {showSettings && (
        <SettingsModal onClick={() => setShowSettings(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <SettingsTitle>Customize Layout</SettingsTitle>
            
            <SettingOption>
              <OptionLabel>Panel Visibility</OptionLabel>
              {panels.map(panel => (
                <CheckboxLabel key={panel.id}>
                  <Checkbox
                    type="checkbox"
                    checked={visiblePanels[panel.id] || false}
                    onChange={() => togglePanelVisibility(panel.id)}
                  />
                  {panel.title}
                </CheckboxLabel>
              ))}
            </SettingOption>
            
            <ModalActions>
              <ActionButton onClick={resetLayout}>
                <FaUndo style={{ marginRight: '5px' }} /> Reset to Default
              </ActionButton>
              <ActionButton primary onClick={applySettings}>
                Apply
              </ActionButton>
            </ModalActions>
          </ModalContent>
        </SettingsModal>
      )}
    </LayoutContainer>
  );
};

export default CustomizableLayout;