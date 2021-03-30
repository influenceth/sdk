const MASTER_SEED = 'influence';
const START_TIMESTAMP = 1609459200; // Zero date timestamp for orbits
const MAX_RADIUS = 375142; // in meters
const TOTAL_ASTEROIDS = 250000;
const REGIONS = [ 'MainBelt', 'Trojans' ];
const SPECTRAL_TYPES = [ 'C', 'Cm', 'Ci', 'Cs', 'Cms', 'Cis', 'S', 'Sm', 'Si', 'M', 'I' ];
const BONUS_MAPS = [
  {
    spectralTypes: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ],
    base: { name: 'Yield0', level: 0, modifier: 0, type: 'yield' },
    bonuses: [
      { position: 1, name: 'Yield1', level: 1, modifier: 3, type: 'yield' },
      { position: 2, name: 'Yield2', level: 2, modifier: 6, type: 'yield' },
      { position: 3, name: 'Yield3', level: 3, modifier: 15, type: 'yield' }
    ]
  },
  {
    spectralTypes: [ 0, 1, 2, 3, 4, 5, 8, 10 ],
    base: { name: 'Volatile0', level: 0, modifier: 0, type: 'volatile' },
    bonuses: [
      { position: 4, name: 'Volatile1', level: 1, modifier: 10, type: 'volatile' },
      { position: 5, name: 'Volatile2', level: 2, modifier: 20, type: 'volatile' },
      { position: 6, name: 'Volatile3', level: 3, modifier: 50, type: 'volatile' }
    ]
  },
  {
    spectralTypes: [ 1, 3, 4, 5, 6, 7, 8, 9 ],
    base: { name: 'Metal0', level: 0, modifier: 0, type: 'metal' },
    bonuses: [
      { position: 7, name: 'Metal1', level: 1, modifier: 10, type: 'metal' },
      { position: 8, name: 'Metal2', level: 2, modifier: 20, type: 'metal' },
      { position: 9, name: 'Metal3', level: 3, modifier: 50, type: 'metal' }
    ]
  },
  {
    spectralTypes: [ 0, 1, 2, 3, 4, 5 ],
    base: { name: 'Organic0', level: 0, modifier: 0, type: 'organic' },
    bonuses: [
      { position: 10, name: 'Organic1', level: 1, modifier: 10, type: 'organic' },
      { position: 11, name: 'Organic2', level: 2, modifier: 20, type: 'organic' },
      { position: 12, name: 'Organic3', level: 3, modifier: 50, type: 'organic' }
    ]
  },
  {
    spectralTypes: [ 3, 4, 5, 6, 7, 8 ],
    base: { name: 'RareEarth0', level: 0, modifier: 0, type: 'rareearth' },
    bonuses: [
      { position: 13, name: 'RareEarth3', level: 3, modifier: 30, type: 'rareearth' }
    ]
  },
  {
    spectralTypes: [ 1, 3, 4, 5, 6, 7, 8, 9 ],
    base: { name: 'Fissile0', level: 0, modifier: 0, type: 'fissile' },
    bonuses: [
      { position: 14, name: 'Fissile3', level: 3, modifier: 30, type: 'fissile' }
    ]
  }
];

/**
 * Returns the bonus information based on its position in the bitpacked bonuses int
 * @param num Position in the bitpacked bonuses int
 */
const toBonus = (num) => {
  if (num < 1 || num > 14) return '';
  let bonus;

  for (let b of BONUS_MAPS) {
    bonus = b.bonuses.find(p => p.position === num);
    if (!!bonus) return bonus;
  }
};

/**
 * Converts packed bonuses into an array of bonus types including base types
 * @param spectralType The spectral type (int) of the asteroid
 * @param packed The bitpacked bonuses int
 */
const toBonuses = (packed, spectralType) => {
  if (spectralType === undefined) throw new Error('Spectral type is required');

  const bonuses = [];
  let b, p, added;

  for (b of BONUS_MAPS) {

    if (b.spectralTypes.includes(spectralType)) {
      added = false;

      for (p of b.bonuses) {

        if ((packed & (1 << p.position)) > 0) {
          bonuses.push(p);
          added = true;
        }
      }

      if (!added) bonuses.push(b.base);
    }
  }

  return bonuses;
};

/**
 * Returns whether the asteroid has been scanned based on its bitpacked bonuses int
 * @param packed The bitpacked bonuses int
 */
const isScanned = (packed) => {
  return ((packed & (1 << 0)) > 0);
}

/**
 * Returns the spectral type string based on its array value
 * @param num The spectral type int value
 */
const toSpectralType = (num) => {
  if (num < 0 || num > 10) return '';
  return SPECTRAL_TYPES[num];
};

/**
 * ABIs for client interaction with Influence
 */
const contracts = require('./contracts.json');

module.exports = {
  MASTER_SEED,
  START_TIMESTAMP,
  MAX_RADIUS,
  TOTAL_ASTEROIDS,
  REGIONS,
  SPECTRAL_TYPES,
  toBonus,
  toBonuses,
  isScanned,
  toSpectralType,
  contracts
};
