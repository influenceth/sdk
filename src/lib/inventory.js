import Process from './process.js';
import Product from './product.js';

const IDS = {
  WAREHOUSE_SITE: 1,
  EXTRACTOR_SITE: 2,
  REFINERY_SITE: 3,
  BIOREACTOR_SITE: 4,
  FACTORY_SITE: 5,
  SHIPYARD_SITE: 6,
  SPACEPORT_SITE: 7,
  MARKETPLACE_SITE: 8,
  HABITAT_SITE: 9,
  WAREHOUSE_PRIMARY: 10,
  PROPELLANT_TINY: 11,
  PROPELLANT_SMALL: 12,
  PROPELLANT_MEDIUM: 13,
  PROPELLANT_LARGE: 14,
  CARGO_SMALL: 15,
  CARGO_MEDIUM: 16,
  CARGO_LARGE: 17
};

const STATUSES = {
  UNAVAILABLE: 0,
  AVAILABLE: 1
};

const CATEGORIES = {
  SITE: 'SITE',
  PRIMARY: 'PRIMARY',
  PROPELLANT: 'PROPELLANT'
};

// if massConstraint and volumeConstraint are Infinity, productConstraints should not be unconstrained
// productConstraints specifies constraints on which products (and how much of each) can be stored in inventory
//  - if product constraint is specified with a quantity of 0, then product amount is unconstrained (up to inventory capacity)
// (mass is in g, volume is in mL)
const TYPES = {
  [IDS.WAREHOUSE_SITE]: {
    i: IDS.WAREHOUSE_SITE,
    name: 'Warehouse Site',
    massConstraint: Infinity,
    volumeConstraint: Infinity,
    modifiable: false,
    productConstraints: Process.TYPES[Process.IDS.WAREHOUSE_CONSTRUCTION].inputs,
    category: CATEGORIES.SITE
  },
  [IDS.EXTRACTOR_SITE]: {
    i: IDS.EXTRACTOR_SITE,
    name: 'Extractor Site',
    massConstraint: Infinity,
    volumeConstraint: Infinity,
    modifiable: false,
    productConstraints: Process.TYPES[Process.IDS.EXTRACTOR_CONSTRUCTION].inputs,
    category: CATEGORIES.SITE
  },
  [IDS.REFINERY_SITE]: {
    i: IDS.REFINERY_SITE,
    name: 'Refinery Site',
    massConstraint: Infinity,
    volumeConstraint: Infinity,
    modifiable: false,
    productConstraints: Process.TYPES[Process.IDS.REFINERY_CONSTRUCTION].inputs,
    category: CATEGORIES.SITE
  },
  [IDS.BIOREACTOR_SITE]: {
    i: IDS.BIOREACTOR_SITE,
    name: 'Bioreactor Site',
    massConstraint: Infinity,
    volumeConstraint: Infinity,
    modifiable: false,
    productConstraints: Process.TYPES[Process.IDS.BIOREACTOR_CONSTRUCTION].inputs,
    category: CATEGORIES.SITE
  },
  [IDS.FACTORY_SITE]: {
    i: IDS.FACTORY_SITE,
    name: 'Factory Site',
    massConstraint: Infinity,
    volumeConstraint: Infinity,
    modifiable: false,
    productConstraints: Process.TYPES[Process.IDS.FACTORY_CONSTRUCTION].inputs,
    category: CATEGORIES.SITE
  },
  [IDS.SHIPYARD_SITE]: {
    i: IDS.SHIPYARD_SITE,
    name: 'Shipyard Site',
    massConstraint: Infinity,
    volumeConstraint: Infinity,
    modifiable: false,
    productConstraints: Process.TYPES[Process.IDS.SHIPYARD_CONSTRUCTION].inputs,
    category: CATEGORIES.SITE
  },
  [IDS.SPACEPORT_SITE]: {
    i: IDS.SPACEPORT_SITE,
    name: 'Spaceport Site',
    massConstraint: Infinity,
    volumeConstraint: Infinity,
    modifiable: false,
    productConstraints: Process.TYPES[Process.IDS.SPACEPORT_CONSTRUCTION].inputs,
    category: CATEGORIES.SITE
  },
  [IDS.MARKETPLACE_SITE]: {
    i: IDS.MARKETPLACE_SITE,
    name: 'Marketplace Site',
    massConstraint: Infinity,
    volumeConstraint: Infinity,
    modifiable: false,
    productConstraints: Process.TYPES[Process.IDS.MARKETPLACE_CONSTRUCTION].inputs,
    category: CATEGORIES.SITE
  },
  [IDS.HABITAT_SITE]: {
    i: IDS.HABITAT_SITE,
    name: 'Habitat Site',
    massConstraint: Infinity,
    volumeConstraint: Infinity,
    modifiable: false,
    productConstraints: Process.TYPES[Process.IDS.HABITAT_CONSTRUCTION].inputs,
    category: CATEGORIES.SITE
  },
  [IDS.WAREHOUSE_PRIMARY]: {
    i: IDS.WAREHOUSE_PRIMARY,
    name: 'Warehouse Storage',
    massConstraint: 1500000e6,
    volumeConstraint: 75000e6,
    modifiable: true,
    productConstraints: null,
    category: CATEGORIES.PRIMARY
  },
  [IDS.PROPELLANT_TINY]: {
    i: IDS.PROPELLANT_TINY,
    name: 'Tiny Propellant Tank',
    massConstraint: 200e6,
    volumeConstraint: 2660e6,
    modifiable: true,
    productConstraints: { [Product.IDS.HYDROGEN_PROPELLANT]: 0 },
    category: CATEGORIES.PROPELLANT
  },
  [IDS.PROPELLANT_SMALL]: {
    i: IDS.PROPELLANT_SMALL,
    name: 'Small Propellant Tank',
    massConstraint: 2000e6,
    volumeConstraint: 26600e6,
    modifiable: true,
    productConstraints: { [Product.IDS.HYDROGEN_PROPELLANT]: 0 },
    category: CATEGORIES.PROPELLANT
  },
  [IDS.PROPELLANT_MEDIUM]: {
    i: IDS.PROPELLANT_MEDIUM,
    name: 'Medium Propellant Tank',
    massConstraint: 4000e6,
    volumeConstraint: 53200e6,
    modifiable: true,
    productConstraints: { [Product.IDS.HYDROGEN_PROPELLANT]: 0 },
    category: CATEGORIES.PROPELLANT
  },
  [IDS.PROPELLANT_LARGE]: {
    i: IDS.PROPELLANT_LARGE,
    name: 'Large Propellant Tank',
    massConstraint: 24000e6,
    volumeConstraint: 319200e6,
    modifiable: true,
    productConstraints: { [Product.IDS.HYDROGEN_PROPELLANT]: 0 },
    category: CATEGORIES.PROPELLANT
  },
  [IDS.CARGO_SMALL]: {
    i: IDS.CARGO_SMALL,
    name: 'Small Cargo Hold',
    massConstraint: 50e6,
    volumeConstraint: 125e6,
    modifiable: true,
    productConstraints: null,
    category: CATEGORIES.PRIMARY
  },
  [IDS.CARGO_MEDIUM]: {
    i: IDS.CARGO_MEDIUM,
    name: 'Medium Cargo Hold',
    massConstraint: 2000e6,
    volumeConstraint: 5000e6,
    modifiable: true,
    productConstraints: null,
    category: CATEGORIES.PRIMARY
  },
  [IDS.CARGO_LARGE]: {
    i: IDS.CARGO_LARGE,
    name: 'Large Cargo Hold',
    massConstraint: 12000e6,
    volumeConstraint: 30000e6,
    modifiable: true,
    productConstraints: null,
    category: CATEGORIES.PRIMARY
  }
};

// sum the product constraints mass and volume in case that is useful for progress bars
Object.keys(TYPES).forEach((key) => {
  TYPES[key].productConstraintsTotalMass = Infinity;
  TYPES[key].productConstraintsTotalVolume = Infinity;
  if (TYPES[key].productConstraints) {
    if (!Object.values(TYPES[key].productConstraints).find((q) => q === 0)) {
      const sum = Object.keys(TYPES[key].productConstraints).reduce((acc, productId) => {
        const quanta = TYPES[key].productConstraints[productId];
        if (quanta === 0) {
          acc.m = Infinity;
          acc.v = Infinity;
        } else {
          acc.m += quanta * Product.TYPES[productId].massPerUnit;
          acc.v += quanta * Product.TYPES[productId].volumePerUnit;
        }
        return acc;
      }, { m: 0, v: 0 });

      TYPES[key].productConstraintsTotalMass = sum.m;
      TYPES[key].productConstraintsTotalVolume = sum.v;
    }
  }
});

const getType = (type, bonuses = { mass: 1, volume: 1 }) => {
  if (type && TYPES[type]) {
    return Object.keys(TYPES[type]).reduce((acc, k) => {
      let v = TYPES[type][k];
      if (k === 'massConstraint' && bonuses.mass !== 1) v *= bonuses.mass;
      if (k === 'volumeConstraint' && bonuses.volume !== 1) v *= bonuses.volume;
      return { ...acc, [k]: v };
    }, {});
  }
  return null;
};

/**
 * Returns the mass and volume of a "full" version of the inventory
 *  "Full" may be at mass(/volume)Constraint if it exists, or at a sum of
 *  the filled productConstraints, or Infinity if neither constraint exists
 * @param {integer} inventoryType
 * @returns {object} An object with filledMass and filledVolume (in grams and mL)
 */
const getFilledCapacity = (inventoryType, bonuses = { mass: 1, volume: 1 }) => {
  const config = TYPES[inventoryType] || {};
  return {
    filledMass: config.massConstraint === Infinity
      ? config.productConstraintsTotalMass
      : ((config.massConstraint * bonuses.mass) || Infinity),
    filledVolume: config.volumeConstraint === Infinity
      ? config.productConstraintsTotalVolume
      : ((config.volumeConstraint * bonuses.volume) || Infinity)
  };
};

/**
 * Converts a raw productIds / quantities array pair into a product details set
 * @param {[integer]|object} products Object with productId -> quantity OR array of productIds
 * @param {[integer]} quantities Array of quantities (required when productsSet is an array)
 * @returns An object with a set of products and a total mass and volume (in grams and mL)
 */
const getContents = (products, quantities = []) => {
  let productIds = products;

  if (!Array.isArray(products)) {
    productIds = Object.keys(products);
    quantities = Object.values(products);
  } else {
    if (products.length !== quantities.length) throw new Error('products ids and quantities must match');
  }

  const productDetails = {};
  const totals = { mass: 0, volume: 0 };

  productIds.forEach((productId, index) => {
    const config = Product.TYPES[Number(productId)];
    const quantity = quantities[index];
    const mass = quantity * config.massPerUnit;
    const volume = quantity * config.volumePerUnit;

    totals.mass += mass;
    totals.volume += volume;
    productDetails[Number(productId)] = {
      name: config.name,
      quantity,
      mass,
      massPerUnit: config.massPerUnit,
      volume,
      volumePerUnit: config.volumePerUnit
    };
  });

  return { products: productDetails, totals };
};

export default {
  CATEGORIES,
  IDS,
  STATUSES,
  TYPES,

  getContents,
  getFilledCapacity,
  getType
};
