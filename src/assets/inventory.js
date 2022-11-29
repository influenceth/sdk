/**
 * Map of resourceIds to details
 * massPerUnit is in tonnes / unit
 * volumePerUnit is in cubic meters / unit
 */
export const RESOURCES = {
  1: { name: 'Water', massPerUnit: 0.001, volumePerUnit: 0.103 },
  2: { name: 'Hydrogen', massPerUnit: 0.001, volumePerUnit: 6.1 },
  3: { name: 'Ammonia', massPerUnit: 0.001, volumePerUnit: 0.16 },
  4: { name: 'Nitrogen', massPerUnit: 0.001, volumePerUnit: 0.12 },
  5: { name: 'Sulfur Dioxide', massPerUnit: 0.001, volumePerUnit: 0.072 },
  6: { name: 'Carbon Dioxide', massPerUnit: 0.001, volumePerUnit: 0.66 },
  7: { name: 'Carbon Monoxide', massPerUnit: 0.001, volumePerUnit: 1.7 },
  8: { name: 'Methane', massPerUnit: 0.001, volumePerUnit: 2.8 },
  9: { name: 'Apatite', massPerUnit: 0.001, volumePerUnit: 0.052 },
  10: { name: 'Bitumen', massPerUnit: 0.001, volumePerUnit: 0.16 },
  11: { name: 'Calcite', massPerUnit: 0.001, volumePerUnit: 0.062 },
  12: { name: 'Feldspar', massPerUnit: 0.001, volumePerUnit: 0.065 },
  13: { name: 'Olivine', massPerUnit: 0.001, volumePerUnit: 0.062 },
  14: { name: 'Pyroxene', massPerUnit: 0.001, volumePerUnit: 0.048 },
  15: { name: 'Coffinite', massPerUnit: 0.001, volumePerUnit: 0.03 },
  16: { name: 'Merrillite', massPerUnit: 0.001, volumePerUnit: 0.053 },
  17: { name: 'Xenotime', massPerUnit: 0.001, volumePerUnit: 0.035 },
  18: { name: 'Rhabdite', massPerUnit: 0.001, volumePerUnit: 0.023 },
  19: { name: 'Graphite', massPerUnit: 0.001, volumePerUnit: 0.073 },
  20: { name: 'Taenite', massPerUnit: 0.001, volumePerUnit: 0.02 },
  21: { name: 'Troilite', massPerUnit: 0.001, volumePerUnit: 0.037 },
  22: { name: 'Uraninite', massPerUnit: 0.001, volumePerUnit: 0.0155 }
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
