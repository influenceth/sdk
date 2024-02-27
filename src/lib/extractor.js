const MAX_EXTRACTION_TIME = 365 * 86400; // in-game seconds
const EXTRACTION_SETUP_TIME = 4 * 86400; // in-game seconds
const MAX_YIELD_PER_RUN = 10000e6; // 10000 tonnes in grams

const IDS = {
  BASIC: 1
};

const STATUSES = {
  IDLE: 0,
  RUNNING: 1
};

const TYPES = {
  [IDS.BASIC]: {
    i: IDS.BASIC
  }
};

const getType = (type) => TYPES[type] ? { ...TYPES[type] } : null;

/**
 * Returns the base extraction time based on a core sample's yield
 * @param {integer} targetYield
 * @param {integer} remainingYield
 * @param {integer} totalYield
 * @return The extraction time in seconds
 */
const getExtractionTime = (targetYield, remainingYield, totalBonus = 1) => {
  const startTimeRatio = Math.sqrt(remainingYield / MAX_YIELD_PER_RUN);
  const endTimeRatio = Math.sqrt((remainingYield - targetYield) / MAX_YIELD_PER_RUN);
  const time = (startTimeRatio - endTimeRatio) * MAX_EXTRACTION_TIME / totalBonus;
  return Math.ceil(time);
};

export default {
  EXTRACTION_SETUP_TIME,
  MAX_EXTRACTION_TIME,
  MAX_YIELD_PER_RUN,

  STATUSES,
  IDS,
  TYPES,

  getExtractionTime,
  getType
};
