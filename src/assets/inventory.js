/**
 * mass: grams per unit
 * volume: cubic centimeters per unit
 */
const RESOURCES = {
  1: { name: 'Water', mass: 1000, volume: 1030 },
  2: { name: 'Hydrogen', mass: 1000, volume: 61000 },
  3: { name: 'Ammonia', mass: 1000, volume: 1600 },
  4: { name: 'Nitrogen', mass: 1000, volume: 1200 },
  5: { name: 'Sulfur Dioxide', mass: 1000, volume: 720 },
  6: { name: 'Carbon Dioxide', mass: 1000, volume: 6600 },
  7: { name: 'Carbon Monoxide', mass: 1000, volume: 17000 },
  8: { name: 'Methane', mass: 1000, volume: 28000 },
  9: { name: 'Apatite', mass: 1000, volume: 520 },
  10: { name: 'Bitumen', mass: 1000, volume: 1600 },
  11: { name: 'Calcite', mass: 1000, volume: 620 },
  12: { name: 'Feldspar', mass: 1000, volume: 650 },
  13: { name: 'Olivine', mass: 1000, volume: 620 },
  14: { name: 'Pyroxene', mass: 1000, volume: 480 },
  15: { name: 'Coffinite', mass: 1000, volume: 300 },
  16: { name: 'Merrillite', mass: 1000, volume: 530 },
  17: { name: 'Xenotime', mass: 1000, volume: 350 },
  18: { name: 'Rhabdite', mass: 1000, volume: 230 },
  19: { name: 'Graphite', mass: 1000, volume: 730 },
  20: { name: 'Taenite', mass: 1000, volume: 200 },
  21: { name: 'Troilite', mass: 1000, volume: 370 },
  22: { name: 'Uraninite', mass: 1000, volume: 155 }
};

/**
 * Converts a raw resourceIds / quantities array pair into a resource details set
 * @param resourceIds Array of resourceIds
 * @param quantities Array of quantities
 * @returns An object with a set of resources and a total mass and volume (in tonnes and cubic meters)
 */
export const getResources = (resourceIds, quantities) => {
  const resources = {};
  const totals = { mass: 0, volume: 0 };

  resourceIds.forEach((resourceId, index) => {
    const config = RESOURCES[Number(resourceId)];
    const quantity = quantities[index];
    const massPerUnit = config.mass / 1000 / 1000; // in tonnes
    const volumePerUnit = config.unit / 10000; // in cubic meters
    const mass = quantity * massPerUnit;
    const volume = quantity * volumePerUnit;

    resources[Number(resourceId)] = { name: config.name, quantity, mass, massPerUnit, volume, volumePerUnit };
    totals.mass += mass;
    totals.volume += volume;
  });

  return { resources, totals };
};

export default {
  RESOURCES,
  getResources
};
