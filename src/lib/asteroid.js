import { ec } from 'starknet';
import { multiply, dot } from 'mathjs';
import { ethers } from 'ethers';

import procedural from '../utils/procedural.js';
import { recursiveSNoise } from '../utils/simplex.js';
import { SIMPLEX_POLY_FIT } from '../constants.js';
import Product from './product.js';

/**
 * Constants
 */
const FREE_TRANSPORT_RADIUS = 5; // km
const MAX_RADIUS = 375.142; // km
const MAX_LOT_REGIONS = 5000;
const RARITIES = ['Common', 'Uncommon', 'Rare', 'Superior', 'Exceptional', 'Incomparable'];
const SCAN_STATUSES = {
  UNSCANNED: 0,
  SURFACE_SCANNING: 1,
  SURFACE_SCANNED: 2,
  RESOURCE_SCANNING: 3,
  RESOURCE_SCANNED: 4
};

const SCANNING_TIME = 3600; // seconds
const SIZES = ['Small', 'Medium', 'Large', 'Huge'];
const TOTAL_ASTEROIDS = 250000;

const SPECTRAL_IDS = {
  C_TYPE: 1,
  CM_TYPE: 2,
  CI_TYPE: 3,
  CS_TYPE: 4,
  CMS_TYPE: 5,
  CIS_TYPE: 6,
  S_TYPE: 7,
  SM_TYPE: 8,
  SI_TYPE: 9,
  M_TYPE: 10,
  I_TYPE: 11
};

const SPECTRAL_TYPES = {
  [SPECTRAL_IDS.C_TYPE]: {
    name: 'C',
    density: 1.4,
    resources: [
      Product.IDS.WATER,
      Product.IDS.CARBON_DIOXIDE,
      Product.IDS.CARBON_MONOXIDE,
      Product.IDS.METHANE,
      Product.IDS.APATITE,
      Product.IDS.BITUMEN,
      Product.IDS.CALCITE
    ]
  },
  [SPECTRAL_IDS.CM_TYPE]: {
    name: 'Cm',
    density: 3.35,
    resources: [
      Product.IDS.WATER,
      Product.IDS.CARBON_DIOXIDE,
      Product.IDS.CARBON_MONOXIDE,
      Product.IDS.METHANE,
      Product.IDS.APATITE,
      Product.IDS.BITUMEN,
      Product.IDS.CALCITE,
      Product.IDS.RHABDITE,
      Product.IDS.GRAPHITE,
      Product.IDS.TAENITE,
      Product.IDS.TROILITE,
      Product.IDS.URANINITE
    ]
  },
  [SPECTRAL_IDS.CI_TYPE]: {
    name: 'Ci',
    density: 1.6,
    resources: [
      Product.IDS.WATER,
      Product.IDS.HYDROGEN,
      Product.IDS.AMMONIA,
      Product.IDS.NITROGEN,
      Product.IDS.SULFUR_DIOXIDE,
      Product.IDS.CARBON_DIOXIDE,
      Product.IDS.CARBON_MONOXIDE,
      Product.IDS.METHANE,
      Product.IDS.APATITE,
      Product.IDS.BITUMEN,
      Product.IDS.CALCITE
    ]
  },
  [SPECTRAL_IDS.CS_TYPE]: {
    name: 'Cs',
    density: 2.05,
    resources: [
      Product.IDS.WATER,
      Product.IDS.CARBON_DIOXIDE,
      Product.IDS.CARBON_MONOXIDE,
      Product.IDS.METHANE,
      Product.IDS.APATITE,
      Product.IDS.BITUMEN,
      Product.IDS.CALCITE,
      Product.IDS.FELDSPAR,
      Product.IDS.OLIVINE,
      Product.IDS.PYROXENE,
      Product.IDS.COFFINITE,
      Product.IDS.MERRILLITE,
      Product.IDS.XENOTIME
    ]
  },
  [SPECTRAL_IDS.CMS_TYPE]: {
    name: 'Cms',
    density: 3.13333333333333333333333333,
    resources: [
      Product.IDS.WATER,
      Product.IDS.CARBON_DIOXIDE,
      Product.IDS.CARBON_MONOXIDE,
      Product.IDS.METHANE,
      Product.IDS.APATITE,
      Product.IDS.BITUMEN,
      Product.IDS.CALCITE,
      Product.IDS.FELDSPAR,
      Product.IDS.OLIVINE,
      Product.IDS.PYROXENE,
      Product.IDS.COFFINITE,
      Product.IDS.MERRILLITE,
      Product.IDS.XENOTIME,
      Product.IDS.RHABDITE,
      Product.IDS.GRAPHITE,
      Product.IDS.TAENITE,
      Product.IDS.TROILITE,
      Product.IDS.URANINITE
    ]
  },
  [SPECTRAL_IDS.CIS_TYPE]: {
    name: 'Cis',
    density: 1.66666666666666666666666667,
    resources: [
      Product.IDS.WATER,
      Product.IDS.HYDROGEN,
      Product.IDS.AMMONIA,
      Product.IDS.NITROGEN,
      Product.IDS.SULFUR_DIOXIDE,
      Product.IDS.CARBON_DIOXIDE,
      Product.IDS.CARBON_MONOXIDE,
      Product.IDS.METHANE,
      Product.IDS.APATITE,
      Product.IDS.BITUMEN,
      Product.IDS.CALCITE,
      Product.IDS.FELDSPAR,
      Product.IDS.OLIVINE,
      Product.IDS.PYROXENE,
      Product.IDS.COFFINITE,
      Product.IDS.MERRILLITE,
      Product.IDS.XENOTIME
    ]
  },
  [SPECTRAL_IDS.S_TYPE]: {
    name: 'S',
    density: 2.7,
    resources: [
      Product.IDS.FELDSPAR,
      Product.IDS.OLIVINE,
      Product.IDS.PYROXENE,
      Product.IDS.COFFINITE,
      Product.IDS.MERRILLITE,
      Product.IDS.XENOTIME
    ]
  },
  [SPECTRAL_IDS.SM_TYPE]: {
    name: 'Sm',
    density: 4,
    resources: [
      Product.IDS.FELDSPAR,
      Product.IDS.OLIVINE,
      Product.IDS.PYROXENE,
      Product.IDS.COFFINITE,
      Product.IDS.MERRILLITE,
      Product.IDS.XENOTIME,
      Product.IDS.RHABDITE,
      Product.IDS.GRAPHITE,
      Product.IDS.TAENITE,
      Product.IDS.TROILITE,
      Product.IDS.URANINITE
    ]
  },
  [SPECTRAL_IDS.SI_TYPE]: {
    name: 'Si',
    density: 1.8,
    resources: [
      Product.IDS.WATER,
      Product.IDS.HYDROGEN,
      Product.IDS.AMMONIA,
      Product.IDS.NITROGEN,
      Product.IDS.SULFUR_DIOXIDE,
      Product.IDS.CARBON_DIOXIDE,
      Product.IDS.CARBON_MONOXIDE,
      Product.IDS.METHANE,
      Product.IDS.FELDSPAR,
      Product.IDS.OLIVINE,
      Product.IDS.PYROXENE,
      Product.IDS.COFFINITE,
      Product.IDS.MERRILLITE,
      Product.IDS.XENOTIME
    ]
  },
  [SPECTRAL_IDS.M_TYPE]: {
    name: 'M',
    density: 5.3,
    resources: [
      Product.IDS.RHABDITE,
      Product.IDS.GRAPHITE,
      Product.IDS.TAENITE,
      Product.IDS.TROILITE,
      Product.IDS.URANINITE
    ]
  },
  [SPECTRAL_IDS.I_TYPE]: {
    name: 'I',
    density: 0.9,
    resources: [
      Product.IDS.WATER,
      Product.IDS.HYDROGEN,
      Product.IDS.AMMONIA,
      Product.IDS.NITROGEN,
      Product.IDS.SULFUR_DIOXIDE,
      Product.IDS.CARBON_DIOXIDE,
      Product.IDS.CARBON_MONOXIDE,
      Product.IDS.METHANE
    ]
  }
};

const getProductCategorySpectralTypes = (category) => {
  const categoryProducts = Product.getListByCategory(category);
  return Object.values(SPECTRAL_IDS)
    .filter((i) => !!SPECTRAL_TYPES[i].resources.find((r) => categoryProducts.includes(r)));
};

const BONUS_IDS = {
  YIELD_1: 1,
  YIELD_2: 2,
  YIELD_3: 3,
  VOLATILE_1: 4,
  VOLATILE_2: 5,
  VOLATILE_3: 6,
  METAL_1: 7,
  METAL_2: 8,
  METAL_3: 9,
  ORGANIC_1: 10,
  ORGANIC_2: 11,
  ORGANIC_3: 12,
  RARE_EARTH: 13,
  FISSILE: 14
};
const BONUS_MAPS = [
  {
    spectralTypes: [...Object.values(SPECTRAL_IDS)],
    resourceIds: Product.getListByClassification(Product.CLASSIFICATIONS.RAW_MATERIAL),
    base: { name: 'Yield0', level: 0, modifier: 0, type: 'yield' },
    bonuses: [
      { position: BONUS_IDS.YIELD_1, name: 'Yield1', level: 1, modifier: 3, type: 'yield' },
      { position: BONUS_IDS.YIELD_2, name: 'Yield2', level: 2, modifier: 6, type: 'yield' },
      { position: BONUS_IDS.YIELD_3, name: 'Yield3', level: 3, modifier: 15, type: 'yield' }
    ]
  },
  {
    spectralTypes: getProductCategorySpectralTypes(Product.CATEGORIES.VOLATILE),
    resourceIds: Product.getListByCategory(Product.CATEGORIES.VOLATILE),
    base: { name: 'Volatile0', level: 0, modifier: 0, type: 'volatile' },
    bonuses: [
      { position: BONUS_IDS.VOLATILE_1, name: 'Volatile1', level: 1, modifier: 10, type: 'volatile' },
      { position: BONUS_IDS.VOLATILE_2, name: 'Volatile2', level: 2, modifier: 20, type: 'volatile' },
      { position: BONUS_IDS.VOLATILE_3, name: 'Volatile3', level: 3, modifier: 50, type: 'volatile' }
    ]
  },
  {
    spectralTypes: getProductCategorySpectralTypes(Product.CATEGORIES.METAL),
    resourceIds: Product.getListByCategory(Product.CATEGORIES.METAL),
    base: { name: 'Metal0', level: 0, modifier: 0, type: 'metal' },
    bonuses: [
      { position: BONUS_IDS.METAL_1, name: 'Metal1', level: 1, modifier: 10, type: 'metal' },
      { position: BONUS_IDS.METAL_2, name: 'Metal2', level: 2, modifier: 20, type: 'metal' },
      { position: BONUS_IDS.METAL_3, name: 'Metal3', level: 3, modifier: 50, type: 'metal' }
    ]
  },
  {
    spectralTypes: getProductCategorySpectralTypes(Product.CATEGORIES.ORGANIC),
    resourceIds: Product.getListByCategory(Product.CATEGORIES.ORGANIC),
    base: { name: 'Organic0', level: 0, modifier: 0, type: 'organic' },
    bonuses: [
      { position: BONUS_IDS.ORGANIC_1, name: 'Organic1', level: 1, modifier: 10, type: 'organic' },
      { position: BONUS_IDS.ORGANIC_2, name: 'Organic2', level: 2, modifier: 20, type: 'organic' },
      { position: BONUS_IDS.ORGANIC_3, name: 'Organic3', level: 3, modifier: 50, type: 'organic' }
    ]
  },
  {
    spectralTypes: getProductCategorySpectralTypes(Product.CATEGORIES.RARE_EARTH),
    resourceIds: Product.getListByCategory(Product.CATEGORIES.RARE_EARTH),
    base: { name: 'RareEarth0', level: 0, modifier: 0, type: 'rareearth' },
    bonuses: [
      { position: BONUS_IDS.RARE_EARTH, name: 'RareEarth3', level: 3, modifier: 30, type: 'rareearth' }
    ]
  },
  {
    spectralTypes: getProductCategorySpectralTypes(Product.CATEGORIES.FISSILE),
    resourceIds: Product.getListByCategory(Product.CATEGORIES.FISSILE),
    base: { name: 'Fissile0', level: 0, modifier: 0, type: 'fissile' },
    bonuses: [
      { position: BONUS_IDS.FISSILE, name: 'Fissile3', level: 3, modifier: 30, type: 'fissile' }
    ]
  }
];

/**
 * Getters and utils
 */

const PHI = Math.PI * (3 - Math.sqrt(5));
const TWO_PI = 2 * Math.PI;
const RESOURCE_OCTAVE_MUL = 5;
const RESOURCE_OCTAVE_BASE = 3;
const RESOURCE_SIZE_MUL = 0.75;
const RESOURCE_SIZE_BASE = 0.375;

const getAngleDiff = (angle1, angle2) => {
  const a1 = angle1 >= 0 ? angle1 : (angle1 + TWO_PI);
  const a2 = angle2 >= 0 ? angle2 : (angle2 + TWO_PI);
  const diff = Math.abs(a1 - a2) % TWO_PI;
  return diff > Math.PI ? (TWO_PI - diff) : diff;
};

const normalizeVector = (v3) => {
  const mult = 1 / (Math.sqrt(v3[0] * v3[0] + v3[1] * v3[1] + v3[2] * v3[2]) || 1);
  return v3.map((x) => x * mult);
};

const Entity = {};
const Component = {};

const getBaseName = (asteroidId, spectralType) => {
  return `${asteroidId}-${getSpectralType(spectralType).toUpperCase()}`;
};
Entity.getBaseName = (asteroid) => getBaseName(asteroid.id, asteroid.Celestial?.celestialType);

/**
 * Returns the (spherical) asteroid radius in km
 * @param asteroidId The asteroid identifier
 */
const getRadius = (asteroidId) => {
  return MAX_RADIUS / Math.pow(asteroidId, 0.475);
};
Component.getRadius = (celestial) => celestial.radius;
Entity.getRadius = (asteroid) => asteroid.Celestial ? Component.getRadius(asteroid.Celestial) : getRadius(asteroid.id);

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
Component.getSurfaceArea = (celestial) => getSurfaceArea(null, celestial.radius);
Entity.getSurfaceArea = (asteroid) => Component.getSurfaceArea(asteroid.Celestial);

/**
 * Converts packed abundances into an object with resource ids as keys and abundances as values
 * @param packed The bitpacked abundances BigInt
 */
const getAbundances = (packed) => {
  const stride = 10n;
  const strideExp = 2n ** stride;

  let local = BigInt(packed) + 0n;
  const abundances = {};
  const rawMaterials = Product.getListByClassification(Product.CLASSIFICATIONS.RAW_MATERIAL);
  for (let i = 1; i <= rawMaterials.length; i++) {
    abundances[i] = parseInt(local % strideExp) / 1000;
    local = local >> stride;
  }
  return abundances;
};
Component.getAbundances = (celestial) => getAbundances(celestial.abundances);
Entity.getAbundances = (asteroid) => Component.getAbundances(asteroid.Celestial);

/**
 * Returns the bonus information based on its position in the bitpacked bonuses int
 * @param num Position in the bitpacked bonuses int
 */
const getBonus = (num) => {
  if (num < 1 || num > 14) return '';
  let bonus;

  for (const b of BONUS_MAPS) {
    bonus = b.bonuses.find(p => p.position === num);
    if (bonus?.position) return bonus;
  }
};

/**
 * Converts packed bonuses into an array of bonus types including base types
 * @param packed The bitpacked bonuses int
 * @param spectralType The spectral type (int) of the asteroid
 */
const getBonuses = (packed, spectralType) => {
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
Component.getBonuses = (celestial) => getBonuses(celestial.bonuses, celestial.celestialType);
Entity.getBonuses = (asteroid) => Component.getBonuses(asteroid.Celestial);

/**
 * Gets the bonus for a specific resource
 * @param bonuses The unpacked bonuses for the asteroid
 * @param resourceId The resource identifier
 */
const getBonusByResource = (bonuses, resourceId) => {
  let multiplier = 1;
  const matches = [];

  bonuses.forEach(bonus => {
    const found = BONUS_MAPS.find(v => {
      return v.base.type === bonus.type && v.resourceIds.includes(resourceId);
    });
    if (found) {
      multiplier *= (100 + bonus.modifier) / 100;
      matches.push(bonus);
    }
  });

  return { bonuses: matches, totalBonus: multiplier };
};
Component.getBonusByResource = (celestial, resourceId) => {
  return getBonusByResource(Component.getBonuses(celestial), resourceId);
};

Entity.getBonusByResource = (asteroid, resourceId) => Component.getBonusByResource(asteroid.Celestial, resourceId);

/**
 * Returns the rarity level of the asteroid based on the set of scanned bonuses
 * @param bonuses Array of bonus objects
 */
const getRarity = (bonuses = []) => {
  let rarity = 0;

  for (const b of bonuses) {
    rarity += b.level;
  }

  if (rarity <= 3) return RARITIES[rarity];
  if (rarity <= 5) return RARITIES[4];
  return RARITIES[5];
};
Component.getRarity = (celestial) => getRarity(Component.getBonuses(celestial));
Entity.getRarity = (asteroid) => Component.getRarity(asteroid.Celestial);

/**
 * Calculates the mass of the asteroid in tonnes
 * @param spectralType See SPECTRAL_TYPES
 * @param radius in km
 * @returns Mass in tonnes
 */
const getMass = (spectralType, radius) => {
  const density = SPECTRAL_TYPES[spectralType].density * Math.pow(1000, 3); // tonnes / km3
  const volume = 4 / 3 * Math.PI * Math.pow(radius, 3); // km3
  return density * volume;
};
Component.getMass = (celestial) => getMass(celestial.celestialType, celestial.radius);
Entity.getMass = (asteroid) => Component.getMass(asteroid.Celestial);

/**
 * Returns the size string based on the asteroid radius
 * @param radius The asteroid radius in km
 */
const getSize = (radius) => {
  if (radius <= 5) return SIZES[0];
  if (radius <= 20) return SIZES[1];
  if (radius <= 50) return SIZES[2];
  return SIZES[3];
};
Component.getSize = (celestial) => getSize(celestial.radius);
Entity.getSize = (asteroid) => Component.getSize(asteroid.Celestial);

/**
 * @param spectralTypeId The spectral type identifier (1-11)
 * Returns the spectral type details including a name attribute
 */
const getSpectralType = (spectralTypeId) => {
  return SPECTRAL_TYPES[spectralTypeId]?.name || '';
};
Component.getSpectralType = (celestial) => getSpectralType(celestial.celestialType);
Entity.getSpectralType = (asteroid) => Component.getSpectralType(asteroid.Celestial);

/**
 * Returns whether the asteroid has been scanned based on its bitpacked bonuses int
 * @param packed The bitpacked bonuses int
 */
const getScanned = (packed) => {
  return ((packed & (1 << 0)) > 0);
};
Component.getScanned = (celestial) => getScanned(celestial.bonuses);
Entity.getScanned = (asteroid) => Component.getScanned(asteroid.Celestial);

const getSeed = (asteroidId) => {
  const masterSeed = ethers.encodeBytes32String('influence');
  return ethers.solidityPackedSha256(['bytes32', 'uint256'], [masterSeed, asteroidId]);
};
Entity.getSeed = (asteroid) => getSeed(asteroid.id);

/**
 * Returns the resource abundance at a specific lot
 * @param asteroidId The asteroid identifier
 * @param asteroidSeed The seed generated during resource scanning
 * @param lotId The lot identifier (1-indexed)
 * @param resourceId The resource identifier (from Inventory lib)
 * @param abundance Asteroid-wide abundance for the given resource [0, 1]
 */
const getAbundanceAtLot = (asteroidId, asteroidSeed, lotId, resourceId, abundance) => {
  const settings = getAbundanceMapSettings(asteroidId, asteroidSeed, resourceId, abundance);
  const point = getLotPosition(asteroidId, lotId);
  return getAbundanceAtPosition(point, settings);
};

/**
 * Returns the resource abundance at an arbitray x,y,z position (pre-calculated)
 * @param point Array of x, y, z positions on unit sphere for the lot (getLotPosition)
 * @param settings Settings derived from getResourceMapSettings
 */
const getAbundanceAtPosition = (point, settings) => {
  if (settings.abundance === 0) return 0;

  point = point.map((v, i) => v * settings.pointScale + settings.pointShift[i]);
  let noise = recursiveSNoise(point, 0.5, settings.octaves);
  noise = 0.5 * noise + 0.5;

  // Get percentile of noise based on poly fits
  let percentile = 0;

  for (let i = 0; i < settings.polyParams.length; i++) {
    percentile += settings.polyParams[i] * Math.pow(noise, i);
  }

  // Scale and clamp abundance to [0,1] then add half the base abundance as a floor
  let abundance = (percentile + settings.abundance - 1.0) / settings.abundance;
  abundance = Math.min(Math.max(abundance, 0), 1);
  const abundanceFloor = settings.abundance / 2;
  abundance = abundance * (1.0 - abundanceFloor) + abundanceFloor;

  return abundance;
};

/**
 * Returns a set of settings / configs to be utilized in generating resource heatmaps
 * @param asteroidId The asteroid identifier
 * @param asteroidSeed The random asteroid seed from scanning (not derived solely from asteroidId)
 * @param resourceId The resource identifier
 * @param abundance The relative abundance (0 to 1)
 */
const getAbundanceMapSettings = (asteroidId, asteroidSeed, resourceId, abundance) => {
  const radius = getRadius(asteroidId);
  const radiusRatio = radius / MAX_RADIUS;
  const octaves = RESOURCE_OCTAVE_BASE + Math.floor(RESOURCE_OCTAVE_MUL * Math.pow(radiusRatio, 1 / 3));
  const pointScale = RESOURCE_SIZE_BASE + (RESOURCE_SIZE_MUL * radiusRatio);
  const polyParams = SIMPLEX_POLY_FIT[octaves];

  const resourceSeed = ec.starkCurve.pedersen(BigInt(asteroidSeed), BigInt(resourceId));
  const xSeed = ec.starkCurve.pedersen(BigInt(resourceSeed), 1n);
  const ySeed = ec.starkCurve.pedersen(BigInt(resourceSeed), 2n);
  const zSeed = ec.starkCurve.pedersen(BigInt(resourceSeed), 3n);

  const lowShift = -5;
  const highShift = 5;

  const xShift = procedural.realBetween(xSeed, lowShift, highShift);
  const yShift = procedural.realBetween(ySeed, lowShift, highShift);
  const zShift = procedural.realBetween(zSeed, lowShift, highShift);

  return { abundance, octaves, polyParams, pointScale, pointShift: [xShift, yShift, zShift] };
};

/**
 * Calculates the distance (along surface of a sphere) between two lots on an asteroid
 * @param {integer} asteroidId The asteroid identifier
 * @param {integer} originLotIdThe starting lot identifier
 * @param {integer} destLotId The ending lot identifier
 * @return Distance in km
 */
const getLotDistance = (asteroidId, originLotId, destLotId) => {
  const radius = getRadius(asteroidId);
  const numLots = getSurfaceArea(asteroidId, radius);
  const origin = multiply(getLotPosition(asteroidId, originLotId, numLots), radius);
  const dest = multiply(getLotPosition(asteroidId, destLotId, numLots), radius);
  return radius * Math.acos(dot(origin, dest) / (radius * radius));
};

/**
 * Returns the Cartesian position of a lot on a (unit-radius spherical) asteroid
 * @param asteroidId The asteroid identifier
 * @param lotId The lot identifier
 * @param numLots Optional area / number of lots param (if precalculated)
 */
const getLotPosition = (asteroidId, lotId, numLots = 0) => {
  const theta = PHI * (lotId - 1);
  numLots = numLots || getSurfaceArea(asteroidId);
  if (lotId < 1 || lotId > numLots) throw new Error('Invalid lot id');
  const lotFrac = (lotId - 1) / (numLots - 1);
  const y = 1 - (lotFrac * 2);
  const radius = Math.sqrt(1 - y * y); // radius at y
  const x = radius * Math.cos(theta);
  const z = radius * Math.sin(theta);
  return [x, y, z];
};

/**
 * @param lotTally surface area in km (floored)
 * @returns
 */
const getLotRegionTally = (lotTally = 0) => {
  return Math.min(MAX_LOT_REGIONS, Math.max(Math.ceil(lotTally / 100), 100));
};

/**
 * Calculates the region containing the specified position
 * @param position (Float32Array) Asteroid lot position
 * @param regionTally (int) The number of regions on the asteroid
 * @returns (int) region id
 */
const getPositionRegion = (position, regionTally) => {
  const region = getClosestLots({
    center: normalizeVector(position),
    lotTally: regionTally,
    findTally: 1
  })[0];
  return region === undefined ? -1 : region;
};

/**
 * Calculates the region of each inputted position
 * @param positions (Float32Array) Batch of Asteroids lot positions
 * @param regionTally (int) The number of regions on the asteroid
 * @returns (Int16Array) region ids
 */
const getRegionsOfLotPositions = (flatPositions, regionTally) => {
  const batchSize = flatPositions.length / 3;
  const regions = new Int16Array(batchSize);
  for (let i = 0; i < batchSize; i++) {
    const positionIndex = i * 3;
    regions[i] = getPositionRegion(
      [flatPositions[positionIndex], flatPositions[positionIndex + 1], flatPositions[positionIndex + 2]],
      regionTally
    );
  }
  return regions;
};

/**
 * NOTE: either center OR centerLot should be provided, not both
 * @param center (int) The center position to search around
 * @param centerLot (int) The lot id to search around
 * @param lotTally (int) The number of regions on the asteroid
 * @param findTally (int) The number of regions on the asteroid
 * @returns
 */
const getClosestLots = ({ center, centerLot, lotTally, findTally }) => {
  const returnAllPoints = !findTally; // if no findTally attached, return all (sorted)

  // if pass centerLot instead of center, set center from centerLot
  // NOTE: assume centerLot is nominal lot id
  if (centerLot && !center) {
    center = getLotPosition(0, centerLot, lotTally);
  }

  let arcToSearch, yToSearch, maxIndex, minIndex, centerTheta, thetaTolerance;
  if (returnAllPoints || lotTally < 100) {
    minIndex = 0;
    maxIndex = lotTally;
  } else {
    // assuming # of lots returning represent a circular area around center,
    // the radius of which is ~the arc length we need to search
    //    SA of unit sphere (4 * pi * r^2) == 4 * pi
    //    lotArea is SA / lotTally == 4 * pi / lotTally
    //    targetArea is pi * search_radius^2 == findTally * lotArea
    //      search_radius = sqrt(findTally * (4 * pi / lotTally) / pi)
    // + 10% safety factor
    arcToSearch = 1.1 * Math.sqrt(4 * findTally / lotTally);

    // angle of arclen == arclen / radius (radius is 1)
    // y of angle == sin(angle) * radius (radius is 1)
    yToSearch = Math.sin(arcToSearch);
    maxIndex = Math.min(lotTally, Math.ceil((1 - center[1] + yToSearch) * (lotTally - 1) / 2));
    minIndex = Math.max(0, Math.floor((1 - center[1] - yToSearch) * (lotTally - 1) / 2));

    centerTheta = Math.atan2(center[2], center[0]);
    thetaTolerance = arcToSearch / Math.sqrt(1 - center[1] * center[1]);
  }

  const points = [];
  for (let index = minIndex; index < maxIndex; index++) {
    const theta = PHI * index;
    if (!returnAllPoints) {
      if (getAngleDiff(centerTheta, theta) > thetaTolerance) {
        continue;
      }
    }

    const y = 1 - (2 * index / (lotTally - 1));
    const radiusAtY = Math.sqrt(1 - y * y);
    const x = Math.cos(theta) * radiusAtY;
    const z = Math.sin(theta) * radiusAtY;

    points.push([
      x,
      y,
      z,
      index + 1, // nominalIndex
      Math.pow(center[0] - x, 2) + Math.pow(center[1] - y, 2) + Math.pow(center[2] - z, 2)
    ]);
  }
  // console.log(`${maxIndex - minIndex} points in range; ${points.length} checked`);

  return points
    .sort((a, b) => a[4] < b[4] ? -1 : 1) // sort by distance
    .map((p) => p[3]) // map to lot index
    .filter((p) => !centerLot || p !== centerLot) // filter out centerLot if that is how searched
    .slice(0, findTally || undefined); // slice to target number
};

/**
 * Calculates the travel time between two lots considering an overall crew bonus
 * @param {integer} asteroidId The asteroid identifier
 * @param {integer} originLotIdThe starting lot identifier
 * @param {integer} destLotId The ending lot identifier
 * @param {float} totalBonus
 * @return Travel time in seconds
 */
const getLotTravelTime = (asteroidId, originLotId, destLotId, totalBonus = 1) => {
  const distance = getLotDistance(asteroidId, originLotId, destLotId);
  const time = distance <= FREE_TRANSPORT_RADIUS * totalBonus ? 0 : Math.ceil(distance * 60 / totalBonus);
  return time;
};

/**
 * Unpacks a packed set of static asteroid data including orbital elements and spectral type
 * @param {Uint32Array} packed 32 bit array of packed asteroid details (3 elements per asteroid)
 */
const getUnpackedAsteroidDetails = (packed) => {
  const unpacked = [];

  for (let i = 1; i <= 250000; i++) {
    const offset = i - 1;
    const packedSAE = packed[offset * 3];
    const packedIO = packed[offset * 3 + 1];
    const packedWM = packed[offset * 3 + 2];
    unpacked.push({
      i,
      r: getRadius(i),
      spectralType: packedSAE & 15,
      orbital: {
        a: ((packedSAE & 4194288) >> 4) / 1000,
        e: ((packedSAE & 4290772992) >> 22) / 1000,
        i: (packedIO & 65535) * Math.PI / 18000,
        o: ((packedIO & 4294901760) >> 16) * Math.PI / 18000,
        w: (packedWM & 65535) * Math.PI / 18000,
        m: ((packedWM & 4294901760) >> 16) * Math.PI / 18000
      }
    });
  }

  return unpacked;
};

const getBoostFromPurchaseOrder = function (purchaseOrder) {
  if (!purchaseOrder) return 1;
  if (purchaseOrder >= 1 && purchaseOrder <= 100) return 4;
  if (purchaseOrder >= 101 && purchaseOrder <= 1100) return 3;
  if (purchaseOrder >= 1101 && purchaseOrder <= 11100) return 2;
  return 1;
};

export default {
  BONUS_IDS,
  FREE_TRANSPORT_RADIUS,
  MAX_LOT_REGIONS,
  MAX_RADIUS,
  RARITIES,
  SCANNING_TIME,
  SCAN_STATUSES,
  SIZES,
  SPECTRAL_IDS,
  SPECTRAL_TYPES,
  TOTAL_ASTEROIDS,

  getAbundanceAtLot,
  getAbundanceAtPosition,
  getAbundanceMapSettings,
  getAbundances,
  getBaseName,
  getBonus,
  getBonusByResource,
  getBonuses,
  getBoostFromPurchaseOrder,
  getClosestLots,
  getLotDistance,
  getLotPosition,
  getLotRegionTally,
  getLotTravelTime,
  getMass,
  getRadius,
  getRarity,
  getRegionsOfLotPositions,
  getScanned,
  getSeed,
  getSize,
  getSpectralType,
  getSurfaceArea,
  getUnpackedAsteroidDetails,

  Entity,
  Component
};
