const MIN_EFFICIENCY = 0.75;

const IDS = {
  STANDARD_QUARTERS: 1,
  EXPANDED_QUARTERS: 2,
  HABITAT: 3,
};

const TYPES = {
  [IDS.STANDARD_QUARTERS]: {
    i: IDS.STANDARD_QUARTERS,
    cap: 5,
    hardCap: true,
    recruitment: false,
    efficiency: 1
  },

  [IDS.EXPANDED_QUARTERS]: {
    i: IDS.EXPANDED_QUARTERS,
    cap: 20,
    hardCap: true,
    recruitment: false,
    efficiency: 1
  },

  [IDS.HABITAT]: {
    i: IDS.HABITAT,
    cap: 250,
    hardCap: false,
    recruitment: true,
    efficiency: 1.2
  },
};

const getType = (type) => TYPES[type] ? { ...TYPES[type] } : null;

const getEfficiency = (stationType, population) => {
  const { cap, hardCap, efficiency } = getType(stationType);
  if (hardCap) return efficiency;
  if (population < cap) return efficiency;
  if (population > cap * 2) return MIN_EFFICIENCY;

  const popRatio = (population - cap) / cap;
  return MIN_EFFICIENCY + (efficiency - MIN_EFFICIENCY) * (1 - popRatio);
}

export default {
  IDS,
  TYPES,

  getType,
  getEfficiency
}