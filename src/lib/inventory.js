import Building from './building.js';
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
  CARGO_LARGE: 17,
};

const STATUSES = {
  AVAILABLE: 1,
  LOCKED: 2
};

// if massConstraint and volumeConstraint are Infinity, productConstraints should not be unconstrained
// productConstraints specifies constraints on which products (and how much of each) can be stored in inventory
//  - if product constraint is specified with a quantity of 0, then product amount is unconstrained (up to inventory capacity)
// (mass is in g, volume is in mL)
const TYPES = {
  [IDS.WAREHOUSE_SITE]: {
    i: IDS.WAREHOUSE_SITE,
    massConstraint: Infinity,
    volumeConstraint: Infinity,
    productConstraints: Building.CONSTRUCTION_TYPES[Building.IDS.WAREHOUSE].requirements,
  },
  [IDS.EXTRACTOR_SITE]: {
    i: IDS.EXTRACTOR_SITE,
    massConstraint: Infinity,
    volumeConstraint: Infinity,
    productConstraints: Building.CONSTRUCTION_TYPES[Building.IDS.EXTRACTOR].requirements,
  },
  [IDS.REFINERY_SITE]: {
    i: IDS.REFINERY_SITE,
    massConstraint: Infinity,
    volumeConstraint: Infinity,
    productConstraints: Building.CONSTRUCTION_TYPES[Building.IDS.REFINERY].requirements,
  },
  [IDS.BIOREACTOR_SITE]: {
    i: IDS.BIOREACTOR_SITE,
    massConstraint: Infinity,
    volumeConstraint: Infinity,
    productConstraints: Building.CONSTRUCTION_TYPES[Building.IDS.BIOREACTOR].requirements,
  },
  [IDS.FACTORY_SITE]: {
    i: IDS.FACTORY_SITE,
    massConstraint: Infinity,
    volumeConstraint: Infinity,
    productConstraints: Building.CONSTRUCTION_TYPES[Building.IDS.FACTORY].requirements,
  },
  [IDS.SHIPYARD_SITE]: {
    i: IDS.SHIPYARD_SITE,
    massConstraint: Infinity,
    volumeConstraint: Infinity,
    productConstraints: Building.CONSTRUCTION_TYPES[Building.IDS.SHIPYARD].requirements,
  },
  [IDS.SPACEPORT_SITE]: {
    i: IDS.SPACEPORT_SITE,
    massConstraint: Infinity,
    volumeConstraint: Infinity,
    productConstraints: Building.CONSTRUCTION_TYPES[Building.IDS.SPACEPORT].requirements,
  },
  [IDS.MARKETPLACE_SITE]: {
    i: IDS.MARKETPLACE_SITE,
    massConstraint: Infinity,
    volumeConstraint: Infinity,
    productConstraints: Building.CONSTRUCTION_TYPES[Building.IDS.MARKETPLACE].requirements,
  },
  [IDS.HABITAT_SITE]: {
    i: IDS.HABITAT_SITE,
    massConstraint: Infinity,
    volumeConstraint: Infinity,
    productConstraints: Building.CONSTRUCTION_TYPES[Building.IDS.HABITAT].requirements,
  },
  [IDS.WAREHOUSE_PRIMARY]: {
    i: IDS.WAREHOUSE_PRIMARY,
    massConstraint: 1500000e6,
    volumeConstraint: 75000e6,
    productConstraints: null
  },
  [IDS.PROPELLANT_TINY]: {
    i: IDS.PROPELLANT_TINY,
    massConstraint: 100e6,
    volumeConstraint: 1310e6,
    productConstraints: { [Product.IDS.HYDROGEN_PROPELLANT]: 0 }
  },
  [IDS.PROPELLANT_SMALL]: {
    i: IDS.PROPELLANT_SMALL,
    massConstraint: 1000e6,
    volumeConstraint: 13100e6,
    productConstraints: { [Product.IDS.HYDROGEN_PROPELLANT]: 0 }
  },
  [IDS.PROPELLANT_MEDIUM]: {
    i: IDS.PROPELLANT_MEDIUM,
    massConstraint: 2000e6,
    volumeConstraint: 26200e6,
    productConstraints: { [Product.IDS.HYDROGEN_PROPELLANT]: 0 }
  },
  [IDS.PROPELLANT_LARGE]: {
    i: IDS.PROPELLANT_LARGE,
    massConstraint: 12000e6,
    volumeConstraint: 157200e6,
    productConstraints: { [Product.IDS.HYDROGEN_PROPELLANT]: 0 }
  },
  [IDS.CARGO_SMALL]: {
    i: IDS.CARGO_SMALL,
    massConstraint: 50e6,
    volumeConstraint: 125e6,
    productConstraints: null
  },
  [IDS.CARGO_MEDIUM]: {
    i: IDS.CARGO_MEDIUM,
    massConstraint: 2000e6,
    volumeConstraint: 5000e6,
    productConstraints: null
  },
  [IDS.CARGO_LARGE]: {
    i: IDS.CARGO_LARGE,
    massConstraint: 12000e6,
    volumeConstraint: 30000e6,
    productConstraints: null
  },
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

const getType = (type) => TYPES[type] ? { ...TYPES[type] } : null;

/**
 * Returns the mass and volume of a "full" version of the inventory
 *  "Full" may be at mass(/volume)Constraint if it exists, or at a sum of
 *  the filled productConstraints, or Infinity if neither constraint exists
 * @param {integer} inventoryType
 * @returns {object} An object with filledMass and filledVolume (in grams and mL)
 */
const getFilledCapacity = (inventoryType) => {
  const config = TYPES[inventoryType] || {};
  return {
    filledMass: config.massConstraint === Infinity
      ? config.productConstraintsTotalMass
      : (config.massConstraint || Infinity),
    filledVolume: config.volumeConstraint === Infinity
      ? config.productConstraintsTotalVolume
      : (config.volumeConstraint || Infinity)
  };
}

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
  IDS,
  STATUSES,
  TYPES,

  getContents,
  getFilledCapacity,
  getType
}