// src/components/HelpIcon.js
import React from 'react';
import styled from 'styled-components';
import { FaQuestionCircle } from 'react-icons/fa';
import Tooltip from './Tooltip';

const IconWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: 6px;
  font-size: ${props => props.size || '0.875rem'};
  color: var(--textSecondary);
  opacity: 0.7;
  transition: opacity 0.2s, color 0.2s;
  cursor: help;
  
  &:hover {
    opacity: 1;
    color: var(--primary);
  }
`;

const HelpIcon = ({ tooltip, position = 'top', size }) => {
  return (
    <Tooltip content={tooltip} position={position}>
      <IconWrapper size={size}>
        <FaQuestionCircle />
      </IconWrapper>
    </Tooltip>
  );
};

export default HelpIcon;