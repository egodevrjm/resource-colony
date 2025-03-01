// src/components/TabPanel.js
import React, { useState } from 'react';
import styled from 'styled-components';

const TabsContainer = styled.div`
  margin-bottom: 10px;
  background: var(--menuBackground);
  border-radius: 8px;
  overflow: hidden;
`;

const TabsRow = styled.div`
  display: flex;
`;

const TabButton = styled(({ active, ...rest }) => <button {...rest} />)`
  padding: 12px 20px;
  background: ${props => props.active ? 'var(--menuItemActive)' : 'transparent'};
  color: ${props => props.active ? 'var(--menuItemActiveText)' : 'var(--menuItemText)'};
  border: none;
  cursor: pointer;
  flex-grow: 1;
  transition: background-color 0.2s;
  
  &:hover {
    background: ${props => props.active ? 'var(--menuItemActive)' : 'var(--menuItemHover)'};
  }
`;

const TabContentContainer = styled.div`
  position: relative;
`;

const TabPanel = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || '');
  
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };
  
  // Get the active tab content
  const activeContent = tabs.find(tab => tab.id === activeTab)?.content;
  
  return (
    <div>
      <TabsContainer>
        <TabsRow>
          {tabs.map(tab => (
            <TabButton
              key={tab.id}
              active={activeTab === tab.id}
              onClick={() => handleTabChange(tab.id)}
            >
              {tab.label}
            </TabButton>
          ))}
        </TabsRow>
      </TabsContainer>
      
      <TabContentContainer>
        {activeContent}
      </TabContentContainer>
    </div>
  );
};

export default TabPanel;