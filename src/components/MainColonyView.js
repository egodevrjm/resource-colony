// src/components/MainColonyView.js
import React from 'react';
import styled from 'styled-components';
import ColonyVisualizer from './ColonyVisualizer';
import ColonistManagement from './ColonistManagement';
import TabPanel from './TabPanel';

const MainViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ColonyContainer = styled.div`
  background: var(--background-color, #f0f4f8);
  border-radius: var(--border-radius, 8px);
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ColonyTitle = styled.h2`
  margin-top: 0;
  margin-bottom: 16px;
  color: var(--text-color, #2d3748);
  font-size: 1.2rem;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 8px;
`;

const MainColonyView = ({ tabs }) => {
  return (
    <MainViewContainer>
      <ColonyContainer>
        {/* No need for title as it's included in the ColonyVisualizer */}
        <ColonyVisualizer />
      </ColonyContainer>
      
      <ColonyContainer>
        <ColonistManagement />
      </ColonyContainer>
      
      <TabPanel tabs={tabs} />
    </MainViewContainer>
  );
};

export default MainColonyView;