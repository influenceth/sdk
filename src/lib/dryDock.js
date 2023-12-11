const IDS = {
  BASIC: 1
};

const STATUSES = {
  IDLE: 0,
  RUNNING: 1
};

const TYPES = {
  [IDS.BASIC]: {
    i: IDS.BASIC,
    maxMass: 1e6,
    maxVolume: 1e6
  }
};

const getType = (type) => TYPES[type] ? { ...TYPES[type] } : null;

export default {
  IDS,
  STATUSES,
  TYPES,

  getType
};
