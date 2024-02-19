const IDS = {
  STARDUST: 1,
  GROUNDBREAKING: 2,
  KEEP_EM_SEPARATED: 3,
  NO_SOUND_IN_SPACE: 4,
  THE_CAKE_IS_A_HALF_TRUTH: 5,
  FLY_ME_TO_THE_MOON: 6,
  ALWAYS_LEAVE_A_NOTE: 7,
  GREATNESS: 8
};

const TYPES = {
  [IDS.STARDUST]: {
    name: 'Stardust',
    choices: [1],
    maxChance: 0.75,
  },
  [IDS.GROUNDBREAKING]: {
    name: 'Groundbreaking',
    choices: [1],
    maxChance: 0.75
  },
  [IDS.KEEP_EM_SEPARATED]: {
    name: 'Keep \'Em Separated',
    choices: [1],
    maxChance: 0.75
  },
  [IDS.NO_SOUND_IN_SPACE]: {
    name: 'No Sound in Space',
    choices: [1],
    maxChance: 0.75
  },
  [IDS.THE_CAKE_IS_A_HALF_TRUTH]: {
    name: 'The Cake is a Half-Truth',
    choices: [1],
    maxChance: 0.75
  },
  [IDS.FLY_ME_TO_THE_MOON]: {
    name: 'Fly Me to the Moon',
    choices: [1],
    maxChance: 0.75
  },
  [IDS.ALWAYS_LEAVE_A_NOTE]: {
    name: 'Always Leave a Note',
    choices: [1],
    maxChance: 0.75
  },
  [IDS.GREATNESS]: {
    name: 'Greatness',
    choices: [1],
    maxChance: 0.75
  }
};

const MIN_ROUNDS = 10;

const ACTION_IDS = {
  SAMPLE_DEPOSIT_STARTED: 1,
  EXTRACT_RESOURCE_STARTED: 2,
  PROCESS_PRODUCTS_STARTED: 3,
  ASSEMBLE_SHIP_STARTED: 4,
  TRANSIT_BETWEEN_STARTED: 5
};

const ACTION_TYPES = {
  [ACTION_IDS.SAMPLE_DEPOSIT_STARTED]: {
    events: [IDS.STARDUST]
  },
  [ACTION_IDS.EXTRACT_RESOURCE_STARTED]: {
    events: [IDS.GROUNDBREAKING]
  },
  [ACTION_IDS.PROCESS_PRODUCTS_STARTED]: {
    events: [IDS.KEEP_EM_SEPARATED, IDS.NO_SOUND_IN_SPACE, IDS.THE_CAKE_IS_A_HALF_TRUTH]
  },
  [ACTION_IDS.ASSEMBLE_SHIP_STARTED]: {
    events: [IDS.FLY_ME_TO_THE_MOON]
  },
  [ACTION_IDS.TRANSIT_BETWEEN_STARTED]: {
    events: [IDS.ALWAYS_LEAVE_A_NOTE]
  }
};

export default {
  MIN_ROUNDS,
  IDS,
  TYPES,
  ACTION_IDS,
  ACTION_TYPES
};
