// src/components/TutorialOverlay.js
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { advanceTutorial } from '../redux/gameSlice';
import { FaArrowRight, FaLightbulb } from 'react-icons/fa';

const OverlayContainer = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  width: 90%;
  max-width: 500px;
`;

const TutorialBox = styled.div`
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
  border-left: 4px solid #4299e1;
  display: flex;
  align-items: flex-start;
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: #ebf8ff;
  border-radius: 50%;
  margin-right: 16px;
  color: #4299e1;
`;

const TutorialContent = styled.div`
  flex-grow: 1;
`;

const TutorialTitle = styled.h3`
  margin: 0 0 8px 0;
  color: #2d3748;
`;

const TutorialMessage = styled.p`
  margin: 0;
  color: #4a5568;
`;

const NextButton = styled.button`
  background: #4299e1;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  margin-top: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-weight: bold;
  transition: background-color 0.2s;
  
  &:hover {
    background: #3182ce;
  }
`;

const ButtonText = styled.span`
  margin-right: 6px;
`;

const TutorialOverlay = () => {
  const dispatch = useDispatch();
  const tutorial = useSelector(state => state.game.tutorial);
  
  if (tutorial.completed) return null;
  
  const currentStep = tutorial.steps[tutorial.step];
  
  const handleNext = () => {
    dispatch(advanceTutorial());
  };
  
  // Tutorial titles based on step ID
  const titles = {
    welcome: 'Welcome to Resource Colony!',
    building: 'Building Your Colony',
    upgrade: 'Upgrading Production',
    research: 'Researching Technologies'
  };
  
  return (
    <OverlayContainer>
      <TutorialBox>
        <IconContainer>
          <FaLightbulb size={20} />
        </IconContainer>
        
        <TutorialContent>
          <TutorialTitle>{titles[currentStep.id]}</TutorialTitle>
          <TutorialMessage>{currentStep.text}</TutorialMessage>
          
          <NextButton onClick={handleNext}>
            <ButtonText>Next</ButtonText>
            <FaArrowRight size={12} />
          </NextButton>
        </TutorialContent>
      </TutorialBox>
    </OverlayContainer>
  );
};

export default TutorialOverlay;