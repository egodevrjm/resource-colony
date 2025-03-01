// src/components/EnhancedTrading.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import { FaSun, FaCubes, FaAppleAlt, FaWater, FaFlask, FaCogs, 
         FaExchangeAlt, FaArrowRight, FaArrowUp, FaArrowDown, 
         FaChartLine, FaHistory, FaLock, FaInfoCircle } from 'react-icons/fa';
import { safeNumber } from './SafeWrappers';
import Tooltip from './Tooltip';
import HelpIcon from './HelpIcon';

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

const TitleWithHelp = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TradingIntro = styled.p`
  color: var(--textSecondary);
  font-size: 0.9rem;
  margin-bottom: 16px;
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`;

const Tab = styled.button`
  padding: 8px 16px;
  background: ${props => props.active ? 'var(--primary)' : 'transparent'};
  color: ${props => props.active ? 'white' : 'var(--text)'};
  border: 1px solid ${props => props.active ? 'var(--primary)' : 'var(--border)'};
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
  
  &:hover {
    background: ${props => props.active ? 'var(--primary)' : 'var(--hoverBackground)'};
  }
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
  gap: 12px;
  
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
  padding: 10px;
  border-radius: 4px;
  border: 1px solid var(--border);
  background: var(--inputBackground);
  color: var(--text);
  cursor: pointer;
  font-size: 0.95rem;
  
  &:focus {
    outline: none;
    border-color: var(--primaryButton);
    box-shadow: 0 0 0 2px rgba(66, 153, 225, 0.3);
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
  padding: 10px;
  border-radius: 4px;
  border: 1px solid var(--border);
  background: var(--inputBackground);
  color: var(--text);
  font-size: 0.95rem;
  
  &:focus {
    outline: none;
    border-color: var(--primaryButton);
    box-shadow: 0 0 0 2px rgba(66, 153, 225, 0.3);
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
  
  svg {
    filter: drop-shadow(0 0 1px rgba(66, 153, 225, 0.4));
  }
  
  @media (max-width: 640px) {
    flex-basis: 20%;
  }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const TradeButton = styled.button`
  flex-basis: 10%;
  background: var(--primaryButton);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  transition: all 0.2s;
  font-weight: 600;
  
  &:hover:not(:disabled) {
    background: var(--primaryButtonHover);
    transform: translateY(-2px);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  }
  
  &:active:not(:disabled) {
    transform: translateY(1px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  ${props => props.optimalTrade && `
    animation: ${pulse} 1.5s infinite;
    background: var(--success);
    
    &:hover:not(:disabled) {
      background: #38a169;
    }
  `}
  
  @media (max-width: 640px) {
    flex-basis: 100%;
    margin-top: 8px;
  }
`;

const ExchangeInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
  padding: 8px;
  background: var(--cardBackground);
  border-radius: 4px;
  border: 1px solid var(--border);
`;

const ExchangeRate = styled.div`
  font-size: 0.9rem;
  color: var(--text);
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const ResourceIcon = styled.span`
  color: ${props => props.color || 'var(--primary)'};
  display: flex;
  align-items: center;
`;

const EfficiencyAlert = styled.div`
  color: ${props => props.efficiency < 1 ? 'var(--danger)' : 'var(--success)'};
  font-size: 0.9rem;
  font-weight: 500;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const RateChangeIndicator = styled.div`
  display: flex;
  align-items: center;
  color: ${props => props.trend > 0 ? 'var(--success)' : props.trend < 0 ? 'var(--danger)' : 'var(--textSecondary)'};
  font-size: 0.8rem;
  margin-left: 5px;
`;

const MarketGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 20px;
`;

const MarketCard = styled.div`
  background: var(--cardBackground);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 12px;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: var(--elevatedShadow);
  }
`;

const MarketResourceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding-bottom: 6px;
  border-bottom: 1px solid var(--border);
`;

const ResourceName = styled.div`
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text);
`;

const MarketValue = styled.div`
  display: flex;
  align-items: center;
  font-weight: bold;
  color: var(--text);
`;

const MarketTrend = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TrendRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: var(--textSecondary);
`;

const TrendChange = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${props => props.value > 0 ? 'var(--success)' : props.value < 0 ? 'var(--danger)' : 'var(--textSecondary)'};
  font-weight: ${props => props.value !== 0 ? 'bold' : 'normal'};
`;

const TrendIndicator = styled.div`
  flex-grow: 1;
  height: 4px;
  background: ${props => 
    props.value > 0 ? 'var(--success)' : 
    props.value < 0 ? 'var(--danger)' : 
    'var(--border)'};
  margin: 0 5px;
  border-radius: 2px;
`;

const TradeQuickButton = styled.button`
  width: 100%;
  padding: 8px;
  margin-top: 10px;
  background: var(--hoverBackground);
  border: 1px solid var(--border);
  border-radius: 4px;
  color: var(--text);
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.6 : 1};
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 0.9rem;
  
  &:hover:not(:disabled) {
    background: var(--primaryButton);
    color: white;
  }
`;

const HistoryContainer = styled.div`
  margin-top: 20px;
`;

const HistoryTitle = styled.h3`
  font-size: 1rem;
  color: var(--text);
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const HistoryTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  font-size: 0.9rem;
`;

const TableHead = styled.thead`
  background: var(--hoverBackground);
  color: var(--text);
  
  th {
    padding: 10px;
    text-align: left;
  }
`;

const TableBody = styled.tbody`
  tr {
    border-bottom: 1px solid var(--border);
    
    &:last-child {
      border-bottom: none;
    }
  }
  
  td {
    padding: 10px;
    color: var(--textSecondary);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: var(--textSecondary);
  background: var(--hoverBackground);
  border-radius: 8px;
  margin-top: 20px;
  font-style: italic;
`;

const EnhancedTrading = () => {
  const dispatch = useDispatch();
  const resources = useSelector(state => state.game.resources);
  const tech = useSelector(state => state.game.tech);
  const [activeTab, setActiveTab] = useState('trade');
  
  // Local state for trading form
  const [fromResource, setFromResource] = useState('energy');
  const [toResource, setToResource] = useState('minerals');
  const [fromAmount, setFromAmount] = useState('100');
  const [toAmount, setToAmount] = useState('0');
  
  // Market data (simulating dynamic market with history)
  const [marketData, setMarketData] = useState({});
  const [exchangeRates, setExchangeRates] = useState({});
  const [marketTrends, setMarketTrends] = useState({});
  const [tradeHistory, setTradeHistory] = useState([]);
  const [baseEfficiency, setBaseEfficiency] = useState(0.8);
  
  // Resource configurations
  const resourceConfig = {
    energy: { 
      name: 'Energy', 
      icon: <FaSun />, 
      color: '#f6ad55',
      baseValue: 1.0,
      volatility: 0.05 // How much the price can fluctuate
    },
    minerals: { 
      name: 'Minerals', 
      icon: <FaCubes />, 
      color: '#63b3ed',
      baseValue: 1.0,
      volatility: 0.07
    },
    food: { 
      name: 'Food', 
      icon: <FaAppleAlt />, 
      color: '#68d391',
      baseValue: 1.2,
      volatility: 0.1
    },
    water: { 
      name: 'Water', 
      icon: <FaWater />, 
      color: '#4299e1',
      baseValue: 1.2,
      volatility: 0.08
    },
    research: { 
      name: 'Research', 
      icon: <FaFlask />, 
      color: '#9f7aea',
      baseValue: 2.0,
      volatility: 0.12
    },
    components: { 
      name: 'Components', 
      icon: <FaCogs />, 
      color: '#a0aec0',
      baseValue: 3.0,
      volatility: 0.15
    }
  };
  
  // Initialize market data on first load
  useEffect(() => {
    initializeMarket();
    
    // Market fluctuations every 30 seconds
    const marketTimer = setInterval(() => {
      updateMarketPrices();
    }, 30000);
    
    return () => clearInterval(marketTimer);
  }, []);
  
  // Update exchange efficiency based on technologies
  useEffect(() => {
    let efficiency = 0.8; // 80% base efficiency
    
    // Apply technology bonuses to efficiency
    if (tech?.efficientTrading?.unlocked) {
      efficiency += 0.1; // +10%
    }
    
    if (tech?.advancedTrading?.unlocked) {
      efficiency += 0.1; // Another +10%
    }
    
    setBaseEfficiency(efficiency);
  }, [tech]);
  
  // Initialize market with random values around base values
  const initializeMarket = () => {
    const initialMarketData = {};
    const initialRates = {};
    const initialTrends = {};
    
    Object.entries(resourceConfig).forEach(([resource, config]) => {
      // Random value between 0.9x and 1.1x of base value
      const randomFactor = 0.9 + (Math.random() * 0.2);
      const initialValue = config.baseValue * randomFactor;
      
      initialMarketData[resource] = initialValue;
      initialTrends[resource] = {
        daily: (Math.random() * 0.2) - 0.1, // Between -10% and +10%
        weekly: (Math.random() * 0.4) - 0.2, // Between -20% and +20%
      };
      
      // Initialize exchange rates
      Object.keys(resourceConfig).forEach(otherResource => {
        if (resource !== otherResource) {
          const key = `${resource}_${otherResource}`;
          initialRates[key] = initialValue / initialMarketData[otherResource] || 0;
        }
      });
    });
    
    setMarketData(initialMarketData);
    setExchangeRates(initialRates);
    setMarketTrends(initialTrends);
  };
  
  // Update market prices with random fluctuations
  const updateMarketPrices = () => {
    const newMarketData = { ...marketData };
    const newTrends = { ...marketTrends };
    const newRates = { ...exchangeRates };
    
    Object.entries(resourceConfig).forEach(([resource, config]) => {
      // Random change based on volatility
      const change = (Math.random() * 2 - 1) * config.volatility;
      const oldValue = newMarketData[resource];
      let newValue = oldValue * (1 + change);
      
      // Ensure values don't deviate too far from base value
      const maxDeviation = 0.5; // Max 50% deviation
      const lowerBound = config.baseValue * (1 - maxDeviation);
      const upperBound = config.baseValue * (1 + maxDeviation);
      newValue = Math.max(lowerBound, Math.min(newValue, upperBound));
      
      newMarketData[resource] = newValue;
      
      // Update trends
      newTrends[resource] = {
        daily: ((newValue / oldValue) - 1) * 10, // Amplify for UI
        weekly: newTrends[resource].weekly * 0.9 + change * 0.1 // Smooth weekly trend
      };
      
      // Update exchange rates
      Object.keys(resourceConfig).forEach(otherResource => {
        if (resource !== otherResource) {
          const key = `${resource}_${otherResource}`;
          newRates[key] = newValue / newMarketData[otherResource] || 0;
        }
      });
    });
    
    setMarketData(newMarketData);
    setMarketTrends(newTrends);
    setExchangeRates(newRates);
  };
  
  // Calculate exchange rate between two resources
  const calculateExchangeRate = (from, to) => {
    if (!resourceConfig[from] || !resourceConfig[to] || from === to) return 0;
    
    const key = `${from}_${to}`;
    let rate = exchangeRates[key] || (marketData[from] / marketData[to]) || 0;
    
    // Apply efficiency modifier
    rate *= baseEfficiency;
    
    return rate;
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
  }, [fromAmount, fromResource, toResource, exchangeRates, baseEfficiency]);
  
  // Handle resource trading
  const handleTrade = () => {
    const fromAmountNum = parseFloat(fromAmount);
    if (isNaN(fromAmountNum) || fromAmountNum <= 0) return;
    
    const toAmountNum = parseFloat(toAmount);
    if (isNaN(toAmountNum) || toAmountNum <= 0) return;
    
    // Check if we have enough of the resource to trade
    if (resources[fromResource] < fromAmountNum) return;
    
    // Dispatch trading action
    dispatch({
      type: 'game/tradeResources',
      payload: {
        fromResource,
        toResource,
        fromAmount: fromAmountNum,
        toAmount: toAmountNum
      }
    });
    
    // Add to trade history
    const newTrade = {
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      fromResource,
      toResource,
      fromAmount: fromAmountNum,
      toAmount: toAmountNum,
      rate: calculateExchangeRate(fromResource, toResource)
    };
    
    setTradeHistory([newTrade, ...tradeHistory].slice(0, 10)); // Keep only the last 10 trades
    
    // Clear the form
    setFromAmount('100');
  };
  
  // Handle quick trades directly from market view
  const handleQuickTrade = (resource) => {
    // Find best resource to trade for
    let bestTarget = null;
    let bestRate = 0;
    
    Object.keys(resourceConfig).forEach(target => {
      if (target !== resource) {
        const rate = calculateExchangeRate(resource, target);
        if (rate > bestRate) {
          bestRate = rate;
          bestTarget = target;
        }
      }
    });
    
    if (bestTarget) {
      setFromResource(resource);
      setToResource(bestTarget);
      setActiveTab('trade');
    }
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
  
  // Check if this is an optimal trade based on market conditions
  const isOptimalTrade = () => {
    if (!isTradeValid()) return false;
    
    // Check if this resource pair has the best exchange rate for the fromResource
    let bestTarget = null;
    let bestRate = 0;
    
    Object.keys(resourceConfig).forEach(target => {
      if (target !== fromResource) {
        const rate = calculateExchangeRate(fromResource, target);
        if (rate > bestRate) {
          bestRate = rate;
          bestTarget = target;
        }
      }
    });
    
    return bestTarget === toResource;
  };
  
  // Get trend indicator component
  const getTrendIndicator = (value) => {
    if (value > 0.05) return <FaArrowUp />;
    if (value < -0.05) return <FaArrowDown />;
    return null;
  };
  
  // Format the trend value as a percentage
  const formatTrendValue = (value) => {
    const percentage = (value * 100).toFixed(1);
    return value > 0 ? `+${percentage}%` : `${percentage}%`;
  };

  return (
    <Panel>
      <PanelTitle>
        <TitleWithHelp>
          Resource Exchange Market
          <HelpIcon tooltip="Trade your resources at variable market rates. Monitor market conditions to maximize your trading efficiency." />
        </TitleWithHelp>
      </PanelTitle>
      
      <TradingIntro>
        The market value of resources fluctuates over time. Time your trades wisely to maximize efficiency.
        Your current trading efficiency is {(baseEfficiency * 100).toFixed(0)}%.
      </TradingIntro>
      
      <TabsContainer>
        <Tab 
          active={activeTab === 'trade'} 
          onClick={() => setActiveTab('trade')}
        >
          Trade Resources
        </Tab>
        <Tab 
          active={activeTab === 'market'} 
          onClick={() => setActiveTab('market')}
        >
          Market Prices
        </Tab>
        <Tab 
          active={activeTab === 'history'} 
          onClick={() => setActiveTab('history')}
        >
          Trade History
        </Tab>
      </TabsContainer>
      
      {activeTab === 'trade' && (
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
                placeholder="Amount to trade"
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
              optimalTrade={isOptimalTrade()}
            >
              <FaExchangeAlt /> {isOptimalTrade() ? 'Great Deal!' : 'Trade'}
            </TradeButton>
          </TradeRow>
          
          <ExchangeInfo>
            <ExchangeRate>
              <ResourceIcon color={resourceConfig[fromResource]?.color}>
                {resourceConfig[fromResource]?.icon}
              </ResourceIcon>
              1 {resourceConfig[fromResource]?.name} = 
              {calculateExchangeRate(fromResource, toResource).toFixed(2)} 
              <ResourceIcon color={resourceConfig[toResource]?.color}>
                {resourceConfig[toResource]?.icon}
              </ResourceIcon>
              {resourceConfig[toResource]?.name}
              
              <RateChangeIndicator trend={marketTrends[fromResource]?.daily || 0}>
                {getTrendIndicator(marketTrends[fromResource]?.daily || 0)} 
                {marketTrends[fromResource]?.daily && formatTrendValue(marketTrends[fromResource].daily)}
              </RateChangeIndicator>
            </ExchangeRate>
            
            <EfficiencyAlert efficiency={baseEfficiency}>
              {baseEfficiency >= 1 ? <FaArrowUp /> : <FaInfoCircle />} 
              Trading efficiency: {(baseEfficiency * 100).toFixed(0)}%
            </EfficiencyAlert>
          </ExchangeInfo>
        </TradeContainer>
      )}
      
      {activeTab === 'market' && (
        <MarketGrid>
          {Object.entries(resourceConfig).map(([resource, config]) => (
            <MarketCard key={resource}>
              <MarketResourceHeader>
                <ResourceName>
                  <ResourceIcon color={config.color}>{config.icon}</ResourceIcon>
                  {config.name}
                </ResourceName>
                <MarketValue>
                  {marketData[resource]?.toFixed(2)}
                  <RateChangeIndicator trend={marketTrends[resource]?.daily || 0}>
                    {getTrendIndicator(marketTrends[resource]?.daily || 0)}
                  </RateChangeIndicator>
                </MarketValue>
              </MarketResourceHeader>
              
              <MarketTrend>
                <TrendRow>
                  <span>Daily Change:</span>
                  <TrendChange value={marketTrends[resource]?.daily || 0}>
                    {formatTrendValue(marketTrends[resource]?.daily || 0)}
                  </TrendChange>
                </TrendRow>
                <TrendRow>
                  <span>Weekly Trend:</span>
                  <TrendChange value={marketTrends[resource]?.weekly || 0}>
                    {formatTrendValue(marketTrends[resource]?.weekly || 0)}
                  </TrendChange>
                </TrendRow>
                <TrendRow>
                  <span>Your Balance:</span>
                  <span>{safeNumber(resources[resource], 0).toFixed(0)}</span>
                </TrendRow>
              </MarketTrend>
              
              <Tooltip content="Find the best trading deal for this resource">
                <TradeQuickButton 
                  onClick={() => handleQuickTrade(resource)}
                  disabled={safeNumber(resources[resource], 0) < 10}
                >
                  <FaExchangeAlt /> Find Best Deal
                </TradeQuickButton>
              </Tooltip>
            </MarketCard>
          ))}
        </MarketGrid>
      )}
      
      {activeTab === 'history' && (
        <HistoryContainer>
          <HistoryTitle>
            <FaHistory /> Recent Trades
          </HistoryTitle>
          
          {tradeHistory.length > 0 ? (
            <HistoryTable>
              <TableHead>
                <tr>
                  <th>Time</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Rate</th>
                </tr>
              </TableHead>
              <TableBody>
                {tradeHistory.map(trade => (
                  <tr key={trade.id}>
                    <td>{trade.timestamp}</td>
                    <td>
                      <ResourceIcon color={resourceConfig[trade.fromResource]?.color}>
                        {resourceConfig[trade.fromResource]?.icon}
                      </ResourceIcon>
                      {trade.fromAmount} {resourceConfig[trade.fromResource]?.name}
                    </td>
                    <td>
                      <ResourceIcon color={resourceConfig[trade.toResource]?.color}>
                        {resourceConfig[trade.toResource]?.icon}
                      </ResourceIcon>
                      {trade.toAmount} {resourceConfig[trade.toResource]?.name}
                    </td>
                    <td>{trade.rate.toFixed(2)}</td>
                  </tr>
                ))}
              </TableBody>
            </HistoryTable>
          ) : (
            <EmptyState>
              No trade history yet. Complete trades to see them logged here.
            </EmptyState>
          )}
        </HistoryContainer>
      )}
    </Panel>
  );
};

export default EnhancedTrading;