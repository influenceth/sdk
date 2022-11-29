import { MASTER_SEED, START_TIMESTAMP } from './constants.js';
import Asteroid from './assets/asteroid.js';
import Construction from './assets/construction.js';
import Crewmate from './assets/crewmate.js';
import Extraction from './assets/extraction';
import Inventory from './assets/inventory.js';
import KeplerianOrbit from './lib/KeplerianOrbit.js';
import Address from './lib/address.js';
import Merkle from './lib/MerkleTree.js';
import ethereumContracts from './abis/contracts_ethereum.json' assert { type: 'json' };
import starknetContracts from './abis/contracts_starknet.json' assert { type: 'json' };

// Utility libs
export { Address, Merkle, KeplerianOrbit };

// Game asset libs
export { Asteroid, Construction, Crewmate, Extraction, Inventory };

// Contract ABIs
export { ethereumContracts, starknetContracts };

// Legacy support (v1 compatiblity) ###################################################################################
export { MASTER_SEED, START_TIMESTAMP };
export const contracts = ethereumContracts;

export const MAX_RADIUS = Asteroid.MAX_RADIUS;
export const TOTAL_ASTEROIDS = Asteroid.TOTAL_ASTEROIDS;
export const REGIONS = Asteroid.REGIONS;
export const SPECTRAL_TYPES = Object.values(Asteroid.SPECTRAL_TYPES).map(v => v.name);
export const RARITIES = Asteroid.RARITIES;
export const SIZES = Asteroid.SIZES;
export const BONUS_MAPS = JSON.parse(JSON.stringify(Asteroid.BONUS_MAPS)).map(bonus => {
  bonus.spectralTypes = bonus.spectralTypes.map(v => v - 1);
  return bonus;
});

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
export const toCrewTrait = (v) => Crewmate.getTrait(v).name;

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
