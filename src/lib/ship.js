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
  IN_FLIGHT: 2,
  DISABLED: 3
};

const MODES = {
  NORMAL: 1,
  EMERGENCY: 2,
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
    hullMass: 5e6,
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
    hullMass: 100e6,
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
    hullMass: 180e6,
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
    hullMass: 1000e6,
  },
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

export default {
  CONSTRUCTION_TYPES,
  IDS,
  MODES,
  STATUSES,
  TYPES,

  getConstructionType,
  getType,
  getVariant,

  Entity,
  Component
};
