// src/components/ResourceTrading.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { FaSun, FaCubes, FaAppleAlt, FaWater, FaFlask, FaUsers, FaCogs, FaExchangeAlt, FaArrowRight } from 'react-icons/fa';
import { safeNumber } from './SafeWrappers';

const Panel = styled.div`
  background: var(--cardBackground);
  border-radius: 8px;
  padding: 16px;
  box-shadow: var(--panelShadow);
`;

const PanelTitle = styled.h2`
  margin-top: 0;
  margin-bottom: 16px;
  color: var(--text);
  font-size: 1.2rem;
  border-bottom: 1px solid var(--border);
  padding-bottom: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TradingIntro = styled.p`
  color: var(--textSecondary);
  font-size: 0.9rem;
  margin-bottom: 16px;
`;

const TradeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const TradeRow = styled.div`
  display: flex;
  align-items: center;
  background: var(--hoverBackground);
  padding: 12px;
  border-radius: 8px;
  gap: 8px;
  
  @media (max-width: 640px) {
    flex-wrap: wrap;
  }
`;

const ResourceSelect = styled.div`
  flex-basis: 30%;
  
  @media (max-width: 640px) {
    flex-basis: 100%;
  }
`;

const ResourceDropdown = styled.select`
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid var(--border);
  background: var(--inputBackground);
  color: var(--text);
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: var(--primaryButton);
    box-shadow: 0 0 0 2px var(--primaryButtonHover);
  }
`;

const AmountInput = styled.div`
  flex-basis: 25%;
  
  @media (max-width: 640px) {
    flex-basis: 40%;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid var(--border);
  background: var(--inputBackground);
  color: var(--text);
  
  &:focus {
    outline: none;
    border-color: var(--primaryButton);
    box-shadow: 0 0 0 2px var(--primaryButtonHover);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ArrowContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-basis: 10%;
  color: var(--primaryButton);
  font-size: 1.2rem;
  
  @media (max-width: 640px) {
    flex-basis: 20%;
  }
`;

const TradeButton = styled.button`
  flex-basis: 10%;
  background: var(--primaryButton);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  transition: background-color 0.2s, transform 0.1s;
  
  &:hover:not(:disabled) {
    background: var(--primaryButtonHover);
  }
  
  &:active:not(:disabled) {
    transform: translateY(1px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  @media (max-width: 640px) {
    flex-basis: 100%;
    margin-top: 8px;
  }
`;

const ExchangeInfo = styled.div`
  color: var(--textSecondary);
  font-size: 0.8rem;
  text-align: center;
  margin-top: 6px;
`;

const EfficiencyAlert = styled.div`
  color: ${props => props.efficiency < 1 ? '#fc8181' : '#68d391'};
  font-size: 0.8rem;
  font-weight: 500;
  margin-top: 4px;
`;

const ResourceTrading = () => {
  const dispatch = useDispatch();
  const resources = useSelector(state => state.game.resources);
  const tech = useSelector(state => state.game.tech);
  
  // Local state for trading form
  const [fromResource, setFromResource] = useState('energy');
  const [toResource, setToResource] = useState('minerals');
  const [fromAmount, setFromAmount] = useState('100');
  const [toAmount, setToAmount] = useState('0');
  const [exchangeEfficiency, setExchangeEfficiency] = useState(0.8); // Default efficiency
  
  // Resource configs
  const resourceConfig = {
    energy: { 
      name: 'Energy', 
      icon: <FaSun />, 
      color: '#f6ad55',
      value: 1.0
    },
    minerals: { 
      name: 'Minerals', 
      icon: <FaCubes />, 
      color: '#63b3ed',
      value: 1.0 
    },
    food: { 
      name: 'Food', 
      icon: <FaAppleAlt />, 
      color: '#68d391',
      value: 1.2
    },
    water: { 
      name: 'Water', 
      icon: <FaWater />, 
      color: '#4299e1',
      value: 1.2
    },
    research: { 
      name: 'Research', 
      icon: <FaFlask />, 
      color: '#9f7aea',
      value: 2.0
    },
    components: { 
      name: 'Components', 
      icon: <FaCogs />, 
      color: '#a0aec0',
      value: 3.0
    }
  };
  
  // Update exchange efficiency based on technologies
  useEffect(() => {
    let baseEfficiency = 0.8; // 80% base efficiency
    
    // Example: If "Efficient Trading" tech is unlocked, increase efficiency
    if (tech?.efficientTrading?.unlocked) {
      baseEfficiency += 0.1; // +10%
    }
    
    // Example: Advanced trading tech could further improve efficiency
    if (tech?.advancedTrading?.unlocked) {
      baseEfficiency += 0.1; // Another +10%
    }
    
    setExchangeEfficiency(baseEfficiency);
  }, [tech]);
  
  // Calculate exchange rate
  const calculateExchangeRate = (from, to) => {
    if (!resourceConfig[from] || !resourceConfig[to]) return 1;
    
    // Value is what 1 unit of the resource is worth
    const fromValue = resourceConfig[from].value;
    const toValue = resourceConfig[to].value;
    
    // Exchange rate is how many units of 'to' you get for 1 unit of 'from'
    return (fromValue / toValue) * exchangeEfficiency;
  };
  
  // Update to amount when from amount or resources change
  useEffect(() => {
    const numAmount = parseFloat(fromAmount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setToAmount('0');
      return;
    }
    
    const rate = calculateExchangeRate(fromResource, toResource);
    const result = numAmount * rate;
    setToAmount(result.toFixed(1));
  }, [fromAmount, fromResource, toResource, exchangeEfficiency]);
  
  // Handle resource trading
  const handleTrade = () => {
    const fromAmount = parseFloat(document.getElementById('fromAmount').value);
    if (isNaN(fromAmount) || fromAmount <= 0) return;
    
    const toAmount = parseFloat(toAmount);
    if (isNaN(toAmount) || toAmount <= 0) return;
    
    // Check if we have enough of the resource to trade
    if (resources[fromResource] < fromAmount) return;
    
    // Dispatch trading action
    dispatch({
      type: 'game/tradeResources',
      payload: {
        fromResource,
        toResource,
        fromAmount,
        toAmount
      }
    });
    
    // Clear the form
    setFromAmount('100');
  };
  
  // Check if trade is valid
  const isTradeValid = () => {
    const numFromAmount = parseFloat(fromAmount);
    return (
      fromResource !== toResource &&
      !isNaN(numFromAmount) && 
      numFromAmount > 0 && 
      resources[fromResource] >= numFromAmount
    );
  };

  return (
    <Panel>
      <PanelTitle>Resource Trading</PanelTitle>
      
      <TradingIntro>
        Convert excess resources into ones you need most. Trading is not perfectly efficient,
        so there's a small loss in the conversion process.
      </TradingIntro>
      
      <TradeContainer>
        <TradeRow>
          <ResourceSelect>
            <ResourceDropdown 
              value={fromResource}
              onChange={(e) => setFromResource(e.target.value)}
            >
              {Object.entries(resourceConfig)
                .filter(([key]) => key !== 'population')
                .map(([key, resource]) => (
                  <option key={key} value={key}>{resource.name}</option>
                ))
              }
            </ResourceDropdown>
            <ExchangeInfo>
              Available: {safeNumber(resources[fromResource], 0).toFixed(0)}
            </ExchangeInfo>
          </ResourceSelect>
          
          <AmountInput>
            <Input
              id="fromAmount"
              type="number"
              min="1"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
            />
          </AmountInput>
          
          <ArrowContainer>
            <FaArrowRight />
          </ArrowContainer>
          
          <ResourceSelect>
            <ResourceDropdown 
              value={toResource}
              onChange={(e) => setToResource(e.target.value)}
            >
              {Object.entries(resourceConfig)
                .filter(([key]) => key !== 'population' && key !== fromResource)
                .map(([key, resource]) => (
                  <option key={key} value={key}>{resource.name}</option>
                ))
              }
            </ResourceDropdown>
            <ExchangeInfo>
              You'll receive: {toAmount}
            </ExchangeInfo>
          </ResourceSelect>
          
          <TradeButton 
            onClick={handleTrade}
            disabled={!isTradeValid()}
          >
            <FaExchangeAlt /> Trade
          </TradeButton>
        </TradeRow>
        
        <ExchangeInfo>
          Exchange rate: 1 {resourceConfig[fromResource]?.name} = {calculateExchangeRate(fromResource, toResource).toFixed(2)} {resourceConfig[toResource]?.name}
          <EfficiencyAlert efficiency={exchangeEfficiency}>
            Trading efficiency: {(exchangeEfficiency * 100).toFixed(0)}%
          </EfficiencyAlert>
        </ExchangeInfo>
      </TradeContainer>
    </Panel>
  );
};

export default ResourceTrading;