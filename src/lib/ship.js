import Inventory from './inventory.js';
import Process from './process.js';
import Product from './product.js';
import Station from './station.js';
import Time from '../utils/Time.js';

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

// in-game seconds to generate emergency prop % of tank from 0
const EMERGENCY_PROP_GEN_TIME = 10368000;

// exhaustVelocity is in m/s
// TODO: ship descriptions would ideally use config values
const TYPES = {
  [IDS.ESCAPE_MODULE]: {
    i: IDS.ESCAPE_MODULE,
    name: 'Escape Module',
    description: `The Escape Module is a tiny craft that serves as a lifeboat for emergencies,
      and as temporary quarters when crews are going about their work off-base. Every crew in
      Adalia has an Escape Module available to them at all times. It can sustain a single crew of up
      to five crewmates in orbit, and is capable of limited travel between asteroids. It can deliver
      its crew to a habitat or ship on the surface, but cannot be used as a base on its own.`,
    docking: false,
    emergencyPropellantCap: 1,
    exhaustVelocity: 30000,
    hullMass: 5000000,
    landing: false,
    propellantInventoryType: Inventory.IDS.PROPELLANT_TINY,
    propellantSlot: 1,
    propellantType: Product.IDS.HYDROGEN_PROPELLANT
  },
  [IDS.SHUTTLE]: {
    i: IDS.SHUTTLE,
    name: 'Shuttle',
    description: `The Shuttle is a lean, light ship with a single engine, optimized for personnel
      transportation. It can carry up to 15 crewmates at once, but also nominally has space for a 
      small 50-tonne cargo. The Shuttle requires a Spaceport to land on an asteroid.`,
    cargoInventoryType: Inventory.IDS.CARGO_SMALL,
    cargoSlot: 2,
    docking: true,
    emergencyPropellantCap: 0.1,
    exhaustVelocity: 30000,
    hullMass: 100755000,
    landing: false,
    processType: Process.IDS.SHUTTLE_INTEGRATION,
    propellantInventoryType: Inventory.IDS.PROPELLANT_SMALL,
    propellantSlot: 1,
    propellantType: Product.IDS.HYDROGEN_PROPELLANT,
    stationType: Station.IDS.EXPANDED_QUARTERS
  },
  [IDS.LIGHT_TRANSPORT]: {
    i: IDS.LIGHT_TRANSPORT,
    name: 'Light Transport',
    description: `The Light Transport is a medium-sized ship with two engines that serves as the
      pickup truck of the Belt. Its crewmate complement of up to five can use the ship to transport
      up to a nominal 2000 tonnes of cargo. The Light Transport is uniquely able to land on any 
      undeveloped asteroid lot, not just in Spaceports like the other ships of the Exploitation era.`,
    cargoInventoryType: Inventory.IDS.CARGO_MEDIUM,
    cargoSlot: 2,
    docking: true,
    emergencyPropellantCap: 0.1,
    exhaustVelocity: 30000,
    hullMass: 185525000,
    landing: true,
    processType: Process.IDS.LIGHT_TRANSPORT_INTEGRATION,
    propellantInventoryType: Inventory.IDS.PROPELLANT_MEDIUM,
    propellantSlot: 1,
    propellantType: Product.IDS.HYDROGEN_PROPELLANT,
    stationType: Station.IDS.STANDARD_QUARTERS
  },
  [IDS.HEAVY_TRANSPORT]: {
    i: IDS.HEAVY_TRANSPORT,
    name: 'Heavy Transport',
    description: `The Heavy Transport is a huge, nine-engine ship specializing in bulk transportation
      of goods. It can nominally be used to haul up to a massive 12,000 tonnes of cargo, and has space 
      for up to five crewmates. The Heavy Transport requires a Spaceport to land on an asteroid.`,
    cargoInventoryType: Inventory.IDS.CARGO_LARGE,
    cargoSlot: 2,
    docking: true,
    emergencyPropellantCap: 0.1,
    exhaustVelocity: 30000,
    hullMass: 969525000,
    landing: false,
    processType: Process.IDS.HEAVY_TRANSPORT_INTEGRATION,
    propellantInventoryType: Inventory.IDS.PROPELLANT_LARGE,
    propellantSlot: 1,
    propellantType: Product.IDS.HYDROGEN_PROPELLANT,
    stationType: Station.IDS.STANDARD_QUARTERS
  }
};

const VARIANT_TYPES = {
  [VARIANTS.STANDARD]: {
    i: VARIANTS.STANDARD,
    name: 'Standard',
    shipType: null, // applies to all base ships
    exhaustVelocityModifier: 0
  },
  [VARIANTS.COBALT_PIONEER]: {
    i: VARIANTS.COBALT_PIONEER,
    name: 'Cobalt Pioneer',
    shipType: IDS.LIGHT_TRANSPORT,
    exhaustVelocityModifier: 0.1
  },
  [VARIANTS.TITANIUM_PIONEER]: {
    i: VARIANTS.TITANIUM_PIONEER,
    name: 'Titanium Pioneer',
    shipType: IDS.LIGHT_TRANSPORT,
    exhaustVelocityModifier: 0.15
  },
  [VARIANTS.AUREATE_PIONEER]: {
    i: VARIANTS.AUREATE_PIONEER,
    name: 'Aureate Pioneer',
    shipType: IDS.LIGHT_TRANSPORT,
    exhaustVelocityModifier: 0.2
  }
};

// setupTime and constructionTime is in in-game seconds
const CONSTRUCTION_TYPES = {
  [IDS.SHUTTLE]: {
    setupTime: Process.TYPES[Process.IDS.SHUTTLE_INTEGRATION].setupTime,
    constructionTime: Process.TYPES[Process.IDS.SHUTTLE_INTEGRATION].recipeTime,
    requirements: Process.TYPES[Process.IDS.SHUTTLE_INTEGRATION].inputs
  },
  [IDS.LIGHT_TRANSPORT]: {
    setupTime: Process.TYPES[Process.IDS.LIGHT_TRANSPORT_INTEGRATION].setupTime,
    constructionTime: Process.TYPES[Process.IDS.LIGHT_TRANSPORT_INTEGRATION].recipeTime,
    requirements: Process.TYPES[Process.IDS.LIGHT_TRANSPORT_INTEGRATION].inputs
  },
  [IDS.HEAVY_TRANSPORT]: {
    setupTime: Process.TYPES[Process.IDS.HEAVY_TRANSPORT_INTEGRATION].setupTime,
    constructionTime: Process.TYPES[Process.IDS.HEAVY_TRANSPORT_INTEGRATION].recipeTime,
    requirements: Process.TYPES[Process.IDS.HEAVY_TRANSPORT_INTEGRATION].inputs
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

const getVariant = (variant) => {
  return VARIANT_TYPES[variant] ? { ...VARIANT_TYPES[variant] } : { ...VARIANT_TYPES[VARIANTS.STANDARD] };
};
Component.getVariant = (ship) => getVariant(ship.variant);
Entity.getVariant = (entity) => Component.getVariant(entity.Ship);

const getPropellantRequirement = (shipType, wetMass, deltaV_ms, exhaustBonus = 1) => {
  const exhaustVelocity = TYPES[shipType].exhaustVelocity * exhaustBonus;
  return wetMass * (1 - 1 / Math.exp(deltaV_ms / exhaustVelocity));
};
Entity.getPropellantRequirement = (ship, deltaV_ms, exhaustBonus = 1) => {
  const variant = Entity.getVariant(ship);
  if (variant && variant.exhaustVelocityModifier) exhaustBonus *= (1 + variant.exhaustVelocityModifier);

  const shipConfig = TYPES[ship.Ship.shipType] || {};
  const cargoInventory = ship.Inventories.find((inventory) => inventory.slot === shipConfig.cargoSlot);
  const propellantInventory = ship.Inventories.find((inventory) => inventory.slot === shipConfig.propellantSlot);
  return getPropellantRequirement(
    ship.Ship.shipType,
    shipConfig.hullMass + (cargoInventory?.mass || 0) + (propellantInventory?.mass || 0),
    deltaV_ms,
    exhaustBonus
  );
}

const propellantToDeltaV = (shipType, wetMass, usedPropellantMass, exhaustBonus = 1) => {
  return TYPES[shipType].exhaustVelocity * exhaustBonus * Math.log(wetMass / (wetMass - usedPropellantMass));
};
Entity.propellantToDeltaV = (ship, usedPropellantMass, exhaustBonus = 1) => {
  const variant = Entity.getVariant(ship);
  if (variant && variant.exhaustVelocityModifier) exhaustBonus *= (1 + variant.exhaustVelocityModifier);

  const shipConfig = TYPES[ship.Ship.shipType] || {};
  const cargoInventory = ship.Inventories.find((inventory) => inventory.slot === shipConfig.cargoSlot);
  const propellantInventory = ship.Inventories.find((inventory) => inventory.slot === shipConfig.propellantSlot);
  return propellantToDeltaV(
    ship.Ship.shipType,
    shipConfig.hullMass + (cargoInventory?.mass || 0) + (propellantInventory?.mass || 0),
    usedPropellantMass,
    exhaustBonus
  );
};

const getEmergencyPropellantAmount = (generationTime, propLimit, inventoryConfig, startingAmount, resourceId = Product.IDS.HYDROGEN_PROPELLANT) => {
  const maxEmergencyPropellantAmount = propLimit * inventoryConfig.massConstraint / Product.TYPES[resourceId].massPerUnit;
  const generationRate = maxEmergencyPropellantAmount / EMERGENCY_PROP_GEN_TIME;
  const uncappedGenerationAmount = generationRate * generationTime;
  return Math.min(maxEmergencyPropellantAmount, startingAmount + uncappedGenerationAmount);
};
Entity.getEmergencyPropellantAmount = (ship, inventoryBonuses = { mass: 1, volume: 1 }, timeAcceleration = Time.DEFAULT_TIME_ACCELERATION, resourceId = Product.IDS.HYDROGEN_PROPELLANT) => {
  if (!ship || !ship.Ship || !ship.Inventories) return null;
  const shipConfig = TYPES[ship.Ship.shipType];
  if (!shipConfig) return null;
  const propellantInventory = ship.Inventories.find((inventory) => inventory.slot === shipConfig.propellantSlot);
  if (!propellantInventory) return null;
  const inventoryConfig = Inventory.getType(propellantInventory.inventoryType, inventoryBonuses);
  if (!inventoryConfig) return null;

  return getEmergencyPropellantAmount(
    Time.toGameDuration(Date.now() / 1000 - ship.Ship.emergencyAt, timeAcceleration),
    shipConfig.emergencyPropellantCap,
    inventoryConfig,
    propellantInventory.mass / Product.TYPES[resourceId].massPerUnit,
  );
};

const getTimeUntilEmergencyPropellantFull = (inventoryConfig, propLimit, startingAmount, resourceId = Product.IDS.HYDROGEN_PROPELLANT) => {
  const maxEmergencyPropellantAmount = propLimit * inventoryConfig.massConstraint / Product.TYPES[resourceId].massPerUnit;
  const maxAmountCanGenerate = maxEmergencyPropellantAmount - startingAmount;
  const generationRate = maxEmergencyPropellantAmount / EMERGENCY_PROP_GEN_TIME;
  return maxAmountCanGenerate / generationRate;
};
Entity.getTimeUntilEmergencyPropellantFull = (ship, inventoryBonuses = { mass: 1, volume: 1 }, resourceId = Product.IDS.HYDROGEN_PROPELLANT) => {
  if (!ship || !ship.Ship || !ship.Inventories) return null;
  const shipConfig = TYPES[ship.Ship.shipType];
  if (!shipConfig) return null;
  const propellantInventory = ship.Inventories.find((inventory) => inventory.slot === shipConfig.propellantSlot);
  if (!propellantInventory) return null;
  const inventoryConfig = Inventory.getType(propellantInventory.inventoryType, inventoryBonuses);
  if (!inventoryConfig) return null;

  return getTimeUntilEmergencyPropellantFull(
    inventoryConfig,
    shipConfig.emergencyPropellantCap,
    propellantInventory.mass / Product.TYPES[resourceId].massPerUnit,
  );
};

export default {
  CONSTRUCTION_TYPES,
  EMERGENCY_PROP_GEN_TIME,
  IDS,
  STATUSES,
  TYPES,
  VARIANTS,
  VARIANT_TYPES,

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
