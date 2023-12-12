import Product from './product.js';

const IDS = {
  EMPTY_LOT: 0,
  WAREHOUSE: 1,
  EXTRACTOR: 2,
  REFINERY: 3,
  BIOREACTOR: 4,
  FACTORY: 5,
  SHIPYARD: 6,
  SPACEPORT: 7,
  MARKETPLACE: 8,
  HABITAT: 9
};

/**
 * Constants
 */
const TYPES = {
  [IDS.EMPTY_LOT]: {
    i: IDS.EMPTY_LOT,
    name: 'Empty Lot',
    description: `The microgravity environment of asteroids affects the physical
      condition of asteroid material; for example, a bed of regolith will settle
      and become more compacted than would be found on an asteroid.`
  },
  [IDS.WAREHOUSE]: {
    i: IDS.WAREHOUSE,
    name: 'Warehouse',
    description: `The Warehouse provides inventory space to store items: raw
      materials, refined materials, process modules, or finished goods.`
  },
  [IDS.EXTRACTOR]: {
    i: IDS.EXTRACTOR,
    name: 'Extractor',
    description: `The Extractor is responsible for extracting the raw materials from an
      asteroid. They are tied closely to the core sampling process, and rely
      on the availability of a core sample to be able to operate efficiently.`
  },
  [IDS.REFINERY]: {
    i: IDS.REFINERY,
    name: 'Refinery',
    description: `The Refinery allows for the refining of raw materials into their
      constituent refined materials. Effectively they are responsible for
      all intermediate and un-finished goods. They utilize process modules
      to modify the targeted output which defines the recipe, and therefore
      required inputs.`
  },
  [IDS.BIOREACTOR]: {
    i: IDS.BIOREACTOR,
    name: 'Bioreactor',
    description: '' // TODO: ...
  },
  [IDS.FACTORY]: {
    i: IDS.FACTORY,
    name: 'Factory',
    description: `All finished goods, except for ships, are produced in the Factory based
      on their installed assembly process modules. The finished goods produced
      in Factories are primarily consumables, or serve to be assembled as new
      buildings, or new ships.`
  },
  [IDS.SHIPYARD]: {
    i: IDS.SHIPYARD,
    name: 'Shipyard',
    description: `The Shipyard is a specialized Factory that are required for the final
      construction and deconstruction of ships.`
  },
  [IDS.SPACEPORT]: {
    i: IDS.SPACEPORT,
    name: 'Spaceport',
    description: `The Spaceport allows for the landing of all ship classes on an asteroid's
      surface, not just those capable of performing all-terrain landings like
      the Light Transport. Spaceports provide for unlimited space to land ships
      and the only facilities on the asteroid capable of loading and unloading
      those ships. Although they have unlimited space, landing is subject to a
      queue with one landing occurring every 4 Adalian hours (10 real minutes).`
  },
  [IDS.MARKETPLACE]: {
    i: IDS.MARKETPLACE,
    name: 'Marketplace',
    description: `The Marketplace serves as the central point of the Adalian economy. Once
      they are built on an asteroid they allow for the exchange of all local
      raw materials, refined materials, process modules, and finished goods.
      Items are placed on the Marketplace by the seller, and once purchased by
      the buyer generate fees that accrue to the owner of the Marketplace. The
      Marketplace owner is further able to provide incentives to sellers to
      encourage their use of a particular Marketplace. Buyers are able to access
      a single, asteroid-wide market interface displaying items for sale, but
      any explicit buy-orders must be placed at a specific Marketplace.`
  },
  [IDS.HABITAT]: {
    i: IDS.HABITAT,
    name: 'Habitat',
    description: `The Habitat is the only location which allows recruiting of new Crewmates
      and is required to support any Hab Modules not attached to ships.
      Additionally, Habitats are required for the storage of inactive crew, and
      therefore grant the ability to switch out / modify crew loadouts. Finally,
      active crew can be stationed at Habitats resulting in a bonus to their
      Food consumption rate vs. crew stationed on their ship at Spaceports or in
      flight. Although there are no limits on the number of Crewmates stationed
      at a Habitat, the Food consumption bonus diminishes when Habitats become
      overcrowded and ultimately disappears as the level of overcrowding increases.`
  }
};

// NOTE: constructionTime is in-game seconds
const CONSTRUCTION_TYPES = {
  [IDS.WAREHOUSE]: {
    constructionTime: 1728000,
    requirements: {
      [Product.IDS.CEMENT]: 700000,
      [Product.IDS.STEEL_BEAM]: 700000,
      [Product.IDS.STEEL_SHEET]: 400000
    }
  },
  [IDS.EXTRACTOR]: {
    constructionTime: 2073600,
    requirements: {
      [Product.IDS.CEMENT]: 400000,
      [Product.IDS.STEEL_BEAM]: 900000,
      [Product.IDS.STEEL_SHEET]: 200000,
      [Product.IDS.POLYACRYLONITRILE_FABRIC]: 3000,
      [Product.IDS.MOBILITY_MODULE]: 5,
      [Product.IDS.FLUIDS_AUTOMATION_MODULE]: 4,
      [Product.IDS.SOLIDS_AUTOMATION_MODULE]: 4,
      [Product.IDS.AVIONICS_MODULE]: 1,
      [Product.IDS.POWER_MODULE]: 16
    }
  },
  [IDS.REFINERY]: {
    constructionTime: 4147200,
    requirements: {
      [Product.IDS.CEMENT]: 800000,
      [Product.IDS.STEEL_BEAM]: 600000,
      [Product.IDS.STEEL_SHEET]: 400000,
      [Product.IDS.PLATINUM]: 2,
      [Product.IDS.FLUIDS_AUTOMATION_MODULE]: 76,
      [Product.IDS.SOLIDS_AUTOMATION_MODULE]: 8,
      [Product.IDS.AVIONICS_MODULE]: 6,
      [Product.IDS.POWER_MODULE]: 160,
      [Product.IDS.THERMAL_MODULE]: 20
    }
  },
  [IDS.BIOREACTOR]: {
    constructionTime: 3456000,
    requirements: {
      [Product.IDS.DEIONIZED_WATER]: 2900000,
      [Product.IDS.FUSED_QUARTZ]: 500000,
      [Product.IDS.CEMENT]: 500000,
      [Product.IDS.SOIL]: 500000,
      [Product.IDS.STEEL_BEAM]: 100000,
      [Product.IDS.STEEL_SHEET]: 300000,
      [Product.IDS.POLYPROPYLENE]: 50000,
      [Product.IDS.PURE_NITROGEN]: 125000,
      [Product.IDS.FLUIDS_AUTOMATION_MODULE]: 100,
      [Product.IDS.SOLIDS_AUTOMATION_MODULE]: 50,
      [Product.IDS.AVIONICS_MODULE]: 4,
      [Product.IDS.POWER_MODULE]: 46
    }
  },
  [IDS.FACTORY]: {
    constructionTime: 5184000,
    requirements: {
      [Product.IDS.CEMENT]: 900000,
      [Product.IDS.STEEL_BEAM]: 1100000,
      [Product.IDS.STEEL_SHEET]: 700000,
      [Product.IDS.FLUIDS_AUTOMATION_MODULE]: 40,
      [Product.IDS.SOLIDS_AUTOMATION_MODULE]: 162,
      [Product.IDS.AVIONICS_MODULE]: 8,
      [Product.IDS.POWER_MODULE]: 120,
      [Product.IDS.THERMAL_MODULE]: 30
    }
  },
  [IDS.SHIPYARD]: {
    constructionTime: 9331200,
    requirements: {
      [Product.IDS.CEMENT]: 2000000,
      [Product.IDS.STEEL_BEAM]: 2400000,
      [Product.IDS.STEEL_SHEET]: 1000000,
      [Product.IDS.FLUIDS_AUTOMATION_MODULE]: 160,
      [Product.IDS.SOLIDS_AUTOMATION_MODULE]: 300,
      [Product.IDS.AVIONICS_MODULE]: 10,
      [Product.IDS.POWER_MODULE]: 200,
      [Product.IDS.THERMAL_MODULE]: 50
    }
  },
  [IDS.SPACEPORT]: {
    constructionTime: 9331200,
    requirements: {
      [Product.IDS.CEMENT]: 4300000,
      [Product.IDS.STEEL_BEAM]: 2200000,
      [Product.IDS.STEEL_SHEET]: 3200000,
      [Product.IDS.STEEL_CABLE]: 200000,
      [Product.IDS.FLUIDS_AUTOMATION_MODULE]: 160,
      [Product.IDS.SOLIDS_AUTOMATION_MODULE]: 180,
      [Product.IDS.AVIONICS_MODULE]: 20,
      [Product.IDS.POWER_MODULE]: 200,
      [Product.IDS.THERMAL_MODULE]: 250
    }
  },
  [IDS.MARKETPLACE]: {
    constructionTime: 10368000,
    requirements: {
      [Product.IDS.CEMENT]: 3000000,
      [Product.IDS.STEEL_BEAM]: 2500000,
      [Product.IDS.STEEL_SHEET]: 3000000,
      [Product.IDS.STEEL_CABLE]: 500000,
      [Product.IDS.LARGE_THRUST_BEARING]: 6,
      [Product.IDS.HABITATION_MODULE]: 204,
      [Product.IDS.AVIONICS_MODULE]: 12,
      [Product.IDS.POWER_MODULE]: 120,
      [Product.IDS.THERMAL_MODULE]: 204
    }
  },
  [IDS.HABITAT]: {
    constructionTime: 14515200,
    requirements: {
      [Product.IDS.DEIONIZED_WATER]: 1500000,
      [Product.IDS.CEMENT]: 5000000,
      [Product.IDS.SOIL]: 1500000,
      [Product.IDS.STEEL_BEAM]: 4000000,
      [Product.IDS.STEEL_SHEET]: 5000000,
      [Product.IDS.STEEL_CABLE]: 1000000,
      [Product.IDS.LARGE_THRUST_BEARING]: 12,
      [Product.IDS.HABITATION_MODULE]: 340,
      [Product.IDS.AVIONICS_MODULE]: 20,
      [Product.IDS.POWER_MODULE]: 200,
      [Product.IDS.THERMAL_MODULE]: 340
    }
  }
};

const CONSTRUCTION_STATUSES = {
  UNPLANNED: 0,
  PLANNED: 1,
  UNDER_CONSTRUCTION: 2,
  OPERATIONAL: 3
};

const CONSTRUCTION_STATUS_LABELS = {
  [CONSTRUCTION_STATUSES.UNPLANNED]: 'Unplanned',
  [CONSTRUCTION_STATUSES.PLANNED]: 'Planned',
  [CONSTRUCTION_STATUSES.UNDER_CONSTRUCTION]: 'Under Construction',
  [CONSTRUCTION_STATUSES.OPERATIONAL]: 'Operational'
};

const GRACE_PERIOD = 86400;
const DECONSTRUCTION_PENALTY = 0.10;

const getType = (type) => TYPES[type] ? { ...TYPES[type] } : null;
const getConstructionType = (type) => CONSTRUCTION_TYPES[type] ? { ...CONSTRUCTION_TYPES[type] } : null;

/**
 * @param {integer} buildingType A constructable capable type
 * @param {float} totalBonus The crew bonus to apply to the construction time
 * @returns The construction time required in seconds
 */
const getConstructionTime = (buildingType, totalBonus = 1) => {
  if (CONSTRUCTION_TYPES[buildingType]) {
    return Math.ceil(CONSTRUCTION_TYPES[buildingType].constructionTime / totalBonus);
  } else {
    throw new Error('Building type is invalid or not constructable');
  }
};

export default {
  TYPES,
  CONSTRUCTION_TYPES,
  CONSTRUCTION_STATUSES,
  CONSTRUCTION_STATUS_LABELS,
  DECONSTRUCTION_PENALTY,
  GRACE_PERIOD,
  IDS,

  getConstructionTime,
  getConstructionType,
  getType
};
