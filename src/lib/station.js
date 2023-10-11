const IDS = {
  STANDARD_QUARTERS: 1,
  EXPANDED_QUARTERS: 2,
  HABITAT: 3,
};

const TYPES = {
  [IDS.STANDARD_QUARTERS]: {
    i: IDS.STANDARD_QUARTERS,
    cap: 5,
    recruitment: false,
  },
  
  [IDS.EXPANDED_QUARTERS]: {
    i: IDS.EXPANDED_QUARTERS,
    cap: 20,
    recruitment: false,
  },

  [IDS.HABITAT]: {
    i: IDS.HABITAT,
    cap: 250,
    recruitment: true,
  },
};

const getType = (type) => TYPES[type] ? { ...TYPES[type] } : null;

export default {
  IDS,
  TYPES,

  getType
}