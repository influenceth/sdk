export const TYPES = {
  0: { name: 'Empty Lot', category: 'Building', capabilities: [], iconVersion: 1, modelVersion: 1 },
  1: { name: 'Warehouse', category: 'Building', capabilities: [ 'construction', 'inventory' ], iconVersion: 1, modelVersion: 1 },
  2: { name: 'Extractor', category: 'Building', capabilities: [ 'construction', 'extraction', 'inventory' ], iconVersion: 1, modelVersion: 1 },
  3: { name: 'Refinery', category: 'Building', capabilities: [ 'construction', 'inventory' ], iconVersion: 1, modelVersion: 1 },
  4: { name: 'Farm', category: 'Building', capabilities: [ 'construction', 'inventory' ], iconVersion: 1, modelVersion: 1 },
  5: { name: 'Factory', category: 'Building', capabilities: [ 'construction', 'inventory' ], iconVersion: 1, modelVersion: 1 },
  6: { name: 'Shipyard', category: 'Building', capabilities: [ 'construction', 'inventory' ], iconVersion: 1, modelVersion: 1 },
  7: { name: 'Spaceport', category: 'Building', capabilities: [ 'construction', 'inventory' ], iconVersion: 1, modelVersion: 1 },
  8: { name: 'Marketplace', category: 'Building', capabilities: [ 'construction', 'inventory' ], iconVersion: 1, modelVersion: 1 },
  9: { name: 'Habitat', category: 'Building', capabilities: [ 'construction', 'inventory' ], iconVersion: 1, modelVersion: 1 }
};

/**
 * @param {integer} capableType The capable type identifier
 * @returns An object with details on the capable type and its capabilities
 */
export const getType = (capableType) => {
  if (TYPES[capableType]) {
    return TYPES[capableType];
  } else {
    throw new Error('Capable type invalid');
  }
};

export default {
  TYPES,
  getType
};
