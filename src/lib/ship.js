import Product from './product.js';
import Inventory from './inventory.js';

const IDS = {
  ESCAPE_MODULE: 1,
  LIGHT_TRANSPORT: 2,
  HEAVY_TRANSPORT: 3,
  SHUTTLE: 4
};

const STATUSES = {
  UNDER_CONSTRUCTION: 0,
  AVAILABLE: 1,
  // IN_FLIGHT: 2, (deprecated)
  DISABLED: 3
};

const VARIANTS = {
  STANDARD: 1,
  COBALT_PIONEER: 2,
  TITANIUM_PIONEER: 3,
  AUREATE_PIONEER: 4
};

// exhaustVelocity is in m/s
const TYPES = {
  [IDS.ESCAPE_MODULE]: {
    i: IDS.ESCAPE_MODULE,
    name: 'Escape Module',
    landing: false,
    docking: false,
    propellantSlot: 1,
    propellantInventoryType: Inventory.IDS.PROPELLANT_TINY,
    exhaustVelocity: 30000,
    hullMass: 5000000
  },
  [IDS.SHUTTLE]: {
    i: IDS.SHUTTLE,
    name: 'Shuttle',
    landing: false,
    docking: true,
    propellantSlot: 1,
    propellantInventoryType: Inventory.IDS.PROPELLANT_SMALL,
    cargoSlot: 2,
    cargoInventoryType: Inventory.IDS.CARGO_SMALL,
    exhaustVelocity: 30000,
    hullMass: 100755000
  },
  [IDS.LIGHT_TRANSPORT]: {
    i: IDS.LIGHT_TRANSPORT,
    name: 'Light Transport',
    landing: true,
    docking: true,
    propellantSlot: 1,
    propellantInventoryType: Inventory.IDS.PROPELLANT_MEDIUM,
    cargoSlot: 2,
    cargoInventoryType: Inventory.IDS.CARGO_MEDIUM,
    exhaustVelocity: 30000,
    hullMass: 185525000
  },
  [IDS.HEAVY_TRANSPORT]: {
    i: IDS.HEAVY_TRANSPORT,
    name: 'Heavy Transport',
    landing: false,
    docking: true,
    propellantSlot: 1,
    propellantInventoryType: Inventory.IDS.PROPELLANT_LARGE,
    cargoSlot: 2,
    cargoInventoryType: Inventory.IDS.CARGO_LARGE,
    exhaustVelocity: 30000,
    hullMass: 969525000
  }
};

const VARIANT_TYPES = {
  [VARIANTS.STANDARD]: { name: 'Standard' },
  [VARIANTS.COBALT_PIONEER]: { name: 'Cobalt Pioneer' },
  [VARIANTS.TITANIUM_PIONEER]: { name: 'Titanium Pioneer' },
  [VARIANTS.AUREATE_PIONEER]: { name: 'Aureate Pioneer' }
};

// setupTime and constructionTime is in in-game seconds
const CONSTRUCTION_TYPES = {
  [IDS.SHUTTLE]: {
    setupTime: 1658880,
    constructionTime: 414720,
    requirements: {
      [Product.IDS.SHUTTLE_HULL]: 1,
      [Product.IDS.AVIONICS_MODULE]: 1,
      [Product.IDS.ESCAPE_MODULE]: 3,
      [Product.IDS.ATTITUDE_CONTROL_MODULE]: 1,
      [Product.IDS.POWER_MODULE]: 1,
      [Product.IDS.THERMAL_MODULE]: 1,
      [Product.IDS.PROPULSION_MODULE]: 1
    }
  },
  [IDS.LIGHT_TRANSPORT]: {
    setupTime: 2211840,
    constructionTime: 552960,
    requirements: {
      [Product.IDS.CARGO_MODULE]: 6,
      [Product.IDS.LIGHT_TRANSPORT_HULL]: 1,
      [Product.IDS.TERRAIN_INTERFACE_MODULE]: 4,
      [Product.IDS.AVIONICS_MODULE]: 1,
      [Product.IDS.ESCAPE_MODULE]: 1,
      [Product.IDS.ATTITUDE_CONTROL_MODULE]: 2,
      [Product.IDS.POWER_MODULE]: 2,
      [Product.IDS.THERMAL_MODULE]: 1,
      [Product.IDS.PROPULSION_MODULE]: 2
    }
  },
  [IDS.HEAVY_TRANSPORT]: {
    setupTime: 5529600,
    constructionTime: 1382400,
    requirements: {
      [Product.IDS.CARGO_MODULE]: 36,
      [Product.IDS.HEAVY_TRANSPORT_HULL]: 1,
      [Product.IDS.AVIONICS_MODULE]: 3,
      [Product.IDS.ESCAPE_MODULE]: 1,
      [Product.IDS.ATTITUDE_CONTROL_MODULE]: 6,
      [Product.IDS.POWER_MODULE]: 3,
      [Product.IDS.THERMAL_MODULE]: 3,
      [Product.IDS.PROPULSION_MODULE]: 9
    }
  }
};

const Entity = {};
const Component = {};

const getConstructionType = (type) => CONSTRUCTION_TYPES[type] ? { ...CONSTRUCTION_TYPES[type] } : null;
Component.getConstructionType = (ship) => getConstructionType(ship.shipType);
Entity.getConstructionType = (entity) => Component.getConstructionType(entity.Ship);

const getType = (type) => TYPES[type] ? { ...TYPES[type] } : null;
Component.getType = (ship) => getType(ship.shipType);
Entity.getType = (entity) => Component.getType(entity.Ship);

const getVariant = (variant) => VARIANT_TYPES[variant] ? { ...VARIANT_TYPES[variant] } : null;
Component.getVariant = (ship) => getVariant(ship.variant);
Entity.getVariant = (entity) => Component.getVariant(entity.Ship);

const getPropellantRequirement = (shipType, wetMass, deltaV_ms, totalBonus = 1) => {
  return wetMass * (1 - 1 / Math.exp(deltaV_ms / TYPES[shipType].exhaustVelocity)) / totalBonus;
};
Entity.getPropellantRequirement = (ship, deltaV_ms, totalBonus = 1) => {
  const shipConfig = TYPES[ship.Ship.shipType] || {};
  const cargoInventory = ship.Inventories.find((inventory) => inventory.slot === shipConfig.cargoSlot);
  const propellantInventory = ship.Inventories.find((inventory) => inventory.slot === shipConfig.propellantSlot);
  return getPropellantRequirement(
    ship.Ship.shipType,
    shipConfig.hullMass + (cargoInventory?.mass || 0) + (propellantInventory?.mass || 0),
    deltaV_ms,
    totalBonus
  );
}

const propellantToDeltaV = (shipType, wetMass, propellantMass, totalBonus = 1) => {
  return TYPES[shipType].exhaustVelocity * Math.log(1 / (1 - propellantMass * totalBonus / wetMass));
};
Entity.propellantToDeltaV = (ship, propellantMass, totalBonus = 1) => {
  const shipConfig = TYPES[ship.Ship.shipType] || {};
  const cargoInventory = ship.Inventories.find((inventory) => inventory.slot === shipConfig.cargoSlot);
  const propellantInventory = ship.Inventories.find((inventory) => inventory.slot === shipConfig.propellantSlot);
  return propellantToDeltaV(
    ship.Ship.shipType,
    shipConfig.hullMass + (cargoInventory?.mass || 0) + (propellantInventory?.mass || 0),
    propellantMass,
    totalBonus
  );
};


// in-game seconds to generate 10% of tank from 0
const EMERGENCY_PROP_GEN_TIME = 10368000;
const EMERGENCY_PROP_LIMIT = 0.1;

const getEmergencyPropellantAmount = (generationTime, inventoryConfig, startingAmount, resourceId = Product.IDS.HYDROGEN_PROPELLANT) => {
  const maxEmergencyPropellantAmount = EMERGENCY_PROP_LIMIT * inventoryConfig.massConstraint / Product.TYPES[resourceId].massPerUnit;
  const generationRate = maxEmergencyPropellantAmount / EMERGENCY_PROP_GEN_TIME;
  const uncappedGenerationAmount = generationRate * generationTime;
  return Math.min(maxEmergencyPropellantAmount, startingAmount + uncappedGenerationAmount);
};

const getTimeUntilEmergencyPropellantFull = (inventoryConfig, startingAmount, resourceId = Product.IDS.HYDROGEN_PROPELLANT) => {
  const maxEmergencyPropellantAmount = EMERGENCY_PROP_LIMIT * inventoryConfig.massConstraint / Product.TYPES[resourceId].massPerUnit;
  const maxAmountCanGenerate = maxEmergencyPropellantAmount - startingAmount;
  const generationRate = maxEmergencyPropellantAmount / EMERGENCY_PROP_GEN_TIME;
  return maxAmountCanGenerate / generationRate;
};

export default {
  CONSTRUCTION_TYPES,
  EMERGENCY_PROP_GEN_TIME,
  EMERGENCY_PROP_LIMIT,
  IDS,
  STATUSES,
  TYPES,

  getConstructionType,
  getEmergencyPropellantAmount,
  getPropellantRequirement,
  getTimeUntilEmergencyPropellantFull,
  getType,
  getVariant,
  propellantToDeltaV,

  Entity,
  Component
};
