// src/components/StatsDashboard.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { FaChartLine, FaHistory, FaCalendarAlt, FaTrophy, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { safeNumber } from './SafeWrappers';
import HelpIcon from './HelpIcon';

// Recharts dependency is missing - creating placeholder components
const ResponsiveContainer = ({ children, width, height }) => (
  <div style={{ width: width || '100%', height: height || '100%' }}>
    {children}
  </div>
);

const LineChart = ({ children, ...props }) => (
  <div style={{ width: '100%', height: '100%', background: 'var(--hoverBackground)', borderRadius: '6px', padding: '8px' }}>
    <div style={{ textAlign: 'center', paddingTop: '100px' }}>
      Chart Display (Recharts library required)
    </div>
    {children}
  </div>
);

const Line = () => null;
const XAxis = () => null;
const YAxis = () => null;
const CartesianGrid = () => null;
const Tooltip = props => props.children || null;
const Legend = () => null;

const DashboardContainer = styled.div`
  background: var(--cardBackground);
  border-radius: 8px;
  padding: 16px;
  box-shadow: var(--panelShadow);
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.2rem;
  color: var(--text);
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 8px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 16px;
`;

const Tab = styled.button`
  padding: 8px 16px;
  background: ${props => props.active ? 'var(--primary)' : 'transparent'};
  color: ${props => props.active ? 'white' : 'var(--text)'};
  border: none;
  border-radius: 4px 4px 0 0;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
  
  &:hover {
    background: ${props => props.active ? 'var(--primary)' : 'var(--hoverBackground)'};
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const StatCard = styled.div`
  background: var(--hoverBackground);
  padding: 16px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: var(--elevatedShadow);
  }
`;

const StatTitle = styled.div`
  font-size: 0.9rem;
  color: var(--textSecondary);
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StatValue = styled.div`
  font-size: 1.4rem;
  font-weight: bold;
  color: var(--text);
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ChangeIndicator = styled.span`
  font-size: 0.8rem;
  color: ${props => props.positive ? 'var(--success)' : 'var(--danger)'};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ChartContainer = styled.div`
  height: 300px;
  width: 100%;
  margin-top: 20px;
`;

const NoDataMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: var(--textSecondary);
  font-style: italic;
  background: var(--hoverBackground);
  border-radius: 8px;
  border: 1px dashed var(--border);
`;

// A simple function to format large numbers
const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  } else {
    return num.toFixed(0);
  }
};

// Stats Dashboard component
const StatsDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const resources = useSelector(state => state.game.resources);
  const stats = useSelector(state => state.game.stats);
  const buildingCounts = useSelector(state => state.game.buildings);
  
  // Track historical data for charts (in a real implementation, this would be stored in Redux)
  const [historyData, setHistoryData] = useState([]);
  
  // Collect historical data every minute
  useEffect(() => {
    const timer = setInterval(() => {
      const timestamp = new Date();
      const hours = timestamp.getHours().toString().padStart(2, '0');
      const minutes = timestamp.getMinutes().toString().padStart(2, '0');
      const timeLabel = `${hours}:${minutes}`;
      
      setHistoryData(prevData => {
        // Keep only the last 10 data points to avoid overcrowding
        const newData = [...prevData, {
          time: timeLabel,
          energy: safeNumber(resources.energy, 0),
          minerals: safeNumber(resources.minerals, 0),
          food: safeNumber(resources.food, 0),
          water: safeNumber(resources.water, 0),
          research: safeNumber(resources.research, 0),
          population: safeNumber(resources.population, 0),
          components: safeNumber(resources.components, 0),
        }];
        
        if (newData.length > 10) {
          return newData.slice(newData.length - 10);
        } else {
          return newData;
        }
      });
    }, 60000); // Collect data every minute
    
    return () => clearInterval(timer);
  }, [resources]);
  
  // Calculate production rates
  const productionRates = {
    energy: 0,
    minerals: 0,
    food: 0,
    water: 0,
    research: 0,
    population: 0,
    components: 0
  };
  
  // Calculate change percentages (mock data for demonstration)
  const calculateChange = (resource) => {
    if (historyData.length < 2) return { value: 0, positive: true };
    
    const currentValue = safeNumber(resources[resource], 0);
    const previousValue = historyData[historyData.length - 2][resource];
    
    if (previousValue === 0) return { value: 0, positive: true };
    
    const change = ((currentValue - previousValue) / previousValue) * 100;
    return {
      value: Math.abs(change),
      positive: change >= 0
    };
  };
  
  // Format time for display (days, hours, minutes)
  const formatColonyAge = () => {
    const totalSeconds = safeNumber(stats.colonyAge, 0);
    const days = Math.floor(totalSeconds / (60 * 60 * 24));
    const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
    
    return `${days}d ${hours}h ${minutes}m`;
  };
  
  // Calculate total buildings
  const totalBuildings = Object.values(buildingCounts)
    .reduce((sum, building) => sum + safeNumber(building.count, 0), 0);
  
  return (
    <DashboardContainer>
      <DashboardHeader>
        <Title>
          <FaChartLine /> Colony Statistics
          <HelpIcon tooltip="View detailed statistics about your colony's performance and growth over time." />
        </Title>
      </DashboardHeader>
      
      <TabsContainer>
        <Tab 
          active={activeTab === 'overview'} 
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </Tab>
        <Tab 
          active={activeTab === 'resources'} 
          onClick={() => setActiveTab('resources')}
        >
          Resources
        </Tab>
        <Tab 
          active={activeTab === 'buildings'} 
          onClick={() => setActiveTab('buildings')}
        >
          Buildings
        </Tab>
      </TabsContainer>
      
      {activeTab === 'overview' && (
        <>
          <StatsGrid>
            <StatCard>
              <StatTitle>
                <span>Colony Age</span>
                <FaCalendarAlt />
              </StatTitle>
              <StatValue>{formatColonyAge()}</StatValue>
            </StatCard>
            
            <StatCard>
              <StatTitle>
                <span>Total Buildings</span>
                <FaHistory />
              </StatTitle>
              <StatValue>
                {totalBuildings}
                {historyData.length > 1 && (
                  <ChangeIndicator positive={true}>
                    <FaArrowUp /> Expanding
                  </ChangeIndicator>
                )}
              </StatValue>
            </StatCard>
            
            <StatCard>
              <StatTitle>
                <span>Population</span>
                <FaHistory />
              </StatTitle>
              <StatValue>
                {formatNumber(safeNumber(resources.population, 0))}
                {historyData.length > 1 && (
                  <ChangeIndicator positive={calculateChange('population').positive}>
                    {calculateChange('population').positive ? <FaArrowUp /> : <FaArrowDown />}
                    {calculateChange('population').value.toFixed(1)}%
                  </ChangeIndicator>
                )}
              </StatValue>
            </StatCard>
            
            <StatCard>
              <StatTitle>
                <span>Events Survived</span>
                <FaTrophy />
              </StatTitle>
              <StatValue>{safeNumber(stats.eventsSurvived, 0)}</StatValue>
            </StatCard>
          </StatsGrid>
          
          <ChartContainer>
            {historyData.length > 1 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={historyData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis 
                    dataKey="time"
                    stroke="var(--textSecondary)" 
                  />
                  <YAxis 
                    stroke="var(--textSecondary)"
                  />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'var(--cardBackground)', 
                      border: '1px solid var(--border)',
                      color: 'var(--text)'
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="energy" stroke="#f6ad55" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="minerals" stroke="#63b3ed" />
                  <Line type="monotone" dataKey="population" stroke="#fc8181" />
                  <Line type="monotone" dataKey="research" stroke="#9f7aea" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <NoDataMessage>
                Resource tracking will begin after 1 minute of play
              </NoDataMessage>
            )}
          </ChartContainer>
        </>
      )}
      
      {activeTab === 'resources' && (
        <StatsGrid>
          <StatCard>
            <StatTitle>
              <span>Energy</span>
              <FaHistory />
            </StatTitle>
            <StatValue>
              {formatNumber(safeNumber(resources.energy, 0))}
              {historyData.length > 1 && (
                <ChangeIndicator positive={calculateChange('energy').positive}>
                  {calculateChange('energy').positive ? <FaArrowUp /> : <FaArrowDown />}
                  {calculateChange('energy').value.toFixed(1)}%
                </ChangeIndicator>
              )}
            </StatValue>
          </StatCard>
          
          <StatCard>
            <StatTitle>
              <span>Minerals</span>
              <FaHistory />
            </StatTitle>
            <StatValue>
              {formatNumber(safeNumber(resources.minerals, 0))}
              {historyData.length > 1 && (
                <ChangeIndicator positive={calculateChange('minerals').positive}>
                  {calculateChange('minerals').positive ? <FaArrowUp /> : <FaArrowDown />}
                  {calculateChange('minerals').value.toFixed(1)}%
                </ChangeIndicator>
              )}
            </StatValue>
          </StatCard>
          
          <StatCard>
            <StatTitle>
              <span>Food</span>
              <FaHistory />
            </StatTitle>
            <StatValue>
              {formatNumber(safeNumber(resources.food, 0))}
              {historyData.length > 1 && (
                <ChangeIndicator positive={calculateChange('food').positive}>
                  {calculateChange('food').positive ? <FaArrowUp /> : <FaArrowDown />}
                  {calculateChange('food').value.toFixed(1)}%
                </ChangeIndicator>
              )}
            </StatValue>
          </StatCard>
          
          <StatCard>
            <StatTitle>
              <span>Water</span>
              <FaHistory />
            </StatTitle>
            <StatValue>
              {formatNumber(safeNumber(resources.water, 0))}
              {historyData.length > 1 && (
                <ChangeIndicator positive={calculateChange('water').positive}>
                  {calculateChange('water').positive ? <FaArrowUp /> : <FaArrowDown />}
                  {calculateChange('water').value.toFixed(1)}%
                </ChangeIndicator>
              )}
            </StatValue>
          </StatCard>
          
          <StatCard>
            <StatTitle>
              <span>Research</span>
              <FaHistory />
            </StatTitle>
            <StatValue>
              {formatNumber(safeNumber(resources.research, 0))}
              {historyData.length > 1 && (
                <ChangeIndicator positive={calculateChange('research').positive}>
                  {calculateChange('research').positive ? <FaArrowUp /> : <FaArrowDown />}
                  {calculateChange('research').value.toFixed(1)}%
                </ChangeIndicator>
              )}
            </StatValue>
          </StatCard>
          
          <StatCard>
            <StatTitle>
              <span>Components</span>
              <FaHistory />
            </StatTitle>
            <StatValue>
              {formatNumber(safeNumber(resources.components, 0))}
              {historyData.length > 1 && (
                <ChangeIndicator positive={calculateChange('components').positive}>
                  {calculateChange('components').positive ? <FaArrowUp /> : <FaArrowDown />}
                  {calculateChange('components').value.toFixed(1)}%
                </ChangeIndicator>
              )}
            </StatValue>
          </StatCard>
        </StatsGrid>
      )}
      
      {activeTab === 'buildings' && (
        <div>
          <StatsGrid>
            {Object.entries(buildingCounts).map(([key, building]) => (
              building && building.count > 0 && (
                <StatCard key={key}>
                  <StatTitle>
                    <span>{building.name}</span>
                  </StatTitle>
                  <StatValue>{building.count}</StatValue>
                </StatCard>
              )
            ))}
          </StatsGrid>
          
          {Object.values(buildingCounts).every(building => !building || building.count === 0) && (
            <NoDataMessage>
              No buildings constructed yet
            </NoDataMessage>
          )}
        </div>
      )}
    </DashboardContainer>
  );
};

export default StatsDashboard;