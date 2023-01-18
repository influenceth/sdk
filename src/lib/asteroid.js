import { hash } from 'starknet';
import { multiply, dot } from 'mathjs';
import procedural from '../utils/procedural.js';
import { recursiveSNoise } from '../utils/simplex.js';
import { SIMPLEX_DISTRIBUTION } from '../constants.js';

export const BONUS_MAPS = [
  {
    spectralTypes: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    base: { name: 'Yield0', level: 0, modifier: 0, type: 'yield' },
    bonuses: [
      { position: 1, name: 'Yield1', level: 1, modifier: 3, type: 'yield' },
      { position: 2, name: 'Yield2', level: 2, modifier: 6, type: 'yield' },
      { position: 3, name: 'Yield3', level: 3, modifier: 15, type: 'yield' }
    ]
  },
  {
    spectralTypes: [0, 1, 2, 3, 4, 5, 8, 10],
    base: { name: 'Volatile0', level: 0, modifier: 0, type: 'volatile' },
    bonuses: [
      { position: 4, name: 'Volatile1', level: 1, modifier: 10, type: 'volatile' },
      { position: 5, name: 'Volatile2', level: 2, modifier: 20, type: 'volatile' },
      { position: 6, name: 'Volatile3', level: 3, modifier: 50, type: 'volatile' }
    ]
  },
  {
    spectralTypes: [1, 3, 4, 5, 6, 7, 8, 9],
    base: { name: 'Metal0', level: 0, modifier: 0, type: 'metal' },
    bonuses: [
      { position: 7, name: 'Metal1', level: 1, modifier: 10, type: 'metal' },
      { position: 8, name: 'Metal2', level: 2, modifier: 20, type: 'metal' },
      { position: 9, name: 'Metal3', level: 3, modifier: 50, type: 'metal' }
    ]
  },
  {
    spectralTypes: [0, 1, 2, 3, 4, 5],
    base: { name: 'Organic0', level: 0, modifier: 0, type: 'organic' },
    bonuses: [
      { position: 10, name: 'Organic1', level: 1, modifier: 10, type: 'organic' },
      { position: 11, name: 'Organic2', level: 2, modifier: 20, type: 'organic' },
      { position: 12, name: 'Organic3', level: 3, modifier: 50, type: 'organic' }
    ]
  },
  {
    spectralTypes: [3, 4, 5, 6, 7, 8],
    base: { name: 'RareEarth0', level: 0, modifier: 0, type: 'rareearth' },
    bonuses: [
      { position: 13, name: 'RareEarth3', level: 3, modifier: 30, type: 'rareearth' }
    ]
  },
  {
    spectralTypes: [1, 3, 4, 5, 6, 7, 8, 9],
    base: { name: 'Fissile0', level: 0, modifier: 0, type: 'fissile' },
    bonuses: [
      { position: 14, name: 'Fissile3', level: 3, modifier: 30, type: 'fissile' }
    ]
  }
];

export const FREE_TRANSPORT_RADIUS = 5; // in km
export const MAX_RADIUS = 375142; // in meters
export const RARITIES = ['Common', 'Uncommon', 'Rare', 'Superior', 'Exceptional', 'Incomparable'];
export const REGIONS = ['MainBelt', 'Trojans'];
export const SIZES = ['Small', 'Medium', 'Large', 'Huge'];
export const SPECTRAL_TYPES = {
  0: { name: 'C', resources: [1, 6, 7, 8, 9, 10, 11] },
  1: { name: 'Cm', resources: [1, 6, 7, 8, 9, 10, 11, 18, 19, 20, 21, 22] },
  2: { name: 'Ci', resources: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] },
  3: { name: 'Cs', resources: [1, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17] },
  4: { name: 'Cms', resources: [1, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22] },
  5: { name: 'Cis', resources: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17] },
  6: { name: 'S', resources: [12, 13, 14, 15, 16, 17] },
  7: { name: 'Sm', resources: [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22] },
  8: { name: 'Si', resources: [1, 2, 3, 4, 5, 6, 7, 8, 12, 13, 14, 15, 16, 17] },
  9: { name: 'M', resources: [18, 19, 20, 21, 22] },
  10: { name: 'I', resources: [1, 2, 3, 4, 5, 6, 7, 8] }
};

// Constants defining resource distribution maps
const NOISE_STEP_WEIGHT = [
  0.0000000000000, // 1 -> 1
  0.6101823028867, // 2 -> 1
  0.8229127977102, // 3 -> 1
  0.9154024275287, // 4 -> 1
  0.9611609377604, // 5 -> 1
  0.9833976243208, // 6 -> 1
  0.9946991129726, // 7 -> 1
  1.0000000000000 // 8 -> 1
];

const OCTAVE_STEP_MOD = 2.39435907268;
const PHI = Math.PI * (3 - Math.sqrt(5));
const RESOURCE_OCTAVE_MUL = 5;
const RESOURCE_OCTAVE_BASE = 3;
const RESOURCE_SIZE_MUL = 0.75;
const RESOURCE_SIZE_BASE = 0.375;
const SCANNING_TIME = 3600; // seconds
const TOTAL_ASTEROIDS = 250000;

/**
 * Returns the resource abundance at a specific lot
 * @param asteroidId The asteroid identifier
 * @param asteroidSeed The seed generated during resource scanning
 * @param lotId The lot identifier (1-indexed)
 * @param resourceId The resource identifier (from Inventory lib)
 * @param abundance Asteroid-wide abundance for the given resource [0, 1]
 */
export const getAbundanceAtLot = (asteroidId, asteroidSeed, lotId, resourceId, abundance) => {
  const settings = getAbundanceMapSettings(asteroidId, asteroidSeed, resourceId, abundance);
  const point = getLotPosition(asteroidId, lotId);
  return getAbundanceAtPosition(point, settings);
};

/**
 * Returns the resource abundance at an arbitray x,y,z position (pre-calculated)
 * @param point Array of x, y, z positions on unit sphere for the lot (getLotPosition)
 * @param settings Settings derived from getResourceMapSettings
 */
export const getAbundanceAtPosition = (point, settings) => {

  // If noise cutoffs are the same, abundance is 0 so return that now
  // instead of trying to stretch noise to infinity.
  if (settings.upperCutoff == settings.lowerCutoff) {
    return 0;
  }

  point = point.map((v, i) => v * settings.pointScale + settings.pointShift[i]);
  let noise = recursiveSNoise(point, 0.5, settings.octaves);
  noise = 0.5 * noise + 0.5;

  // Scale noise value between cutoff and the upper cutoff and return
  const aboveCutoff = noise < settings.lowerCutoff ? 0 : 1;
  const scaled = (noise - settings.lowerCutoff) / (settings.upperCutoff - settings.lowerCutoff);
  const abundance = Math.min(scaled * aboveCutoff, 1); // clamp to a max of 1.0
  return abundance;
};

/**
 * Returns a set of settings / configs to be utilized in generating resource heatmaps
 * @param asteroidId The asteroid identifier
 * @param asteroidSeed The random asteroid seed from scanning (not derived solely from asteroidId)
 * @param resourceId The resource identifier
 * @param abundance The relative abundance (0 to 1)
 */
export const getAbundanceMapSettings = (asteroidId, asteroidSeed, resourceId, abundance) => {
  const radius = getRadius(asteroidId);
  const radiusRatio = radius * 1000 / MAX_RADIUS;
  const octaves = RESOURCE_OCTAVE_BASE + Math.floor(RESOURCE_OCTAVE_MUL * Math.pow(radiusRatio, 1 / 3));
  const pointScale = RESOURCE_SIZE_BASE + (RESOURCE_SIZE_MUL * radiusRatio);

  const resourceSeed = hash.pedersen([BigInt(asteroidSeed), BigInt(resourceId)]);
  const xSeed = hash.pedersen([BigInt(resourceSeed), 1n]);
  const ySeed = hash.pedersen([BigInt(resourceSeed), 2n]);
  const zSeed = hash.pedersen([BigInt(resourceSeed), 3n]);

  let lowShift = -5;
  let highShift = 5;

  let xShift = procedural.realBetween(xSeed, lowShift, highShift);
  let yShift = procedural.realBetween(ySeed, lowShift, highShift);
  let zShift = procedural.realBetween(zSeed, lowShift, highShift);

  // Get simplex distribution based settings
  const cutoffFrac = abundance * 2;
  const cutoffSingle = _getSimplexDist(cutoffFrac);
  let fullStep = (0.5 - cutoffSingle) / OCTAVE_STEP_MOD;
  let partialStep = fullStep * NOISE_STEP_WEIGHT[octaves - 1];
  const lowerCutoff = 1 - cutoffSingle - partialStep;

  const cutoffZero = _getSimplexDist(0);
  fullStep = (0.5 - cutoffZero) / OCTAVE_STEP_MOD;
  partialStep = fullStep * NOISE_STEP_WEIGHT[octaves - 1];
  const upperCutoff = 1 - cutoffZero - partialStep;

  return { octaves, lowerCutoff, upperCutoff, pointScale, pointShift: [xShift, yShift, zShift] };
};

/**
 * Returns the bonus information based on its position in the bitpacked bonuses int
 * @param num Position in the bitpacked bonuses int
 */
export const getBonus = (num) => {
  if (num < 1 || num > 14) return '';
  let bonus;

  for (const b of BONUS_MAPS) {
    bonus = b.bonuses.find(p => p.position === num);
    if (bonus?.position) return bonus;
  }
};

/**
 * Converts packed bonuses into an array of bonus types including base types
 * @param spectralType The spectral type (int) of the asteroid
 * @param packed The bitpacked bonuses int
 */
export const getBonuses = (packed, spectralType) => {
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
 * Calculates the distance (along surface of a sphere) between two lots on an asteroid
 * @param {integer} asteroidId The asteroid identifier
 * @param {integer} originLotIdThe starting lot identifier
 * @param {integer} destLotId The ending lot identifier
 * @return Distance in km
 */
export const getLotDistance = (asteroidId, originLotId, destLotId) => {
  const radius = getRadius(asteroidId);
  const numLots = getSurfaceArea(asteroidId, radius);
  const origin = multiply(getLotPosition(asteroidId, originLotId, numLots), radius);
  const dest = multiply(getLotPosition(asteroidId, destLotId, numLots), radius);
  return radius * Math.acos(dot(origin, dest) / (radius * radius));
};

/**
 * Returns the Cartesian position of a lot on a (spherical) asteroid
 * @param asteroidId The asteroid identifier
 * @param lotId The lot identifier
 * @param numLots Optional area / number of lots param (if precalculated)
 */
export const getLotPosition = (asteroidId, lotId, numLots = 0) => {
  const theta = PHI * (lotId - 1);
  numLots = numLots || getSurfaceArea(asteroidId);
  const lotFrac = (lotId - 1) / (numLots - 1);
  const y = 1 - (lotFrac * 2);
  const radius = Math.sqrt(1 - y * y); // radius at y
  const x = radius * Math.cos(theta);
  const z = radius * Math.sin(theta);
  return [x, y, z];
};

/**
 * Calculates the travel time between two lots considering an overall crew bonus
 * @param {integer} asteroidId The asteroid identifier
 * @param {integer} originLotIdThe starting lot identifier
 * @param {integer} destLotId The ending lot identifier
 * @param {float} totalBonus
 * @return Travel time in seconds
 */
export const getLotTravelTime = (asteroidId, originLotId, destLotId, totalBonus = 1) => {
  const distance = getLotDistance(asteroidId, originLotId, destLotId);
  const time = distance <= FREE_TRANSPORT_RADIUS * totalBonus ? 0 : Math.ceil(distance * 60 / totalBonus);
  return time;
};

/**
 * Returns the (spherical) asteroid radius in km
 * @param asteroidId The asteroid identifier
 */
export const getRadius = (asteroidId) => {
  return MAX_RADIUS / 1000 / Math.pow(asteroidId, 0.475)
};

/**
 * Returns the rarity level of the asteroid based on the set of scanned bonuses
 * @param bonuses Array of bonus objects
 */
const getRarity = (bonuses) => {
  let rarity = 0;

  for (const b of bonuses) {
    rarity += b.level;
  }

  if (rarity <= 3) return RARITIES[rarity];
  if (rarity <= 5) return RARITIES[4];
  return RARITIES[5];
};

/**
 * Returns whether the asteroid has been scanned based on its bitpacked bonuses int
 * @param packed The bitpacked bonuses int
 */
export const getScanned = (packed) => {
  return ((packed & (1 << 0)) > 0);
};

/**
 * Returns the size string based on the asteroid radius
 * @param radius The asteroid radius in meters
 */
export const getSize = (radius) => {
  if (radius <= 5000) return SIZES[0];
  if (radius <= 20000) return SIZES[1];
  if (radius <= 50000) return SIZES[2];
  return SIZES[3];
};

/**
 * @param spectralTypeId The spectral type identifier (1-11)
 * Returns the spectral type details including a name attribute
 */
export const getSpectralType = (spectralTypeId) => {
  if (SPECTRAL_TYPES[spectralTypeId]) return SPECTRAL_TYPES[spectralTypeId];
  throw new Error('Invalid spectral type');
};

/**
 * Calculate the total (spherical) surface area in square km of an asteroid (rounded down)
 * @param asteroidId The asteroid identifier
 * @param radius Optional radius in km
 */
const getSurfaceArea = (asteroidId, radius = 0) => {
  radius = radius || getRadius(asteroidId);
  const area = 4 * Math.PI * Math.pow(radius, 2);
  return Math.floor(area);
};

const _getSimplexDist = (percentile) => {
  const upperHalf = percentile > 0.5;
  if (upperHalf) percentile = 1 - percentile;
  const lower = Math.floor(percentile * 100);
  const upper = Math.ceil(percentile * 100);
  const lowerDist = SIMPLEX_DISTRIBUTION[lower];
  const upperDist = SIMPLEX_DISTRIBUTION[upper];
  const fracPerc = (percentile * 100) - Math.floor(percentile * 100);
  let result = lowerDist + fracPerc * (upperDist - lowerDist);
  if (upperHalf) result = 1 - result;
  return result;
};

export default {
  BONUS_MAPS,
  MAX_RADIUS,
  RARITIES,
  REGIONS,
  SCANNING_TIME,
  SIZES,
  SPECTRAL_TYPES,
  TOTAL_ASTEROIDS,
  getAbundanceAtLot,
  getAbundanceAtPosition,
  getAbundanceMapSettings,
  getBonus,
  getBonuses,
  getLotDistance,
  getLotPosition,
  getLotTravelTime,
  getRadius,
  getRarity,
  getScanned,
  getSize,
  getSpectralType,
  getSurfaceArea
};
