import Nameable from './nameable.js';
import Product from './product.js';

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
};

const TYPES = {
  [IDS.ESCAPE_MODULE]: {
    i: IDS.ESCAPE_MODULE,
    name: 'Escape Module',
    landing: false,
    docking: false,
    propellantSlot: 1,
    cargoSlot: 0,
    exhaustVelocity: 30,
    hullMass: 5e6,
  },
  [IDS.SHUTTLE]: {
    i: IDS.SHUTTLE,
    name: 'Shuttle',
    landing: false,
    docking: true,
    propellantSlot: 1,
    cargoSlot: 2,
    exhaustVelocity: 30,
    hullMass: 100e6,
  },
  [IDS.LIGHT_TRANSPORT]: {
    i: IDS.LIGHT_TRANSPORT,
    name: 'Light Transport',
    landing: true,
    docking: true,
    propellantSlot: 1,
    cargoSlot: 2,
    exhaustVelocity: 30,
    hullMass: 180e6,
  },
  [IDS.HEAVY_TRANSPORT]: {
    i: IDS.HEAVY_TRANSPORT,
    name: 'Heavy Transport',
    landing: false,
    docking: true,
    propellantSlot: 1,
    cargoSlot: 2,
    exhaustVelocity: 30,
    hullMass: 1000e6,
  },
};

const CONSTRUCTION_TYPES = {
  [IDS.SHUTTLE]: {
    constructionTime: 108,
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
    constructionTime: 144,
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
    constructionTime: 360,
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

const getConstructionType = (type) => CONSTRUCTION_TYPES[type] ? { ...CONSTRUCTION_TYPES[type] } : null;
const getType = (type) => TYPES[type] ? { ...TYPES[type] } : null;

export default {
  CONSTRUCTION_TYPES,
  IDS,
  STATUSES,
  TYPES,

  getConstructionType,
  getType,
  isNameValid: (name) => Nameable.isNameValid(name, Nameable.TYPES.Ship),
};
