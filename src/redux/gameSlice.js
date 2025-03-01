// src/redux/gameSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Add the isUnlocked and safeNumber helpers at the top of the file
const isUnlocked = (entity) => {
  if (!entity) return false;
  // If it's a boolean, we can directly compare
  if (typeof entity.unlocked === 'boolean') {
    return entity.unlocked === true;
  }
  // If it's undefined, we'll consider it not unlocked
  return false;
};

const safeNumber = (value, defaultValue = 0) => {
  if (value === undefined || value === null || isNaN(value)) {
    return defaultValue;
  }
  return value;
};

// Define initial resources
const initialState = {
  // Game version for compatibility
  version: '1.1.0',
  resources: {
    energy: 50,  // Significantly increased starting resources
    minerals: 50,
    food: 50,
    water: 50,
    research: 20,  // More research points to start
    population: 0,
    components: 0,
  },
  buildings: {
    // Basic resource producers
    solarPanel: { 
      count: 0, 
      baseCost: { energy: 0, minerals: 10 }, 
      baseOutput: { energy: 0.2 }, 
      name: 'Solar Panel',
      description: 'Generates energy from the sun',
      unlocked: true
    },
    mine: { 
      count: 0, 
      baseCost: { energy: 10, minerals: 0 }, 
      baseOutput: { minerals: 0.2 }, 
      name: 'Mine',
      description: 'Extracts minerals from the surface',
      unlocked: true
    },
    farm: { 
      count: 0, 
      baseCost: { energy: 5, minerals: 5 }, 
      baseOutput: { food: 0.2 }, 
      name: 'Farm',
      description: 'Grows food for your colonists',
      unlocked: true
    },
    waterExtractor: { 
      count: 0, 
      baseCost: { energy: 7, minerals: 3 }, 
      baseOutput: { water: 0.2 }, 
      name: 'Water Extractor',
      description: 'Pulls water from the atmosphere',
      unlocked: true
    },
    
    // Advanced buildings
    researchLab: { 
      count: 0, 
      baseCost: { energy: 20, minerals: 30, food: 10, water: 10 }, 
      baseOutput: { research: 0.1 }, 
      name: 'Research Lab',
      description: 'Generates research points for new technologies',
      unlocked: false
    },
    habitat: { 
      count: 0, 
      baseCost: { energy: 30, minerals: 50, food: 20, water: 20 }, 
      baseOutput: { population: 0.05 }, 
      name: 'Habitat',
      description: 'Houses colonists to grow your population',
      unlocked: false
    },
    factory: { 
      count: 0, 
      baseCost: { energy: 50, minerals: 50, population: 1 }, 
      baseOutput: { components: 0.1 }, 
      name: 'Factory',
      description: 'Produces components for advanced buildings',
      unlocked: false
    },
    advancedSolarArray: { 
      count: 0, 
      baseCost: { energy: 100, minerals: 100, components: 10 }, 
      baseOutput: { energy: 1.0 }, 
      name: 'Advanced Solar Array',
      description: 'High-efficiency energy generation',
      unlocked: false
    },
    deepDrillingSite: { 
      count: 0, 
      baseCost: { energy: 150, minerals: 50, components: 15 }, 
      baseOutput: { minerals: 1.0 }, 
      name: 'Deep Drilling Site',
      description: 'Extract minerals from deep underground',
      unlocked: false
    }
  },
  upgrades: {
    // Basic resource upgrades
    energyEfficiency: { 
      level: 0, 
      baseCost: { energy: 50, minerals: 50 }, 
      effect: 1.1, 
      name: 'Energy Efficiency',
      description: 'Improves energy production by 10% per level',
      unlocked: true
    },
    advancedMining: { 
      level: 0, 
      baseCost: { energy: 50, minerals: 50 }, 
      effect: 1.1, 
      name: 'Advanced Mining',
      description: 'Improves mineral production by 10% per level',
      unlocked: true
    },
    hydroponics: { 
      level: 0, 
      baseCost: { energy: 50, minerals: 50 }, 
      effect: 1.1, 
      name: 'Hydroponics',
      description: 'Improves food production by 10% per level',
      unlocked: true
    },
    waterRecycling: { 
      level: 0, 
      baseCost: { energy: 50, minerals: 50 }, 
      effect: 1.1, 
      name: 'Water Recycling',
      description: 'Improves water production by 10% per level',
      unlocked: true
    },
    
    // Advanced upgrades
    clickEfficiency: { 
      level: 0, 
      baseCost: { research: 10 }, 
      effect: 1.5, 
      name: 'Click Efficiency',
      description: 'Increases manual collection by 50% per level',
      unlocked: false
    },
    researchEfficiency: { 
      level: 0, 
      baseCost: { research: 20, energy: 100 }, 
      effect: 1.2, 
      name: 'Research Efficiency',
      description: 'Improves research output by 20% per level',
      unlocked: false
    },
    populationGrowth: { 
      level: 0, 
      baseCost: { research: 30, food: 200, water: 200 }, 
      effect: 1.2, 
      name: 'Population Growth',
      description: 'Increases population growth by 20% per level',
      unlocked: false
    },
    componentProduction: { 
      level: 0, 
      baseCost: { research: 50, energy: 300, minerals: 300 }, 
      effect: 1.2, 
      name: 'Component Production',
      description: 'Improves component production by 20% per level',
      unlocked: false
    }
  },
  tech: {
    basicResearch: { 
      unlocked: false, 
      cost: { research: 10 }, 
      name: 'Basic Research',
      description: 'Unlock research capabilities',
      unlocksBuildings: ['researchLab'],
      unlocksUpgrades: [],
      unlocksTech: ['advancedHousing'],
      requires: []
    },
    advancedHousing: { 
      unlocked: false, 
      cost: { research: 100 }, 
      name: 'Advanced Housing',
      description: 'Develop habitat technology for colonists',
      unlocksBuildings: ['habitat'],
      unlocksUpgrades: ['clickEfficiency'],
      unlocksTech: ['manualLabor'],
      requires: ['basicResearch']
    },
    manualLabor: { 
      unlocked: false, 
      cost: { research: 200, population: 5 }, 
      name: 'Manual Labor',
      description: 'Train colonists for factory work',
      unlocksBuildings: ['factory'],
      unlocksUpgrades: ['researchEfficiency', 'populationGrowth'],
      unlocksTech: ['advancedEnergy', 'deepDrilling'],
      requires: ['advancedHousing']
    },
    advancedEnergy: { 
      unlocked: false, 
      cost: { research: 350, components: 15 }, 
      name: 'Advanced Energy',
      description: 'Develop high-efficiency solar technology',
      unlocksBuildings: ['advancedSolarArray'],
      unlocksUpgrades: ['componentProduction'],
      unlocksTech: [],
      requires: ['manualLabor']
    },
    deepDrilling: { 
      unlocked: false, 
      cost: { research: 350, components: 15 }, 
      name: 'Deep Drilling',
      description: 'Access deep mineral deposits',
      unlocksBuildings: ['deepDrillingSite'],
      unlocksUpgrades: [],
      unlocksTech: [],
      requires: ['manualLabor']
    },
    efficientTrading: { 
      unlocked: false, 
      cost: { research: 200, components: 10 }, 
      name: 'Efficient Trading',
      description: 'Improve resource conversion efficiency by 10%',
      unlocksBuildings: [],
      unlocksUpgrades: [],
      unlocksTech: ['advancedTrading'],
      requires: ['basicResearch']
    },
    advancedTrading: { 
      unlocked: false, 
      cost: { research: 400, components: 25 }, 
      name: 'Advanced Trading',
      description: 'Further improve resource conversion efficiency by 10%',
      unlocksBuildings: [],
      unlocksUpgrades: [],
      unlocksTech: [],
      requires: ['efficientTrading']
    }
  },
  events: {
    active: null,
    cooldown: 0,
    history: []
  },
  achievements: {
    firstClick: { unlocked: false, name: 'First Click', description: 'Click on a resource for the first time' },
    tenClicks: { unlocked: false, name: 'Getting Started', description: 'Click resources 10 times' },
    hundredClicks: { unlocked: false, name: 'Manual Laborer', description: 'Click resources 100 times' },
    firstBuilding: { unlocked: false, name: 'Breaking Ground', description: 'Build your first structure' },
    tenBuildings: { unlocked: false, name: 'Urban Planner', description: 'Build 10 structures' },
    firstUpgrade: { unlocked: false, name: 'Innovator', description: 'Purchase your first upgrade' },
    firstTech: { unlocked: false, name: 'Researcher', description: 'Research your first technology' },
    firstPopulation: { unlocked: false, name: 'Welcome Aboard', description: 'Get your first colonist' },
    tenPopulation: { unlocked: false, name: 'Small Community', description: 'Reach 10 population' }
  },
  stats: {
    lastUpdate: Date.now(),
    totalClicks: 0,
    buildingsConstructed: 0,
    upgradesPurchased: 0,
    techResearched: 0,
    colonyAge: 0, // in seconds
    eventsSurvived: 0,
    prestigeCount: 0
  },
  settings: {
    gameSpeed: 1, // For development/testing
    notifications: true,
    autoSaveInterval: 30, // seconds
    lastSave: Date.now()
  },
  prestige: {
    availablePoints: 0,
    totalEarned: 0,
    multipliers: {
      productionSpeed: 1,
      clickValue: 1,
      buildingCost: 1,
      researchSpeed: 1
    }
  },
  tutorial: {
    step: 0,
    completed: false,
    steps: [
      { id: 'welcome', completed: false, text: 'Welcome to Resource Colony! Click resources to collect them.' },
      { id: 'building', completed: false, text: 'Great! Now build your first structure to automate resource collection.' },
      { id: 'upgrade', completed: false, text: 'Purchase an upgrade to improve your production efficiency.' },
      { id: 'research', completed: false, text: 'Research new technologies to unlock advanced buildings and upgrades.' }
    ]
  }
};

// Helper function to calculate current costs based on count
export const calculateCost = (base, count) => {
  const result = {};
  Object.keys(base).forEach(resource => {
    result[resource] = Math.floor(base[resource] * Math.pow(1.15, count));
  });
  return result;
};

// Helper to calculate production rates
// Add this to the start of your calculateProductionRates function in gameSlice.js
// to ensure it's more resilient to errors

export const calculateProductionRates = (state) => {
    // Initialize with default rates of 0 for all resource types
    const rates = { 
      energy: 0, 
      minerals: 0, 
      food: 0, 
      water: 0, 
      research: 0, 
      population: 0, 
      components: 0 
    };
    
    // Guard clauses to prevent errors
    if (!state || !state.buildings) return rates;
    
    // Calculate base rates from buildings
    Object.entries(state.buildings).forEach(([buildingKey, building]) => {
      if (building && building.count > 0 && building.baseOutput && isUnlocked(building)) {
        Object.entries(building.baseOutput).forEach(([resource, amount]) => {
          if (rates[resource] !== undefined) {
            rates[resource] += safeNumber(amount * building.count);
          }
        });
      }
    });
    
    // Guard clause for upgrades
    if (!state.upgrades) return rates;
    
    // Apply upgrade effects (with safeguards)
    if (rates.energy > 0 && state.upgrades.energyEfficiency && state.upgrades.energyEfficiency.effect) {
      rates.energy *= Math.pow(state.upgrades.energyEfficiency.effect, state.upgrades.energyEfficiency.level || 0);
    }
    if (rates.minerals > 0 && state.upgrades.advancedMining && state.upgrades.advancedMining.effect) {
      rates.minerals *= Math.pow(state.upgrades.advancedMining.effect, state.upgrades.advancedMining.level || 0);
    }
    if (rates.food > 0 && state.upgrades.hydroponics && state.upgrades.hydroponics.effect) {
      rates.food *= Math.pow(state.upgrades.hydroponics.effect, state.upgrades.hydroponics.level || 0);
    }
    if (rates.water > 0 && state.upgrades.waterRecycling && state.upgrades.waterRecycling.effect) {
      rates.water *= Math.pow(state.upgrades.waterRecycling.effect, state.upgrades.waterRecycling.level || 0);
    }
    
    // Apply advanced upgrade effects (with safeguards)
    if (rates.research > 0 && state.upgrades.researchEfficiency && 
        state.upgrades.researchEfficiency.unlocked && state.upgrades.researchEfficiency.effect) {
      rates.research *= Math.pow(state.upgrades.researchEfficiency.effect, state.upgrades.researchEfficiency.level || 0);
    }
    if (rates.population > 0 && state.upgrades.populationGrowth && 
        state.upgrades.populationGrowth.unlocked && state.upgrades.populationGrowth.effect) {
      rates.population *= Math.pow(state.upgrades.populationGrowth.effect, state.upgrades.populationGrowth.level || 0);
    }
    if (rates.components > 0 && state.upgrades.componentProduction && 
        state.upgrades.componentProduction.unlocked && state.upgrades.componentProduction.effect) {
      rates.components *= Math.pow(state.upgrades.componentProduction.effect, state.upgrades.componentProduction.level || 0);
    }
    
    // Guard clause for prestige
    if (!state.prestige || !state.prestige.multipliers) return rates;
    
    // Apply prestige multipliers
    Object.keys(rates).forEach(resource => {
      if (rates[resource] > 0 && state.prestige.multipliers.productionSpeed) {
        rates[resource] *= state.prestige.multipliers.productionSpeed;
      }
    });
    
    // Guard clause for events
    if (!state.events || !state.events.active) return rates;
    
    // Apply active event effects
    const event = state.events.active;
    if (event && event.effects && event.effects.productionMultipliers) {
      Object.entries(event.effects.productionMultipliers).forEach(([resource, multiplier]) => {
        if (rates[resource] !== undefined) {
          rates[resource] *= multiplier;
        }
      });
    }
    
    return rates;
  };

// Calculate click value based on upgrades and prestige
export const calculateClickValue = (state, resource) => {
  let value = 1;
  
  // Apply click efficiency upgrade if unlocked
  if (state.upgrades.clickEfficiency.unlocked) {
    value *= Math.pow(state.upgrades.clickEfficiency.effect, state.upgrades.clickEfficiency.level);
  }
  
  // Apply prestige multiplier
  value *= state.prestige.multipliers.clickValue;
  
  // Apply active event effects
  if (state.events.active && state.events.active.effects && state.events.active.effects.clickMultiplier) {
    value *= state.events.active.effects.clickMultiplier;
  }
  
  return value;
};

// Check if a technology can be researched
export const canResearchTech = (state, techId) => {
  // Debug logging for research availability checks
  console.log(`Checking research for ${techId}`);
  
  if (!state || !state.tech || !techId || !state.tech[techId]) {
    console.log(`Invalid tech state or tech ID: ${techId}`);
    return false;
  }
  
  const tech = state.tech[techId];
  
  // Check if already unlocked
  if (tech.unlocked === true) {
    console.log(`Tech ${techId} is already unlocked`);
    return false;
  }
  
  // Special case for basicResearch which has no prerequisites
  if (techId === 'basicResearch') {
    // Just check if we have enough research points
    const hasEnoughResearch = state.resources && 
                            state.resources.research >= tech.cost.research;
    console.log(`BasicResearch special check: ${hasEnoughResearch ? 'AVAILABLE' : 'NOT AVAILABLE'}`);
    console.log(`Research available: ${state.resources?.research || 0}, Cost: ${tech.cost.research}`);
    return hasEnoughResearch;
  }
  
  // Check if all prerequisites are met
  const prereqsMet = tech.requires.every(reqTechId => {
    const reqTech = state.tech[reqTechId];
    const isPrereqMet = reqTech && reqTech.unlocked === true;
    console.log(`Prerequisite ${reqTechId} for ${techId}: ${isPrereqMet ? 'MET' : 'NOT MET'}`);
    return isPrereqMet;
  });
  
  if (!prereqsMet) {
    console.log(`Prerequisites not met for ${techId}`);
    return false;
  }
  
  // Check if player has enough resources
  if (!state.resources) {
    console.log(`No resources state found for tech ${techId}`);
    return false;
  }
  
  let canAfford = true;
  Object.entries(tech.cost).forEach(([resource, amount]) => {
    const hasResource = state.resources[resource] !== undefined && state.resources[resource] >= amount;
    console.log(`Resource check for ${techId}: ${resource} ${state.resources[resource] || 0}/${amount} - ${hasResource ? 'AVAILABLE' : 'NOT AVAILABLE'}`);
    if (!hasResource) {
      canAfford = false;
    }
  });
  
  return canAfford;
};

// Calculate population growth rate
export const calculatePopulationGrowth = (state) => {
  // No growth without habitats
  if (!state.buildings.habitat || state.buildings.habitat.count === 0) return 0;
  
  // Current population
  const population = safeNumber(state.resources.population, 0);
  
  // Maximum population based on habitat count (5 per habitat)
  const maxPopulation = state.buildings.habitat.count * 5;
  
  // No growth beyond maximum
  if (population >= maxPopulation) return 0;
  
  // Check for food and water production
  const hasFarm = state.buildings.farm && state.buildings.farm.count > 0;
  const hasWaterExtractor = state.buildings.waterExtractor && state.buildings.waterExtractor.count > 0;
  
  // Need both food and water for any growth
  if (!hasFarm || !hasWaterExtractor) return 0;
  
  // Base growth rate (0.02 colonists per second)
  let growthRate = 0.02;
  
  // Apply food and water availability modifiers
  const foodPerCapita = safeNumber(state.resources.food / Math.max(population, 1), 0);
  const waterPerCapita = safeNumber(state.resources.water / Math.max(population, 1), 0);
  
  // Scale growth with resource availability (cap at 3x bonus)
  const foodModifier = Math.min(1 + foodPerCapita / 20, 3);
  const waterModifier = Math.min(1 + waterPerCapita / 20, 3);
  
  growthRate *= foodModifier * waterModifier;
  
  // Apply population growth upgrade if present
  if (state.upgrades.populationGrowth && 
      state.upgrades.populationGrowth.unlocked && 
      state.upgrades.populationGrowth.level > 0) {
    growthRate *= Math.pow(state.upgrades.populationGrowth.effect, 
                          state.upgrades.populationGrowth.level);
  }
  
  // Apply prestige multiplier if exists
  if (state.prestige && state.prestige.multipliers && 
      state.prestige.multipliers.productionSpeed) {
    growthRate *= state.prestige.multipliers.productionSpeed;
  }
  
  return growthRate;
};

// Generate a random event
export const generateRandomEvent = () => {
  const events = [
    {
      id: 'solarFlare',
      name: 'Solar Flare',
      description: 'A solar flare has disrupted your energy systems!',
      duration: 60, // seconds
      effects: {
        productionMultipliers: { energy: 0.5 }
      }
    },
    {
      id: 'mineralDeposit',
      name: 'Rich Mineral Deposit',
      description: 'Your miners have discovered a rich vein of minerals!',
      duration: 60,
      effects: {
        productionMultipliers: { minerals: 2.0 }
      }
    },
    {
      id: 'waterLeak',
      name: 'Water System Leak',
      description: 'There\'s a leak in your water recycling system!',
      duration: 45,
      effects: {
        productionMultipliers: { water: 0.7 }
      }
    },
    {
      id: 'researchBreakthrough',
      name: 'Research Breakthrough',
      description: 'Your scientists have made a breakthrough!',
      duration: 45,
      effects: {
        productionMultipliers: { research: 2.0 }
      }
    },
    {
      id: 'clickFrenzy',
      name: 'Click Frenzy',
      description: 'Your manual collection efficiency has temporarily increased!',
      duration: 30,
      effects: {
        clickMultiplier: 3.0
      }
    }
  ];
  
  // Select a random event
  const randomIndex = Math.floor(Math.random() * events.length);
  return { ...events[randomIndex], startTime: Date.now() };
};

// Check if technology unlocks are available
export const checkTechUnlocks = (state, techId) => {
  const tech = state.tech[techId];
  const updates = { buildings: {}, upgrades: {}, tech: {} };
  
  if (!tech || !tech.unlocksBuildings || !tech.unlocksUpgrades || !tech.unlocksTech) {
    console.warn(`Invalid tech object for ${techId}`);
    return updates;
  }
  
  // Unlock buildings
  tech.unlocksBuildings.forEach(buildingId => {
    if (state.buildings[buildingId]) {
      updates.buildings[buildingId] = true;
    } else {
      console.warn(`Building ${buildingId} not found but listed in unlocks for ${techId}`);
    }
  });
  
  // Unlock upgrades
  tech.unlocksUpgrades.forEach(upgradeId => {
    if (state.upgrades[upgradeId]) {
      updates.upgrades[upgradeId] = true;
    } else {
      console.warn(`Upgrade ${upgradeId} not found but listed in unlocks for ${techId}`);
    }
  });
  
  // Unlock dependent tech
  tech.unlocksTech.forEach(dependentTechId => {
    if (state.tech[dependentTechId]) {
      const allReqsMet = state.tech[dependentTechId].requires.every(req => 
        req === techId || state.tech[req]?.unlocked === true
      );
      
      if (allReqsMet) {
        updates.tech[dependentTechId] = true;
      }
    } else {
      console.warn(`Tech ${dependentTechId} not found but listed in unlocks for ${techId}`);
    }
  });
  
  return updates;
};

// Check achievements
export const checkAchievements = (state) => {
  const updates = {};
  
  // Check click-based achievements
  if (state.achievements.firstClick && !isUnlocked(state.achievements.firstClick) && state.stats.totalClicks >= 1) {
    updates.firstClick = true;
  }
  if (state.achievements.tenClicks && !isUnlocked(state.achievements.tenClicks) && state.stats.totalClicks >= 10) {
    updates.tenClicks = true;
  }
  if (state.achievements.hundredClicks && !isUnlocked(state.achievements.hundredClicks) && state.stats.totalClicks >= 100) {
    updates.hundredClicks = true;
  }
  
  // Check building-based achievements
  if (state.achievements.firstBuilding && !isUnlocked(state.achievements.firstBuilding) && state.stats.buildingsConstructed >= 1) {
    updates.firstBuilding = true;
  }
  if (state.achievements.tenBuildings && !isUnlocked(state.achievements.tenBuildings) && state.stats.buildingsConstructed >= 10) {
    updates.tenBuildings = true;
  }
  
  // Check upgrade achievement
  if (state.achievements.firstUpgrade && !isUnlocked(state.achievements.firstUpgrade) && state.stats.upgradesPurchased >= 1) {
    updates.firstUpgrade = true;
  }
  
  // Check tech achievement
  if (state.achievements.firstTech && !isUnlocked(state.achievements.firstTech) && state.stats.techResearched >= 1) {
    updates.firstTech = true;
  }
  
  // Check population achievements
  if (state.achievements.firstPopulation && !isUnlocked(state.achievements.firstPopulation) && safeNumber(state.resources.population) >= 1) {
    updates.firstPopulation = true;
  }
  if (state.achievements.tenPopulation && !isUnlocked(state.achievements.tenPopulation) && safeNumber(state.resources.population) >= 10) {
    updates.tenPopulation = true;
  }
  
  return updates;
};

// Calculate prestige points
export const calculatePrestigePoints = (state) => {
  if (!state || !state.resources || !state.buildings) return 0;
  
  // A simple formula based on total resources and buildings
  let totalResources = 0;
  Object.values(state.resources).forEach(amount => {
    if (!isNaN(amount)) {
      totalResources += safeNumber(amount, 0);
    }
  });
  
  let totalBuildings = 0;
  Object.values(state.buildings).forEach(building => {
    if (building && !isNaN(building.count)) {
      totalBuildings += safeNumber(building.count, 0);
    }
  });
  
  // Ensure we don't return NaN
  const result = Math.floor(Math.sqrt(totalResources) + (totalBuildings * 2));
  return isNaN(result) ? 0 : result;
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    // Manual resource collection (clicking)
    collectResource: (state, action) => {
      const { resource } = action.payload;
      const clickValue = calculateClickValue(state, resource);
      state.resources[resource] += clickValue;
      state.stats.totalClicks += 1;
      
      // Check for click-related achievements
      const achievementUpdates = checkAchievements(state);
      Object.entries(achievementUpdates).forEach(([achievementId, shouldUnlock]) => {
        if (shouldUnlock && state.achievements[achievementId]) {
          state.achievements[achievementId].unlocked = true;
        }
      });
      
      // Handle tutorial progression
      if (!state.tutorial.completed && !state.tutorial.steps[0].completed) {
        state.tutorial.steps[0].completed = true;
        state.tutorial.step = 1;
      }
    },
    
    // Purchase a building
    purchaseBuilding: (state, action) => {
      const { buildingType } = action.payload;
      const building = state.buildings[buildingType];
      
      // Verify the building is unlocked
      if (!isUnlocked(building)) return;
      
      const cost = calculateCost(building.baseCost, building.count);
      
      // Apply prestige cost reduction if available
      if (state.prestige.multipliers.buildingCost !== 1) {
        Object.keys(cost).forEach(resource => {
          cost[resource] = Math.floor(cost[resource] * state.prestige.multipliers.buildingCost);
        });
      }
      
      // Check if player has enough resources
      let canAfford = true;
      Object.entries(cost).forEach(([resource, amount]) => {
        if (state.resources[resource] < amount) {
          canAfford = false;
        }
      });
      
      if (canAfford) {
        // Deduct resources
        Object.entries(cost).forEach(([resource, amount]) => {
          state.resources[resource] -= amount;
        });
        
        // Add building
        building.count += 1;
        state.stats.buildingsConstructed += 1;
        
        // Check for building-related achievements
        const achievementUpdates = checkAchievements(state);
        Object.entries(achievementUpdates).forEach(([achievementId, shouldUnlock]) => {
          if (shouldUnlock && state.achievements[achievementId]) {
            state.achievements[achievementId].unlocked = true;
          }
        });
        
        // Handle tutorial progression
        if (!state.tutorial.completed && !state.tutorial.steps[1].completed && state.stats.buildingsConstructed >= 1) {
          state.tutorial.steps[1].completed = true;
          state.tutorial.step = 2;
        }
      }
    },
    
    // Purchase an upgrade
    purchaseUpgrade: (state, action) => {
      const { upgradeType } = action.payload;
      const upgrade = state.upgrades[upgradeType];
      
      // Verify the upgrade is unlocked
      if (!isUnlocked(upgrade)) return;
      
      const cost = calculateCost(upgrade.baseCost, upgrade.level);
      
      // Check if player has enough resources
      let canAfford = true;
      Object.entries(cost).forEach(([resource, amount]) => {
        if (state.resources[resource] < amount) {
          canAfford = false;
        }
      });
      
      if (canAfford) {
        // Deduct resources
        Object.entries(cost).forEach(([resource, amount]) => {
          state.resources[resource] -= amount;
        });
        
        // Apply upgrade
        upgrade.level += 1;
        state.stats.upgradesPurchased += 1;
        
        // Check for upgrade-related achievements
        const achievementUpdates = checkAchievements(state);
        Object.entries(achievementUpdates).forEach(([achievementId, shouldUnlock]) => {
          if (shouldUnlock && state.achievements[achievementId]) {
            state.achievements[achievementId].unlocked = true;
          }
        });
        
        // Handle tutorial progression
        if (!state.tutorial.completed && !state.tutorial.steps[2].completed && state.stats.upgradesPurchased >= 1) {
          state.tutorial.steps[2].completed = true;
          state.tutorial.step = 3;
        }
      }
    },
    
    // Research a technology
    researchTech: (state, action) => {
      const { techId } = action.payload;
      console.log(`Attempting to research: ${techId}`);
      
      // Check if research is possible
      if (!canResearchTech(state, techId)) {
        console.log(`Cannot research ${techId} - requirements not met`);
        return;
      }
      
      const tech = state.tech[techId];
      console.log(`Researching ${techId}: ${tech.name}`);
      console.log(`Tech details:`, JSON.stringify(tech));
      console.log(`Research points available: ${state.resources.research}`);
      
      // Additional check for basicResearch
      if (techId === 'basicResearch') {
        const canAffordResearch = state.resources.research >= tech.cost.research;
        console.log(`Can afford basicResearch? ${canAffordResearch}`);
      }
      
      // Deduct resources
      Object.entries(tech.cost).forEach(([resource, amount]) => {
        state.resources[resource] -= amount;
        console.log(`Deducted ${amount} ${resource}`);
      });
      
      // Unlock the technology
      tech.unlocked = true;
      state.stats.techResearched += 1;
      console.log(`Technology ${techId} unlocked!`);
      
      // Directly unlock the buildings and upgrades specified in the tech
      // Since checkTechUnlocks might be failing
      tech.unlocksBuildings.forEach(buildingId => {
        if (state.buildings[buildingId]) {
          state.buildings[buildingId].unlocked = true;
          console.log(`Building directly unlocked: ${buildingId} - ${state.buildings[buildingId].name}`);
        } else {
          console.warn(`Building ${buildingId} not found but listed in unlocks for ${techId}`);
        }
      });
      
      tech.unlocksUpgrades.forEach(upgradeId => {
        if (state.upgrades[upgradeId]) {
          state.upgrades[upgradeId].unlocked = true;
          console.log(`Upgrade directly unlocked: ${upgradeId} - ${state.upgrades[upgradeId].name}`);
        } else {
          console.warn(`Upgrade ${upgradeId} not found but listed in unlocks for ${techId}`);
        }
      });
      
      // Also try using the checkTechUnlocks function for completeness
      const unlocks = checkTechUnlocks(state, techId);
      console.log('Tech unlocks computed:', unlocks);
      
      // Unlock buildings through the check function as well
      Object.entries(unlocks.buildings).forEach(([buildingId, shouldUnlock]) => {
        if (shouldUnlock && state.buildings[buildingId]) {
          state.buildings[buildingId].unlocked = true;
          console.log(`Building unlocked via checkTechUnlocks: ${buildingId} - ${state.buildings[buildingId].name}`);
        }
      });
      
      // Unlock upgrades through the check function as well
      Object.entries(unlocks.upgrades).forEach(([upgradeId, shouldUnlock]) => {
        if (shouldUnlock && state.upgrades[upgradeId]) {
          state.upgrades[upgradeId].unlocked = true;
          console.log(`Upgrade unlocked via checkTechUnlocks: ${upgradeId} - ${state.upgrades[upgradeId].name}`);
        }
      });
      
      // Update tech dependencies
      tech.unlocksTech.forEach(dependentTechId => {
        if (state.tech[dependentTechId]) {
          // Just mark as available, don't fully unlock
          state.tech[dependentTechId].available = true;
          console.log(`Tech directly available: ${dependentTechId} - ${state.tech[dependentTechId].name}`);
        } else {
          console.warn(`Tech ${dependentTechId} not found but listed in unlocks for ${techId}`);
        }
      });
      
      // Also try the object entries approach for completeness
      Object.entries(unlocks.tech).forEach(([dependentTechId, shouldUnlock]) => {
        // Just mark as available, don't fully unlock
        if (shouldUnlock && state.tech[dependentTechId]) {
          state.tech[dependentTechId].available = true;
          console.log(`Tech available via checkTechUnlocks: ${dependentTechId} - ${state.tech[dependentTechId].name}`);
        }
      });
      
      // Check for tech-related achievements
      const achievementUpdates = checkAchievements(state);
      Object.entries(achievementUpdates).forEach(([achievementId, shouldUnlock]) => {
        if (shouldUnlock && state.achievements[achievementId]) {
          state.achievements[achievementId].unlocked = true;
        }
      });
      
      // Handle tutorial progression
      if (!state.tutorial.completed && !state.tutorial.steps[3].completed && state.stats.techResearched >= 1) {
        state.tutorial.steps[3].completed = true;
        state.tutorial.completed = true;
      }
    },
    
    // Start a new random event
    startEvent: (state) => {
      if (state.events.active || state.events.cooldown > 0) return;
      
      const newEvent = generateRandomEvent();
      state.events.active = newEvent;
    },
    
    // Resolve an active event
    resolveEvent: (state) => {
      if (!state.events.active) return;
      
      // Add to history
      state.events.history.push(state.events.active);
      
      // Clear active event
      state.events.active = null;
      
      // Set cooldown
      state.events.cooldown = 120; // 2 minutes cooldown
      
      // Update stats
      state.stats.eventsSurvived += 1;
    },
    
    // Prestige the game (reset with bonuses)
    prestige: (state) => {
      // Calculate prestige points
      const newPoints = calculatePrestigePoints(state);
      
      // Save some stats for the new game
      const oldPrestige = {
        totalEarned: state.prestige.totalEarned + newPoints,
        availablePoints: state.prestige.availablePoints + newPoints,
        multipliers: state.prestige.multipliers,
        prestigeCount: state.stats.prestigeCount + 1
      };
      
      // Reset the game
      Object.assign(state, JSON.parse(JSON.stringify(initialState)));
      
      // Restore prestige info
      state.prestige.totalEarned = oldPrestige.totalEarned;
      state.prestige.availablePoints = oldPrestige.availablePoints;
      state.prestige.multipliers = oldPrestige.multipliers;
      state.stats.prestigeCount = oldPrestige.prestigeCount;
    },
    
    // Spend prestige points on multipliers
    spendPrestigePoints: (state, action) => {
      const { multiplier, amount } = action.payload;
      
      // Check if player has enough points
      if (state.prestige.availablePoints < amount) return;
      
      // Apply the multiplier
      const multiplierKey = multiplier; // e.g., 'productionSpeed'
      
      // Different multipliers have different rates
      const rates = {
        productionSpeed: 0.1, // +10% per point
        clickValue: 0.2,      // +20% per point
        buildingCost: -0.05,  // -5% per point (cost reduction)
        researchSpeed: 0.1    // +10% per point
      };
      
      // Special case for building cost (it's a reduction)
      if (multiplierKey === 'buildingCost') {
        state.prestige.multipliers[multiplierKey] = Math.max(
          0.5, // minimum 50% of original cost
          state.prestige.multipliers[multiplierKey] + (rates[multiplierKey] * amount)
        );
      } else {
        state.prestige.multipliers[multiplierKey] += rates[multiplierKey] * amount;
      }
      
      // Deduct points
      state.prestige.availablePoints -= amount;
    },
    
    // Update game state based on elapsed time
    updateGameState: (state) => {
      const now = Date.now();
      const elapsedMs = now - state.stats.lastUpdate;
      const elapsedSeconds = elapsedMs / 1000;
      
      // Update colony age
      state.stats.colonyAge += elapsedSeconds;
      
      // Calculate production per second
      const rates = calculateProductionRates(state);
      
      // Calculate population growth
      const populationGrowthRate = calculatePopulationGrowth(state);
      
      // Add resources based on elapsed time and production rates
      Object.entries(rates).forEach(([resource, amountPerSecond]) => {
        state.resources[resource] += amountPerSecond * elapsedSeconds * state.settings.gameSpeed;
      });
      
      // Apply population growth separately
      if (populationGrowthRate > 0) {
        // Check if we have enough food and water to support population growth
        if (state.resources.food > 0 && state.resources.water > 0) {
          // Consume food and water based on population
          const currentPopulation = safeNumber(state.resources.population, 0);
          const foodConsumption = Math.min(currentPopulation * 0.01 * elapsedSeconds, state.resources.food);
          const waterConsumption = Math.min(currentPopulation * 0.01 * elapsedSeconds, state.resources.water);
          
          // Deduct consumed resources
          state.resources.food -= foodConsumption;
          state.resources.water -= waterConsumption;
          
          // Grow population
          state.resources.population += populationGrowthRate * elapsedSeconds * state.settings.gameSpeed;
          
          // Cap population at maximum
          const maxPopulation = state.buildings.habitat.count * 5;
          state.resources.population = Math.min(state.resources.population, maxPopulation);
        }
      }
      
      // Handle events
      if (state.events.active) {
        const event = state.events.active;
        const eventElapsedSeconds = (now - event.startTime) / 1000;
        
        // Check if event has ended
        if (eventElapsedSeconds >= event.duration) {
          // Auto-resolve the event
          state.events.history.push(event);
          state.events.active = null;
          state.events.cooldown = 120; // 2 minutes cooldown
          state.stats.eventsSurvived += 1;
        }
      } else if (state.events.cooldown > 0) {
        // Decrease the cooldown
        state.events.cooldown = Math.max(0, state.events.cooldown - elapsedSeconds);
        
        // Randomly trigger a new event if cooldown is over
        if (state.events.cooldown === 0 && Math.random() < 0.1) { // 10% chance each tick when cooldown is over
          state.events.active = generateRandomEvent();
        }
      }
      
      // Check for auto-save
      if ((now - state.settings.lastSave) / 1000 >= state.settings.autoSaveInterval) {
        state.settings.lastSave = now;
        // The actual save happens in the App component
      }
      
      // Check achievements based on current state
      const achievementUpdates = checkAchievements(state);
      Object.entries(achievementUpdates).forEach(([achievementId, unlocked]) => {
        if (unlocked) {
          state.achievements[achievementId].unlocked = true;
        }
      });
      
      // Update last update time
      state.stats.lastUpdate = now;
    },
    
    // Toggle settings
    toggleSetting: (state, action) => {
      const { setting } = action.payload;
      state.settings[setting] = !state.settings[setting];
    },
    
    // Set a specific setting value
    setSetting: (state, action) => {
      const { setting, value } = action.payload;
      state.settings[setting] = value;
    },
    
    // Advance the tutorial
    advanceTutorial: (state) => {
      if (state.tutorial.completed) return;
      
      // Mark current step complete
      if (state.tutorial.step < state.tutorial.steps.length) {
        state.tutorial.steps[state.tutorial.step].completed = true;
        
        // Move to next step or complete tutorial
        if (state.tutorial.step < state.tutorial.steps.length - 1) {
          state.tutorial.step += 1;
        } else {
          state.tutorial.completed = true;
        }
      }
    },
    
    // Reset tutorial
    resetTutorial: (state) => {
      state.tutorial = {
        step: 0,
        completed: false,
        steps: state.tutorial.steps.map(step => ({ ...step, completed: false }))
      };
    },
    
    // Load game state from localStorage
    loadGame: (state, action) => {
      // Deep merge to handle potential missing fields in saved data
      const savedGame = action.payload;
      
      // Update basic properties while preserving the structure
      Object.keys(savedGame).forEach(key => {
        if (key !== 'stats') {
          state[key] = savedGame[key];
        }
      });
      
      // Special handling for stats to ensure we don't lose the lastUpdate
      if (savedGame.stats) {
        Object.keys(savedGame.stats).forEach(statKey => {
          if (statKey !== 'lastUpdate') {
            state.stats[statKey] = savedGame.stats[statKey];
          }
        });
      }
      
      // Always update the lastUpdate to current time
      state.stats.lastUpdate = Date.now();
      state.settings.lastSave = Date.now();
    },
    
    // Reset game (without prestige)
    resetGame: (state) => {
      Object.assign(state, JSON.parse(JSON.stringify(initialState)));
    },
    
    // Trade resources
    tradeResources: (state, action) => {
      const { fromResource, toResource, fromAmount, toAmount } = action.payload;
      
      // Validate resources exist
      if (!state.resources[fromResource] || !state.resources[toResource]) return;
      
      // Validate we have enough of the source resource
      if (state.resources[fromResource] < fromAmount) return;
      
      // Execute the trade
      state.resources[fromResource] -= fromAmount;
      state.resources[toResource] += parseFloat(toAmount);
      
      // Log the trade in stats (if we want to track this)
      if (!state.stats.resourcesTraded) {
        state.stats.resourcesTraded = {};
      }
      
      if (!state.stats.resourcesTraded[fromResource]) {
        state.stats.resourcesTraded[fromResource] = 0;
      }
      
      state.stats.resourcesTraded[fromResource] += fromAmount;
    }
  },
});

export const { 
  collectResource, 
  purchaseBuilding, 
  purchaseUpgrade, 
  researchTech,
  startEvent,
  resolveEvent,
  prestige,
  spendPrestigePoints,
  updateGameState, 
  toggleSetting,
  setSetting,
  advanceTutorial,
  resetTutorial,
  loadGame,
  resetGame,
  tradeResources
} = gameSlice.actions;

export default gameSlice.reducer;