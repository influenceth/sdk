import Building from './building.js';
import Bindings from './starterMissionBindings.js';
import Entity from './entity.js';
import Mission, { toUnsignedBigInt } from './mission.js';
import Process from './process.js';
import Processor from './processor.js';
import Product from './product.js';

const REWARD_SCALE = 1_000_000;

const IDS = {
  MAKE_LANDFALL: 0,
  PROSPECT_THE_SURFACE: 1,
  BEGIN_EXTRACTION: 2,
  ESTABLISH_STORAGE: 3,
  REFINE_THE_YIELD: 4,
  CULTIVATE_LIFE: 5,
  MANUFACTURE_GOODS: 6,
  CLOSE_THE_PRODUCTION_LOOP: 7
};

const DEFINITIONS = {
  [IDS.MAKE_LANDFALL]: {
    id: 0,
    key: 'MAKE_LANDFALL',
    title: 'Make Landfall',
    description: 'Plan a Warehouse on a lot where your crew has permission to build.',
    prerequisiteId: null,
    reward: 5_000
  },

  [IDS.PROSPECT_THE_SURFACE]: {
    id: 1,
    key: 'PROSPECT_THE_SURFACE',
    title: 'Prospect the Surface',
    description: 'Complete three distinct core samples, each revealing a deposit with an initial yield of at least 500,000 kg.',
    prerequisiteId: 0,
    reward: 20_000
  },

  [IDS.BEGIN_EXTRACTION]: {
    id: 2,
    key: 'BEGIN_EXTRACTION',
    title: 'Begin Extraction',
    description: 'Construct an Extractor and complete a single extraction of at least 100,000 kg of a raw resource from a sampled deposit.',
    prerequisiteId: 1,
    reward: 30_000
  },

  [IDS.ESTABLISH_STORAGE]: {
    id: 3,
    key: 'ESTABLISH_STORAGE',
    title: 'Establish Storage',
    description: 'Complete your campaign Warehouse and receive goods that bring its stored inventory to at least 100,000 kg.',
    prerequisiteId: 2,
    reward: 20_000
  },

  [IDS.REFINE_THE_YIELD]: {
    id: 4,
    key: 'REFINE_THE_YIELD',
    title: 'Refine the Yield',
    description: 'Construct a Refinery and complete at least one full recipe-equivalent of any supported refinery process.',
    prerequisiteId: 3,
    reward: 50_000
  },

  [IDS.CULTIVATE_LIFE]: {
    id: 5,
    key: 'CULTIVATE_LIFE',
    title: 'Cultivate Life',
    description: 'Construct a Bioreactor and complete at least one full batch of any supported biological process.',
    prerequisiteId: 4,
    reward: 35_000
  },

  [IDS.MANUFACTURE_GOODS]: {
    id: 6,
    key: 'MANUFACTURE_GOODS',
    title: 'Manufacture Goods',
    description: 'Construct a Factory and complete at least one full recipe-equivalent of any supported manufacturing process.',
    prerequisiteId: 5,
    reward: 40_000
  },

  [IDS.CLOSE_THE_PRODUCTION_LOOP]: {
    id: 7,
    key: 'CLOSE_THE_PRODUCTION_LOOP',
    title: 'Close the Production Loop',
    description: 'Complete an approved two-stage production route, then use or deliver some of its final output.',
    prerequisiteId: 6,
    reward: 25_000
  }
};

const productionRequirements = (buildingType, processorType) => ({
  buildingType,
  processorType,
  requiresCampaignConstruction: true,
  requiresOperational: true,
  requiresCrewControl: true,
  minRecipes: 1
});

const REQUIREMENTS = {
  [IDS.MAKE_LANDFALL]: {
    buildingType: Building.IDS.WAREHOUSE,
    recordsCampaignWarehouse: true,
    requiresConstructionPlan: true
  },
  [IDS.PROSPECT_THE_SURFACE]: {
    distinctDeposits: 3,
    requiresInitialSampling: true,
    minInitialYieldKg: 500_000
  },
  [IDS.BEGIN_EXTRACTION]: {
    buildingType: Building.IDS.EXTRACTOR,
    requiresCampaignConstruction: true,
    requiresOperational: true,
    requiresCrewControl: true,
    minExtractionMassGrams: 100_000_000,
    rawProductIdMin: Product.IDS.WATER,
    rawProductIdMax: Product.IDS.URANINITE
  },
  [IDS.ESTABLISH_STORAGE]: {
    buildingType: Building.IDS.WAREHOUSE,
    requiresCampaignWarehouse: true,
    requiresOperational: true,
    requiresCrewControl: true,
    requiresQualifyingReceipt: true,
    inventorySlot: 2,
    minStoredMassGrams: 100_000_000
  },
  [IDS.REFINE_THE_YIELD]: productionRequirements(Building.IDS.REFINERY, Processor.IDS.REFINERY),
  [IDS.CULTIVATE_LIFE]: productionRequirements(Building.IDS.BIOREACTOR, Processor.IDS.BIOREACTOR),
  [IDS.MANUFACTURE_GOODS]: productionRequirements(Building.IDS.FACTORY, Processor.IDS.FACTORY),
  [IDS.CLOSE_THE_PRODUCTION_LOOP]: {
    minRecipesPerStage: 1,
    requiresStage1FinishedBeforeStage2Start: true,
    requiresPositiveIntermediateOutput: true,
    requiresPositiveIntermediateInput: true,
    requiresEconomicUse: true
  }
};

let cumulativeReward = 0;
const TYPES = Object.fromEntries(Object.values(DEFINITIONS).map((mission) => {
  cumulativeReward += mission.reward;
  return [mission.id, { ...mission, cumulativeReward, requirements: REQUIREMENTS[mission.id] }];
}));

const ROUTE_IDS = {
  WATER_ELECTROLYSIS: 0,
  SALTY_CEMENT: 1,
  NAPHTHA_CRACKING: 2,
  QUARTZ_FILAMENT: 3,
  SOYBEAN_FOOD: 4
};

const ROUTE_TYPES = {
  [ROUTE_IDS.WATER_ELECTROLYSIS]: {
    id: ROUTE_IDS.WATER_ELECTROLYSIS,
    key: 'WATER_ELECTROLYSIS',
    title: 'Water to Industrial Gases',
    stage1ProcessId: Process.IDS.WATER_VACUUM_EVAPORATION_DESALINATION,
    intermediateProductId: Product.IDS.DEIONIZED_WATER,
    stage2ProcessId: Process.IDS.WATER_ELECTROLYSIS
  },
  [ROUTE_IDS.SALTY_CEMENT]: {
    id: ROUTE_IDS.SALTY_CEMENT,
    key: 'SALTY_CEMENT',
    title: 'Calcite to Cement',
    stage1ProcessId: Process.IDS.CALCITE_CALCINATION,
    intermediateProductId: Product.IDS.QUICKLIME,
    stage2ProcessId: Process.IDS.SALTY_CEMENT_MIXING
  },
  [ROUTE_IDS.NAPHTHA_CRACKING]: {
    id: ROUTE_IDS.NAPHTHA_CRACKING,
    key: 'NAPHTHA_CRACKING',
    title: 'Bitumen to Chemical Feedstocks',
    stage1ProcessId: Process.IDS.BITUMEN_HYDRO_CRACKING,
    intermediateProductId: Product.IDS.NAPHTHA,
    stage2ProcessId: Process.IDS.NAPHTHA_STEAM_CRACKING
  },
  [ROUTE_IDS.QUARTZ_FILAMENT]: {
    id: ROUTE_IDS.QUARTZ_FILAMENT,
    key: 'QUARTZ_FILAMENT',
    title: 'Silica to Quartz Filament',
    stage1ProcessId: Process.IDS.SILICA_FUSING,
    intermediateProductId: Product.IDS.FUSED_QUARTZ,
    stage2ProcessId: Process.IDS.QUARTZ_FILAMENT_DRAWING_AND_WRAPPING
  },
  [ROUTE_IDS.SOYBEAN_FOOD]: {
    id: ROUTE_IDS.SOYBEAN_FOOD,
    key: 'SOYBEAN_FOOD',
    title: 'Soybeans to Food',
    stage1ProcessId: Process.IDS.SOYBEAN_GROWING,
    intermediateProductId: Product.IDS.SOYBEANS,
    stage2ProcessId: Process.IDS.BASIC_FOOD_COOKING_AND_PACKAGING
  }
};

const getMission = (missionId) => {
  if (!Number.isInteger(missionId) || !Object.hasOwn(TYPES, missionId)) {
    throw new RangeError(`Unknown starter mission: ${missionId}`);
  }
  return TYPES[missionId];
};

const getAssignment = ({ campaign, crewId, missionId }) => {
  getMission(missionId);
  return Mission.getAssignment({ campaign, subject: { label: Entity.IDS.CREW, id: crewId }, mission: missionId });
};

/** Return micro-SWAY, matching MissionRewardClaimed.amount. */
const getRewardAmount = (missionId) => BigInt(getMission(missionId).reward) * BigInt(REWARD_SCALE);

/** Possible outputs for previews; only recorded positive actual outputs qualify on-chain. */
const getRouteOutputProductIds = (routeId) => {
  if (!Number.isInteger(routeId) || !Object.hasOwn(ROUTE_TYPES, routeId)) {
    throw new RangeError(`Unknown starter mission route: ${routeId}`);
  }
  return Object.entries(Process.TYPES[ROUTE_TYPES[routeId].stage2ProcessId].outputs)
    .filter(([, amount]) => amount > 0)
    .map(([productId]) => Number(productId));
};

// Layout from systems/missions/starter.cairo; evidence is shared across assignments.
const EVIDENCE_SLOTS = { PROGRESS: 0, WAREHOUSE: 1, FINAL_PRODUCTS: 100 };

const unpackProgress = (value) => {
  const word = toUnsignedBigInt(value, 128);
  return {
    earned: Object.values(IDS).map((id) => (word & (1n << BigInt(id))) !== 0n),
    sampleCount: Number((word >> 8n) & 3n),
    upstreamRoutes: Object.values(ROUTE_IDS).map((id) => (word & (1n << BigInt(10 + id))) !== 0n)
  };
};

const getFinalProductSlot = (productId) => BigInt(EVIDENCE_SLOTS.FINAL_PRODUCTS) + toUnsignedBigInt(productId, 64) / 128n;

/** Decode a single final-product word. Returned product IDs are bigint. */
const unpackFinalProducts = (value, slot) => {
  const word = toUnsignedBigInt(value, 128);
  const page = toUnsignedBigInt(slot, 64) - BigInt(EVIDENCE_SLOTS.FINAL_PRODUCTS);
  if (page < 0n || page > ((1n << 64n) - 1n) / 128n) throw new RangeError('Invalid final-product slot');
  const products = [];
  for (let bit = 0n; bit < 128n; bit++) {
    if ((word & (1n << bit)) !== 0n) products.push(page * 128n + bit);
  }
  return products;
};

const getInvalidPath = (crewId) => Mission.getPath({ type: 'StarterInvalid', subject: { label: Entity.IDS.CREW, id: crewId } });
const getParticipatedPath = (crewId) => Mission.getPath({ type: 'StarterParticipated', subject: { label: Entity.IDS.CREW, id: crewId } });

/** Current eligibility only: completed reward entitlements survive later invalidation. */
const isEligible = ({ campaign, cutoff, crewId, roster, invalidated }) => {
  // Validate every supplied input, even when a disabled campaign would return false.
  const configuredCampaign = toUnsignedBigInt(campaign, 252);
  const minimumCrewId = toUnsignedBigInt(cutoff, 64);
  const id = toUnsignedBigInt(crewId, 64);
  if (!Array.isArray(roster)) throw new TypeError('A crew roster array is required');
  const invalid = typeof invalidated === 'boolean' ? invalidated : toUnsignedBigInt(invalidated, 252) !== 0n;
  return configuredCampaign !== 0n && id > minimumCrewId && roster.length > 0 && !invalid;
};

export default {
  ...Bindings,
  IDS,
  TYPES,
  ROUTE_IDS,
  ROUTE_TYPES,
  REWARD_SCALE,
  EVIDENCE_SLOTS,
  unpackProgress,
  getFinalProductSlot,
  unpackFinalProducts,
  getInvalidPath,
  getParticipatedPath,
  isEligible,
  getAssignment,
  getRewardAmount,
  getRouteOutputProductIds
};
