// src/components/TechPanel.js
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { researchTech, canResearchTech } from '../redux/gameSlice';
import { FaSun, FaCubes, FaAppleAlt, FaWater, FaFlask, FaUsers, FaCogs, FaLock } from 'react-icons/fa';
import { SafeCostItem, isUnlocked, safeNumber } from './SafeWrappers';

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
`;

const TechGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  max-height: 600px;
  overflow-y: auto;
`;

const TechItem = styled(({ locked, ...rest }) => {
  // Create a data attribute for locked state
  const dataProps = {};
  if (locked !== undefined) {
    dataProps['data-locked'] = locked ? 'true' : 'false';
  }
  return <div {...rest} {...dataProps} />;
})`
  background: var(--cardBackground);
  padding: 16px;
  border-radius: 6px;
  box-shadow: var(--panelShadow);
  display: flex;
  justify-content: space-between;
  align-items: center;
  opacity: ${props => props['data-locked'] === 'true' ? 0.6 : 1};
`;

const TechInfo = styled.div`
  flex-grow: 1;
`;

const TechName = styled.div`
  font-weight: bold;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  color: var(--text);
`;

const TechLockIcon = styled.span`
  margin-right: 8px;
  color: var(--textSecondary);
`;

const TechDescription = styled.div`
  font-size: 0.8rem;
  color: var(--textSecondary);
  margin-top: 4px;
  margin-bottom: 8px;
`;

const TechUnlocks = styled.div`
  margin-top: 8px;
  font-size: 0.8rem;
`;

const TechUnlockCategory = styled.div`
  margin-bottom: 4px;
  font-weight: bold;
  color: var(--text);
`;

const TechUnlockItem = styled.span`
  display: inline-block;
  background: var(--hoverBackground);
  padding: 2px 6px;
  border-radius: 4px;
  margin-right: 4px;
  margin-bottom: 4px;
  font-size: 0.75rem;
  color: var(--text);
`;

const TechRequirement = styled.div`
  margin-top: 8px;
  font-size: 0.8rem;
  color: var(--textSecondary);
`;

const CostItem = SafeCostItem;

const CostIcon = styled.span`
  margin-right: 2px;
  font-size: 12px;
`;

const ResearchButton = styled.button`
  background-color: var(--primaryButton);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
  font-weight: bold;
  opacity: ${props => props.disabled ? 0.5 : 1};
  transition: background-color 0.2s;
  
  &:hover:not(:disabled) {
    background-color: var(--primaryButtonHover);
  }
  
  &:disabled {
    cursor: not-allowed;
  }
`;

const NoTechMessage = styled.div`
  text-align: center;
  padding: 20px;
  color: var(--textSecondary);
  background: var(--cardBackground);
  border-radius: 6px;
`;

const TechPanel = () => {
  const dispatch = useDispatch();
  const resources = useSelector(state => state.game.resources);
  const techs = useSelector(state => state.game.tech);
  const buildings = useSelector(state => state.game.buildings);
  const upgrades = useSelector(state => state.game.upgrades);
  
  const resourceIcons = {
    energy: <FaSun />,
    minerals: <FaCubes />,
    food: <FaAppleAlt />,
    water: <FaWater />,
    research: <FaFlask />,
    population: <FaUsers />,
    components: <FaCogs />,
  };
  
  // Get a sorted list of technologies (unlocked first, then by requirements)
  const sortedTechs = Object.entries(techs).sort((a, b) => {
    // Unlocked techs first
    if (a[1].unlocked && !b[1].unlocked) return -1;
    if (!a[1].unlocked && b[1].unlocked) return 1;
    
    // Then by prerequisite chain
    const aReqs = a[1].requires.length;
    const bReqs = b[1].requires.length;
    return aReqs - bReqs;
  });
  
  // For technologies that aren't unlocked, filter to only show those
  // that have all prerequisites met
  const researchableTechs = sortedTechs.filter(([id, tech]) => {
    // Always show unlocked techs
    if (tech && tech.unlocked === true) return true;
    
    // For locked techs, check if all prerequisites are met
    return tech && tech.requires && tech.requires.every(reqId => {
      const reqTech = techs[reqId];
      return reqTech && reqTech.unlocked === true;
    });
  });
  
  // Debug - log what's available for research
  console.log('Researchable techs:', researchableTechs.map(([id]) => id));
  
  // Function to get human-readable names of unlocks
  const getUnlockName = (type, id) => {
    if (type === 'buildings' && buildings[id]) {
      return buildings[id].name;
    } else if (type === 'upgrades' && upgrades[id]) {
      return upgrades[id].name;
    } else if (type === 'tech' && techs[id]) {
      return techs[id].name;
    }
    return id;
  };
  
  return (
    <Panel>
      <PanelTitle>Research</PanelTitle>
      
      <TechGrid>
        {researchableTechs.length === 0 ? (
          <NoTechMessage>
            No research options available yet
          </NoTechMessage>
        ) : (
          researchableTechs.map(([id, tech]) => {
            const researchable = !isUnlocked(tech) && canResearchTech({ tech: techs, resources }, id);
            console.log(`Tech ${id} is researchable: ${researchable}`);
            
            // Manual check for basicResearch
            const manualCheck = id === 'basicResearch' && 
                              !tech.unlocked && 
                              tech.requires.length === 0 &&
                              resources.research >= tech.cost.research;
            
            if (id === 'basicResearch') {
              console.log(`Manual check for basicResearch: ${manualCheck}`);
              console.log(`Research available: ${resources.research}, Cost: ${tech.cost.research}`);
            }
            
            const canResearch = researchable || manualCheck;
            
            return (
              <TechItem key={id} locked={!isUnlocked(tech) && !canResearch}>
                <TechInfo>
                  <TechName>
                    {!isUnlocked(tech) && <TechLockIcon><FaLock /></TechLockIcon>}
                    {tech.name}
                  </TechName>
                  
                  <TechDescription>{tech.description}</TechDescription>
                  
                  {!isUnlocked(tech) && (
                    <div>
                      {Object.entries(tech.cost).map(([resource, amount]) => (
                        <CostItem key={resource} canAfford={resources[resource] >= amount}>
                          <CostIcon>{resourceIcons[resource]}</CostIcon>
                          {safeNumber(amount, 0).toFixed(0)}
                        </CostItem>
                      ))}
                    </div>
                  )}
                  
                  {tech.requires.length > 0 && !isUnlocked(tech) && (
                    <TechRequirement>
                      Requires: {tech.requires.map(reqId => (
                        <TechUnlockItem key={reqId}>
                          {techs[reqId].name}
                        </TechUnlockItem>
                      ))}
                    </TechRequirement>
                  )}
                  
                  <TechUnlocks>
                    {tech.unlocksBuildings.length > 0 && (
                      <>
                        <TechUnlockCategory>Buildings:</TechUnlockCategory>
                        {tech.unlocksBuildings.map(buildingId => (
                          <TechUnlockItem key={buildingId}>
                            {getUnlockName('buildings', buildingId)}
                          </TechUnlockItem>
                        ))}
                      </>
                    )}
                    
                    {tech.unlocksUpgrades.length > 0 && (
                      <>
                        <TechUnlockCategory>Upgrades:</TechUnlockCategory>
                        {tech.unlocksUpgrades.map(upgradeId => (
                          <TechUnlockItem key={upgradeId}>
                            {getUnlockName('upgrades', upgradeId)}
                          </TechUnlockItem>
                        ))}
                      </>
                    )}
                    
                    {tech.unlocksTech.length > 0 && (
                      <>
                        <TechUnlockCategory>Technologies:</TechUnlockCategory>
                        {tech.unlocksTech.map(techId => (
                          <TechUnlockItem key={techId}>
                            {getUnlockName('tech', techId)}
                          </TechUnlockItem>
                        ))}
                      </>
                    )}
                  </TechUnlocks>
                </TechInfo>
                
                {!isUnlocked(tech) && (
                  <ResearchButton
                    onClick={(e) => {
                      dispatch(researchTech({ techId: id }));
                      
                      // Trigger visual effect for completed research
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = rect.left + rect.width / 2;
                      const y = rect.top + rect.height / 2;
                      
                      window.dispatchEvent(new CustomEvent('researchCompleted', {
                        detail: {
                          tech: tech.name,
                          x,
                          y
                        }
                      }));
                    }}
                    disabled={!canResearch}
                  >
                    Research
                  </ResearchButton>
                )}
              </TechItem>
            );
          })
        )}
      </TechGrid>
    </Panel>
  );
};

export default TechPanel;