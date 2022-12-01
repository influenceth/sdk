export const TYPES = {
  1: { name: 'Warehouse', category: 'Building', capabilities: [ 'construction', 'inventory' ] },
  2: { name: 'Extractor', category: 'Building', capabilities: [ 'construction', 'extraction', 'inventory' ] },
  3: { name: 'Refinery', category: 'Building', capabilities: [ 'construction', 'inventory' ] },
  4: { name: 'Farm', category: 'Building', capabilities: [ 'construction', 'inventory' ] },
  5: { name: 'Factory', category: 'Building', capabilities: [ 'construction', 'inventory' ] },
  6: { name: 'Shipyard', category: 'Building', capabilities: [ 'construction', 'inventory' ] },
  7: { name: 'Spaceport', category: 'Building', capabilities: [ 'construction', 'inventory' ] },
  8: { name: 'Marketplace', category: 'Building', capabilities: [ 'construction', 'inventory' ] },
  9: { name: 'Habitat', category: 'Building', capabilities: [ 'construction', 'inventory' ] }
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
