import Constants from './constants.js';

import Asteroid from './lib/asteroid.js';
import Capable from './lib/capable.js';
import Construction from './lib/construction.js';
import CoreSample from './lib/coreSample.js';
import Crew from './lib/crew.js';
import Crewmate from './lib/crewmate.js';
import Extraction from './lib/extraction.js';
import Inventory from './lib/inventory.js';
import Lot from './lib/lot.js';

import Address from './utils/address.js';
import AdalianOrbit from './utils/AdalianOrbit.js';
import Merkle from './utils/MerkleTree.js';
import Simplex from './utils/simplex.js';

import ethereumContracts from './contracts/ethereum_abis.json' assert { type: 'json' };
import starknetContracts from './contracts/starknet_abis.json' assert { type: 'json' };

// Utility libs
export { Address, AdalianOrbit, Merkle, Simplex };

// Game asset libs
export { Asteroid, Capable, Construction, CoreSample, Crew, Crewmate, Extraction, Inventory, Lot };

// Contract ABIs
export { ethereumContracts, starknetContracts };

export const ADALIA_MASS = Constants.ADALIA_MASS;
export const GM_ADALIA = Constants.GM_ADALIA;
export const SIMPLEX_POLY_FIT = Constants.SIMPLEX_POLY_FIT;

// Legacy support (v1 compatiblity) ###################################################################################

const KeplerianOrbit = AdalianOrbit;
export { KeplerianOrbit };

export const MASTER_SEED = Constants.MASTER_SEED
export const START_TIMESTAMP = Constants.START_TIMESTAMP;
export const contracts = ethereumContracts;

export const MAX_RADIUS = Asteroid.MAX_RADIUS;
export const TOTAL_ASTEROIDS = Asteroid.TOTAL_ASTEROIDS;
export const REGIONS = Asteroid.REGIONS;
export const SPECTRAL_TYPES = Object.values(Asteroid.SPECTRAL_TYPES).map(v => v.name);
export const RARITIES = Asteroid.RARITIES;
export const SIZES = Asteroid.SIZES;
export const BONUS_MAPS = Asteroid.BONUS_MAPS;

export const toBonus = Asteroid.getBonus;
export const toBonuses = Asteroid.getBonuses;
export const toRarity = Asteroid.getRarity;
export const isScanned = Asteroid.getScanned;
export const toSpectralType = (v) => Asteroid.getSpectralType(v).name;
export const toSize = Asteroid.getSize;

export const CREW_BONUS_ITEM = Object.values(Crewmate.BONUS_ITEMS).map(v => v.name).slice(1);
export const CREW_CLASSES = Object.values(Crewmate.CLASSES).map(v => v.name);
export const CREW_CLASS_DESCRIPTIONS = Object.values(Crewmate.CLASSES).map(v => v.description);
export const CREW_COLLECTIONS = Object.values(Crewmate.COLLECTIONS).map(v => v.name);
export const CREW_FACIAL_FEATURE = Object.values(Crewmate.FACIAL_FEATURES).map(v => v.name).slice(1);
export const CREW_HAIR = Object.values(Crewmate.HAIR_STYLES).map(v => v.name);
export const CREW_HAIR_COLOR = Object.values(Crewmate.HAIR_COLORS).map(v => v.name);
export const CREW_HEAD_PIECE = Object.values(Crewmate.HEAD_PIECES).map(v => v.name).slice(1);
export const CREW_OUTFIT = Object.values(Crewmate.OUTFITS).map(v => v.name);
export const CREW_SEX = Object.values(Crewmate.GENDERS).map(v => v.name);
export const CREW_TITLES = Object.values(Crewmate.TITLES).map(v => v.name).slice(1);
export const CREW_TRAITS = Object.values(Crewmate.TRAITS).map(v => v.name);
export const toCrewClass = (v) => Crewmate.getClass(v).name;
export const toCrewClassDescription = (v) => Crewmate.getClass(v).description;
export const toCrewCollection = (v) => Crewmate.COLLECTIONS[v].name;
export const toCrewFacialFeature = (v) => Crewmate.getFacialFeature(v).name;
export const toCrewHair = (v) => Crewmate.getHairStyle(v).name;
export const toCrewHairColor = (v) => Crewmate.getHairColor(v).name;
export const toCrewHeadPiece = (v) => Crewmate.getHeadPiece(v).name;
export const toCrewItem = (v) => Crewmate.getBonusItem(v).name;
export const toCrewOutfit = (v) => Crewmate.getOutfit(v).name;
export const toCrewSex = (v) => Crewmate.getGender(v).name;
export const toCrewTitle = (v) => Crewmate.getTitle(v).name;
export const toCrewTrait = (v) => Crewmate.getTrait(v);

export const RESOURCES = Inventory.RESOURCES;

/**
 * Converts array of relative resources into an object based on the RESOURCES list
 * @param resources array of float values (asc order by resource type)
 * @return Array of resource objects, i.e. { RESOURCE_NAME: value }
 */
export const toResources = (resources) => {
  return resources.reduce((acc, value, index) => {
    const { name } = RESOURCES[index + 1] || {};
    if (!name) throw new Error('Invalid index/key');
    acc[name] = value;
    return acc;
  }, {});
};
