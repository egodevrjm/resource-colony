// src/components/DraggablePanel.js
import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { FaGripVertical, FaWindowMinimize, FaWindowMaximize } from 'react-icons/fa';

const PanelContainer = styled.div`
  position: relative;
  margin-bottom: 20px;
  transition: transform 0.2s, box-shadow 0.2s;
  
  ${props => props.isDragging && `
    z-index: 1000;
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.2);
    opacity: 0.9;
  `}
  
  ${props => props.isMinimized && `
    overflow: hidden;
  `}
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background: #4a6fa5;
  color: white;
  font-weight: bold;
  border-radius: 8px 8px 0 0;
  cursor: grab;
  
  &:active {
    cursor: grabbing;
  }
`;

const HeaderTitle = styled.div`
  display: flex;
  align-items: center;
`;

const GripIcon = styled.div`
  margin-right: 10px;
  opacity: 0.7;
`;

const HeaderControls = styled.div`
  display: flex;
  gap: 10px;
`;

const ControlButton = styled.button`
  background: none;
  border: none;
  color: white;
  padding: 0;
  opacity: 0.7;
  cursor: pointer;
  transition: opacity 0.2s;
  
  &:hover {
    opacity: 1;
  }
`;

const PanelContent = styled.div`
  max-height: ${props => props.isMinimized ? '0' : '2000px'};
  overflow: hidden;
  transition: max-height 0.3s ease-in-out;
  background: #f0f4f8;
  border-radius: 0 0 8px 8px;
`;

const DraggablePanel = ({ 
  id, 
  title, 
  children, 
  onMove, 
  index, 
  totalPanels,
  onSaveLayout
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragStartIndex, setDragStartIndex] = useState(index);
  const panelRef = useRef(null);
  
  // Start drag operation
  const handleDragStart = (e) => {
    // Prevent default browser drag behavior
    e.preventDefault();
    
    setIsDragging(true);
    setDragStartY(e.clientY);
    setDragStartIndex(index);
    
    // Add event listeners for mouse movement and mouse up
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
    
    // Add a style to indicate dragging
    if (panelRef.current) {
      panelRef.current.style.position = 'relative';
      panelRef.current.style.zIndex = '1000';
      panelRef.current.style.boxShadow = '0 10px 15px rgba(0, 0, 0, 0.2)';
    }
  };
  
  // Handle drag movement
  const handleDragMove = (e) => {
    if (!isDragging) return;
    
    // Calculate distance moved
    const deltaY = e.clientY - dragStartY;
    
    // Apply transform to visually move the panel
    if (panelRef.current) {
      panelRef.current.style.transform = `translateY(${deltaY}px)`;
    }
    
    // Check if movement is enough to change position
    const containerHeight = panelRef.current?.offsetHeight || 100;
    let newIndex = dragStartIndex;
    
    if (deltaY < -containerHeight / 2 && newIndex > 0) {
      // Moving up
      newIndex = dragStartIndex - 1;
    } else if (deltaY > containerHeight / 2 && newIndex < totalPanels - 1) {
      // Moving down
      newIndex = dragStartIndex + 1;
    }
    
    // If position changed, trigger the move
    if (newIndex !== index && newIndex !== dragStartIndex) {
      onMove(id, newIndex);
      setDragStartY(e.clientY);
      setDragStartIndex(newIndex);
      
      // Reset transform after position change
      if (panelRef.current) {
        panelRef.current.style.transform = 'translateY(0)';
      }
    }
  };
  
  // End drag operation
  const handleDragEnd = () => {
    setIsDragging(false);
    setDragStartY(0);
    
    // Reset panel styles
    if (panelRef.current) {
      panelRef.current.style.position = '';
      panelRef.current.style.zIndex = '';
      panelRef.current.style.boxShadow = '';
      panelRef.current.style.transform = 'translateY(0)';
    }
    
    // Save layout to localStorage
    if (onSaveLayout) {
      onSaveLayout();
    }
    
    // Remove event listeners
    document.removeEventListener('mousemove', handleDragMove);
    document.removeEventListener('mouseup', handleDragEnd);
  };
  
  // Toggle panel minimized state
  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };
  
  return (
    <PanelContainer 
      ref={panelRef}
      isDragging={isDragging}
      isMinimized={isMinimized}
    >
      <PanelHeader 
        onMouseDown={handleDragStart}
      >
        <HeaderTitle>
          <GripIcon>
            <FaGripVertical />
          </GripIcon>
          {title}
        </HeaderTitle>
        <HeaderControls>
          <ControlButton onClick={toggleMinimize}>
            {isMinimized ? <FaWindowMaximize /> : <FaWindowMinimize />}
          </ControlButton>
        </HeaderControls>
      </PanelHeader>
      
      <PanelContent isMinimized={isMinimized}>
        {children}
      </PanelContent>
    </PanelContainer>
  );
};

export default DraggablePanel;