const IDS = {
  STANDARD_QUARTERS: 1,
  EXPANDED_QUARTERS: 2,
  HABITAT: 3
};

const TYPES = {
  [IDS.STANDARD_QUARTERS]: {
    i: IDS.STANDARD_QUARTERS,
    cap: 5,
    recruitment: false,
    efficiency: 1
  },

  [IDS.EXPANDED_QUARTERS]: {
    i: IDS.EXPANDED_QUARTERS,
    cap: 15,
    recruitment: false,
    efficiency: 1
  },

  [IDS.HABITAT]: {
    i: IDS.HABITAT,
    cap: 1000,
    recruitment: true,
    efficiency: 1.2
  }
};

const getType = (type) => TYPES[type] ? { ...TYPES[type] } : null;

const Entity = {};
const Component = {};

const getEfficiency = (stationType, population) => {
  const { cap, efficiency } = getType(stationType);
  const softCap = 0.5 * cap;
  if (population <= softCap) return efficiency;

  const efficiencyDrop = efficiency - 1.0;
  return efficiency - efficiencyDrop * (population - softCap) / softCap;
};
Component.getEfficiency = (station) => getEfficiency(station.stationType, station.population);
Entity.getEfficiency = (stationable) => Component.getEfficiency(stationable.Station);

export default {
  IDS,
  TYPES,

  getType,
  getEfficiency,

  Entity,
  Component
};
