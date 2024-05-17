import Process from './process.js';

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
    description: `The Bioreactor, or as the Adalians lovingly call it, the Farm, is a
      specialized building designed to provide a growing space for a variety of organic
      products. It features transparent growing tunnels containing microgravity soil beds
      for agricultural plants brought from Earth, as well as water tubes built into the
      tunnel walls for bio-engineered algae and bacteria. Production of crops in the
      Bioreactor necessarily occurs in batches.`
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
    constructionTime: Process.TYPES[Process.IDS.WAREHOUSE_CONSTRUCTION].recipeTime,
    requirements: Process.TYPES[Process.IDS.WAREHOUSE_CONSTRUCTION].inputs
  },
  [IDS.EXTRACTOR]: {
    constructionTime: Process.TYPES[Process.IDS.EXTRACTOR_CONSTRUCTION].recipeTime,
    requirements: Process.TYPES[Process.IDS.EXTRACTOR_CONSTRUCTION].inputs
  },
  [IDS.REFINERY]: {
    constructionTime: Process.TYPES[Process.IDS.REFINERY_CONSTRUCTION].recipeTime,
    requirements: Process.TYPES[Process.IDS.REFINERY_CONSTRUCTION].inputs
  },
  [IDS.BIOREACTOR]: {
    constructionTime: Process.TYPES[Process.IDS.BIOREACTOR_CONSTRUCTION].recipeTime,
    requirements: Process.TYPES[Process.IDS.BIOREACTOR_CONSTRUCTION].inputs
  },
  [IDS.FACTORY]: {
    constructionTime: Process.TYPES[Process.IDS.FACTORY_CONSTRUCTION].recipeTime,
    requirements: Process.TYPES[Process.IDS.FACTORY_CONSTRUCTION].inputs
  },
  [IDS.SHIPYARD]: {
    constructionTime: Process.TYPES[Process.IDS.SHIPYARD_CONSTRUCTION].recipeTime,
    requirements: Process.TYPES[Process.IDS.SHIPYARD_CONSTRUCTION].inputs
  },
  [IDS.SPACEPORT]: {
    constructionTime: Process.TYPES[Process.IDS.SPACEPORT_CONSTRUCTION].recipeTime,
    requirements: Process.TYPES[Process.IDS.SPACEPORT_CONSTRUCTION].inputs
  },
  [IDS.MARKETPLACE]: {
    constructionTime: Process.TYPES[Process.IDS.MARKETPLACE_CONSTRUCTION].recipeTime,
    requirements: Process.TYPES[Process.IDS.MARKETPLACE_CONSTRUCTION].inputs
  },
  [IDS.HABITAT]: {
    constructionTime: Process.TYPES[Process.IDS.HABITAT_CONSTRUCTION].recipeTime,
    requirements: Process.TYPES[Process.IDS.HABITAT_CONSTRUCTION].inputs
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

const GRACE_PERIOD = 86400 * 2; // 2 days in IRL time
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
