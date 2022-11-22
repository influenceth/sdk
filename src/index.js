import {
  MASTER_SEED,
  START_TIMESTAMP,
  MAX_RADIUS,
  TOTAL_ASTEROIDS,
  REGIONS,
  SPECTRAL_TYPES,
  RARITIES,
  SIZES,
  BONUS_MAPS,
  CREW_COLLECTIONS,
  CREW_CLASSES,
  CREW_CLASS_DESCRIPTIONS,
  CREW_TITLES,
  CREW_SEX,
  CREW_OUTFIT,
  CREW_HAIR,
  CREW_HAIR_COLOR,
  CREW_FACIAL_FEATURE,
  CREW_HEAD_PIECE,
  CREW_BONUS_ITEM,
  CREW_TRAITS,
  RESOURCES
} from './constants.js';

import KeplerianOrbit from './lib/KeplerianOrbit.js';
import Address from './lib/address.js';
import Merkle from './lib/MerkleTree.js';

/**
 * ABIs for client interaction with Influence
 */
import ethereumContracts from './abis/contracts_ethereum.json' assert { type: 'json' };
import starknetContracts from './abis/contracts_starknet.json' assert { type: 'json' };

/**
 * Returns the bonus information based on its position in the bitpacked bonuses int
 * @param num Position in the bitpacked bonuses int
 */
export const toBonus = (num) => {
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
export const toBonuses = (packed, spectralType) => {
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
 * Returns the rarity level of the asteroid based on the bonuses and size
 * @param bonuses
 * @param radius
 */
export const toRarity = (bonuses) => {
  let rarity = 0;

  for (const b of bonuses) {
    rarity += b.level;
  }

  if (rarity <= 3) return RARITIES[rarity];
  if (rarity <= 5) return RARITIES[4];
  return RARITIES[5];
};

/**
 * Converts array of relative resources into an object based on the RESOURCES list
 * Result format: { RESOURCE_NAME: value }
 * @param resources array of float values (asc order by resource type)
 */
export const toResources = (resources) => {
  return resources.reduce((acc, value, index) => {
    const { name } = RESOURCES[index + 1] || {};
    if (!name) throw new Error('Invalid index/key');
    acc[name] = value;
    return acc;
  }, {});
};

/**
 * Returns whether the asteroid has been scanned based on its bitpacked bonuses int
 * @param packed The bitpacked bonuses int
 */
export const isScanned = (packed) => {
  return ((packed & (1 << 0)) > 0);
};

/**
 * Returns the spectral type string based on its array value
 * @param num The spectral type int value
 */
export const toSpectralType = (num) => {
  if (num < 0 || num > 10) return '';
  return SPECTRAL_TYPES[num];
};

/**
 * Returns the size string based on the asteroid radius
 * @param rad The asteroid radius int value
 */
export const toSize = (rad) => {
  if (rad <= 5000) return SIZES[0];
  if (rad <= 20000) return SIZES[1];
  if (rad <= 50000) return SIZES[2];
  return SIZES[3];
};

/**
 * Returns the collection name the crew member is a part of
 * @param c The unpacked collection id
 */
export const toCrewCollection = (c) => CREW_COLLECTIONS[c - 1];

/**
 * Returns the crew class string based on the unpacked class id
 * @param c The unpacked class id
 */
export const toCrewClass = (c) => CREW_CLASSES[c - 1];

/**
 * Returns the crew class description string based on the unpacked class id
 * @param c The unpacked class id
 */
export const toCrewClassDescription = (c) => CREW_CLASS_DESCRIPTIONS[c - 1];

/**
 * Returns the crew title based on the unpacked title id
 * @param t The unpacked title id
 */
export const toCrewTitle = (t) => CREW_TITLES[t - 1];

export const toCrewSex = (s) => CREW_SEX[s - 1];
export const toCrewOutfit = (o) => CREW_OUTFIT[o - 1];
export const toCrewHair = (h) => CREW_HAIR[h];
export const toCrewHairColor = (h) => CREW_HAIR_COLOR[h - 1];
export const toCrewFacialFeature = (f) => CREW_FACIAL_FEATURE[f - 1];
export const toCrewHeadPiece = (h) => CREW_HEAD_PIECE[h - 1];
export const toCrewItem = (i) => CREW_BONUS_ITEM[i - 1];
export const toCrewTrait = (t) => CREW_TRAITS[t - 1];

export {
  MASTER_SEED,
  START_TIMESTAMP,
  MAX_RADIUS,
  TOTAL_ASTEROIDS,
  REGIONS,
  SPECTRAL_TYPES,
  RARITIES,
  RESOURCES,
  SIZES,
  BONUS_MAPS,
  CREW_COLLECTIONS,
  CREW_CLASSES,
  CREW_CLASS_DESCRIPTIONS,
  CREW_TITLES,
  CREW_SEX,
  CREW_OUTFIT,
  CREW_HAIR,
  CREW_HAIR_COLOR,
  CREW_FACIAL_FEATURE,
  CREW_HEAD_PIECE,
  CREW_BONUS_ITEM,
  CREW_TRAITS
};

export {
  Address,
  Merkle,
  KeplerianOrbit
};

export {
  ethereumContracts as contracts, // (for backward compatibility)
  ethereumContracts,
  starknetContracts
};
