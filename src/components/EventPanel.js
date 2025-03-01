// src/components/EventPanel.js
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import { resolveEvent } from '../redux/gameSlice';
import { FaBolt, FaSun, FaCubes, FaAppleAlt, FaWater, FaFlask, FaCogs, FaHandPointer, FaExclamationTriangle, FaThumbsUp, FaClock } from 'react-icons/fa';
import { safeNumber, safeString } from './SafeWrappers';
import Tooltip from './Tooltip';

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(66, 153, 225, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(66, 153, 225, 0); }
  100% { box-shadow: 0 0 0 0 rgba(66, 153, 225, 0); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const EventContainer = styled(({ type, ...rest }) => {
  // Create a data attribute for type
  const dataProps = {};
  if (type !== undefined) {
    dataProps['data-type'] = safeString(type, 'neutral');
  }
  return <div {...rest} {...dataProps} />;
})`
  background: var(--cardBackground);
  border-radius: 8px;
  padding: 16px;
  position: relative;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-left: 4px solid ${props => 
    props['data-type'] === 'positive' ? '#48bb78' : 
    props['data-type'] === 'negative' ? '#f56565' : 
    '#4299e1'};
  overflow: hidden;
  animation: ${pulse} 2s infinite;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
      rgba(255, 255, 255, 0) 0%, 
      rgba(255, 255, 255, 0.05) 50%, 
      rgba(255, 255, 255, 0) 100%);
    background-size: 200% 100%;
    animation: ${shimmer} 3s infinite;
    pointer-events: none;
  }
`;

const EventHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  position: relative;
  z-index: 1;
`;

const TypeBadge = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: bold;
  text-transform: uppercase;
  color: white;
  background-color: ${props => 
    props.type === 'positive' ? '#48bb78' : 
    props.type === 'negative' ? '#f56565' : 
    '#4299e1'};
`;

const EventTitle = styled.h3`
  margin: 0;
  color: var(--text);
  display: flex;
  align-items: center;
  font-size: 1.2rem;
`;

const iconPulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
`;

const EventIcon = styled(({ type, ...rest }) => {
  // Create a data attribute for type
  const dataProps = {};
  if (type !== undefined) {
    dataProps['data-type'] = safeString(type, 'neutral');
  }
  return <div {...rest} {...dataProps} />;
})`
  margin-right: 10px;
  color: ${props => 
    props['data-type'] === 'positive' ? '#48bb78' : 
    props['data-type'] === 'negative' ? '#f56565' : 
    '#4299e1'};
  font-size: 1.5rem;
  animation: ${iconPulse} 2s infinite ease-in-out;
  display: flex;
  align-items: center;
`;

const EventDescription = styled.p`
  margin: 8px 0 16px 0;
  color: var(--textSecondary);
  line-height: 1.4;
  position: relative;
  z-index: 1;
  font-size: 0.95rem;
`;

const EventEffects = styled.div`
  margin-bottom: 16px;
  background: var(--hoverBackground);
  padding: 10px;
  border-radius: 6px;
  position: relative;
  z-index: 1;
`;

const EffectsTitle = styled.div`
  font-size: 0.9rem;
  font-weight: bold;
  margin-bottom: 8px;
  color: var(--text);
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 5px;
  }
`;

const EventEffect = styled(({ positive, negative, ...rest }) => {
  // Create data attributes
  const dataProps = {};
  if (positive !== undefined) {
    dataProps['data-positive'] = positive ? 'true' : 'false';
  }
  if (negative !== undefined) {
    dataProps['data-negative'] = negative ? 'true' : 'false';
  }
  return <div {...rest} {...dataProps} />;
})`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 0.9rem;
  color: ${props => 
    props['data-positive'] === 'true' ? '#48bb78' : 
    props['data-negative'] === 'true' ? '#f56565' : 
    'var(--text)'};
  padding: 6px 8px;
  border-radius: 4px;
  background: ${props => 
    props['data-positive'] === 'true' ? 'rgba(72, 187, 120, 0.1)' : 
    props['data-negative'] === 'true' ? 'rgba(245, 101, 101, 0.1)' : 
    'transparent'};
  transition: transform 0.2s;
  
  &:hover {
    transform: translateX(5px);
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const EffectIcon = styled.span`
  margin-right: 8px;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const progressBar = keyframes`
  0% { width: 100%; }
  100% { width: 0%; }
`;

const EventTimer = styled.div`
  font-size: 0.9rem;
  color: var(--textSecondary);
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  z-index: 1;
  position: relative;
`;

const TimerIcon = styled.span`
  margin-right: 8px;
  display: flex;
  align-items: center;
`;

const TimerBar = styled.div`
  height: 6px;
  background: var(--progressBarBackground);
  border-radius: 3px;
  overflow: hidden;
  margin-top: 8px;
  margin-bottom: 16px;
  position: relative;
  z-index: 1;
`;

const TimerProgress = styled.div`
  height: 100%;
  background: ${props => props.color || 'var(--primary)'};
  width: ${props => props.percent || 0}%;
  border-radius: 3px;
  transition: width 1s linear;
`;

const EventButton = styled.button`
  background-color: var(--primaryButton);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 16px;
  cursor: pointer;
  font-weight: bold;
  width: 100%;
  transition: all 0.2s;
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  &:hover {
    background-color: var(--primaryButtonHover);
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(1px);
  }
`;

const EventPanel = () => {
  const dispatch = useDispatch();
  const event = useSelector(state => state.game.events.active);
  const lastUpdate = useSelector(state => state.game.stats.lastUpdate);
  const [timePercent, setTimePercent] = useState(100);
  
  useEffect(() => {
    if (event) {
      const timer = setInterval(() => {
        const elapsedSeconds = (Date.now() - event.startTime) / 1000;
        const remainingPercent = Math.max(0, 100 - (elapsedSeconds / event.duration) * 100);
        setTimePercent(remainingPercent);
      }, 250);
      
      return () => clearInterval(timer);
    }
  }, [event]);
  
  if (!event) return null;
  
  // Calculate remaining time
  const elapsedSeconds = (lastUpdate - event.startTime) / 1000;
  const remainingSeconds = isNaN(elapsedSeconds) ? 0 : Math.max(0, event.duration - elapsedSeconds);
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = Math.floor(remainingSeconds % 60);
  
  // Determine if this is a positive or negative event
  const isPositive = event.effects && event.effects.productionMultipliers ? 
    Object.values(event.effects.productionMultipliers).some(val => val > 1) : 
    event.effects && event.effects.clickMultiplier && event.effects.clickMultiplier > 1;
  
  const isNegative = event.effects && event.effects.productionMultipliers ? 
    Object.values(event.effects.productionMultipliers).some(val => val < 1) : 
    event.effects && event.effects.clickMultiplier && event.effects.clickMultiplier < 1;
  
  const eventType = isPositive ? 'positive' : (isNegative ? 'negative' : 'neutral');
  
  // Resource icons
  const resourceIcons = {
    energy: <FaSun />,
    minerals: <FaCubes />,
    food: <FaAppleAlt />,
    water: <FaWater />,
    research: <FaFlask />,
    components: <FaCogs />,
    click: <FaHandPointer />
  };
  
  // Get the appropriate icon for the event type
  const getEventIcon = () => {
    switch(event.id) {
      case 'solarFlare': return <FaSun />;
      case 'mineralDeposit': return <FaCubes />;
      case 'waterLeak': return <FaWater />;
      case 'researchBreakthrough': return <FaFlask />;
      case 'clickFrenzy': return <FaHandPointer />;
      default: return <FaBolt />;
    }
  };
  
  return (
    <EventContainer type={eventType}>
      <EventHeader>
        <EventTitle>
          <EventIcon type={eventType}>
            {getEventIcon()}
          </EventIcon>
          {event.name}
        </EventTitle>
        <TypeBadge type={eventType}>
          {eventType === 'positive' ? 'Bonus' : eventType === 'negative' ? 'Alert' : 'Event'}
        </TypeBadge>
      </EventHeader>
      
      <EventDescription>{event.description}</EventDescription>
      
      <EventEffects>
        <EffectsTitle>
          {isPositive ? <FaThumbsUp /> : isNegative ? <FaExclamationTriangle /> : <FaBolt />}
          Active Effects
        </EffectsTitle>
        
        {event.effects && event.effects.productionMultipliers && (
          Object.entries(event.effects.productionMultipliers).map(([resource, multiplier]) => (
            <Tooltip 
              key={resource} 
              content={`Your ${resource} production is ${multiplier > 1 ? 'boosted' : 'hindered'} while this event is active.`}
            >
              <EventEffect 
                positive={multiplier > 1}
                negative={multiplier < 1}
              >
                <EffectIcon>{resourceIcons[resource]}</EffectIcon>
                <span>
                  <b>{resource.charAt(0).toUpperCase() + resource.slice(1)}</b> production 
                  {multiplier > 1 ? ' increased by ' : ' decreased by '}
                  <b>{Math.abs(safeNumber(multiplier - 1, 0) * 100).toFixed(0)}%</b>
                </span>
              </EventEffect>
            </Tooltip>
          ))
        )}
        
        {event.effects && event.effects.clickMultiplier && (
          <Tooltip content="This affects how much resources you get when clicking manually.">
            <EventEffect
              positive={event.effects.clickMultiplier > 1}
              negative={event.effects.clickMultiplier < 1}
            >
              <EffectIcon>{resourceIcons.click}</EffectIcon>
              <span>
                <b>Click efficiency</b> 
                {event.effects.clickMultiplier > 1 ? ' increased by ' : ' decreased by '}
                <b>{Math.abs(safeNumber(event.effects.clickMultiplier - 1, 0) * 100).toFixed(0)}%</b>
              </span>
            </EventEffect>
          </Tooltip>
        )}
      </EventEffects>
      
      <EventTimer>
        <TimerIcon><FaClock /></TimerIcon>
        Time remaining: {minutes}:{seconds < 10 ? '0' + seconds : seconds}
      </EventTimer>
      
      <TimerBar>
        <TimerProgress 
          percent={timePercent} 
          color={eventType === 'positive' ? '#48bb78' : eventType === 'negative' ? '#f56565' : '#4299e1'}
        />
      </TimerBar>
      
      <EventButton onClick={() => dispatch(resolveEvent())}>
        <FaBolt />
        Resolve Event Now
      </EventButton>
    </EventContainer>
  );
};

export default EventPanel;