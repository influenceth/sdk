// Keyed by capableType -> inventoryType
// Capacities are in tonnes and cubic meters
export const CAPACITIES = {
  1: {
    0: { name: 'Construction Site', mass: 0, volume: 0 },
    1: { name: 'Storage', mass: 1500000, volume: 75000 }
  },
  2: {
    0: { name: 'Construction Site', mass: 0, volume: 0 }
  },
  3: {
    0: { name: 'Construction Site', mass: 0, volume: 0 }
  },
  4: {
    0: { name: 'Construction Site', mass: 0, volume: 0 }
  },
  5: {
    0: { name: 'Construction Site', mass: 0, volume: 0 }
  },
  6: {
    0: { name: 'Construction Site', mass: 0, volume: 0 }
  },
  7: {
    0: { name: 'Construction Site', mass: 0, volume: 0 }
  },
  8: {
    0: { name: 'Construction Site', mass: 0, volume: 0 }
  },
  9: {
    0: { name: 'Construction Site', mass: 0, volume: 0 }
  }
};

/**
 * Map of resourceIds to details
 * massPerUnit is in tonnes / unit
 * volumePerUnit is in cubic meters / unit
 */
export const RESOURCES = {
  1: { name: 'Water', category: 'Volatile', massPerUnit: 0.001, volumePerUnit: 0.00103, iconVersion: 1, modelVersion: 1 },
  2: { name: 'Hydrogen', category: 'Volatile', massPerUnit: 0.001, volumePerUnit: 0.014, iconVersion: 1, modelVersion: 1 },
  3: { name: 'Ammonia', category: 'Volatile', massPerUnit: 0.001, volumePerUnit: 0.0016, iconVersion: 1, modelVersion: 1 },
  4: { name: 'Nitrogen', category: 'Volatile', massPerUnit: 0.001, volumePerUnit: 0.0012, iconVersion: 1, modelVersion: 1 },
  5: { name: 'Sulfur Dioxide', category: 'Volatile', massPerUnit: 0.001, volumePerUnit: 0.00072, iconVersion: 1, modelVersion: 1 },
  6: { name: 'Carbon Dioxide', category: 'Volatile', massPerUnit: 0.001, volumePerUnit: 0.00064, iconVersion: 1, modelVersion: 1 },
  7: { name: 'Carbon Monoxide', category: 'Volatile', massPerUnit: 0.001, volumePerUnit: 0.00127, iconVersion: 1, modelVersion: 1 },
  8: { name: 'Methane', category: 'Volatile', massPerUnit: 0.001, volumePerUnit: 0.00235, iconVersion: 1, modelVersion: 1 },
  9: { name: 'Apatite', category: 'Organic', massPerUnit: 0.001, volumePerUnit: 0.00052, iconVersion: 1, modelVersion: 1 },
  10: { name: 'Bitumen', category: 'Organic', massPerUnit: 0.001, volumePerUnit: 0.0016, iconVersion: 1, modelVersion: 1 },
  11: { name: 'Calcite', category: 'Organic', massPerUnit: 0.001, volumePerUnit: 0.00062, iconVersion: 1, modelVersion: 1 },
  12: { name: 'Feldspar', category: 'Metal', massPerUnit: 0.001, volumePerUnit: 0.00065, iconVersion: 1, modelVersion: 1 },
  13: { name: 'Olivine', category: 'Metal', massPerUnit: 0.001, volumePerUnit: 0.00062, iconVersion: 1, modelVersion: 1 },
  14: { name: 'Pyroxene', category: 'Metal', massPerUnit: 0.001, volumePerUnit: 0.00048, iconVersion: 1, modelVersion: 1 },
  15: { name: 'Coffinite', category: 'Fissile', massPerUnit: 0.001, volumePerUnit: 0.0003, iconVersion: 1, modelVersion: 1 },
  16: { name: 'Merrillite', category: 'Rare Earth', massPerUnit: 0.001, volumePerUnit: 0.00053, iconVersion: 1, modelVersion: 1 },
  17: { name: 'Xenotime', category: 'Rare Earth', massPerUnit: 0.001, volumePerUnit: 0.00035, iconVersion: 1, modelVersion: 1 },
  18: { name: 'Rhabdite', category: 'Metal', massPerUnit: 0.001, volumePerUnit: 0.00023, iconVersion: 1, modelVersion: 1 },
  19: { name: 'Graphite', category: 'Metal', massPerUnit: 0.001, volumePerUnit: 0.00073, iconVersion: 1, modelVersion: 1 },
  20: { name: 'Taenite', category: 'Metal', massPerUnit: 0.001, volumePerUnit: 0.0002, iconVersion: 1, modelVersion: 1 },
  21: { name: 'Troilite', category: 'Metal', massPerUnit: 0.001, volumePerUnit: 0.00037, iconVersion: 1, modelVersion: 1 },
  22: { name: 'Uraninite', category: 'Fissile', massPerUnit: 0.001, volumePerUnit: 0.000155, iconVersion: 1, modelVersion: 1 },
  175: { name: 'Core Sampler', category: 'Tool', massPerUnit: 0.03, volumePerUnit: 0.4, iconVersion: 1, modelVersion: 1 }
};

export const getCapacities = (capableType, inventoryType) => {
  if (CAPACITIES[capableType]) {
    return CAPACITIES[capableType][inventoryType];
  } else {
    throw new Error('Capable type does not exist');
  }
};

/**
 * Converts a raw resourceIds / quantities array pair into a resource details set
 * @param {[integer]|object} resources Object with resourceId -> quantity OR array of resourceIds
 * @param {[integer]} quantities Array of quantities (required when resourcesSet is an array)
 * @returns An object with a set of resources and a total mass and volume (in tonnes and cubic meters)
 */
export const getContents = (resources, quantities = []) => {
  let resourceIds = resources;

  if (!Array.isArray(resources)) {
    resourceIds = Object.keys(resources);
    quantities = Object.values(resources);
  } else {
    if (resources.length !== quantities.length) throw new Error('Resources ids and quantities must match');
  }

  const resourceDetails = {};
  const totals = { mass: 0, volume: 0 };

  resourceIds.forEach((resourceId, index) => {
    const config = RESOURCES[Number(resourceId)];
    const quantity = quantities[index];
    const mass = quantity * config.massPerUnit;
    const volume = quantity * config.volumePerUnit;

    totals.mass += mass;
    totals.volume += volume;
    resourceDetails[Number(resourceId)] = {
      name: config.name, quantity, mass, massPerUnit: config.massPerUnit, volume, volumePerUnit: config.volumePerUnit
    };
  });

  return { resources: resourceDetails, totals };
};

/**
 * @param {integer} resourceId
 * @returns Details on the specific resource
 */
export const getResource = (resourceId) => {
  return RESOURCES[resourceId];
};

export default {
  RESOURCES,
  getContents,
  getResource
};
