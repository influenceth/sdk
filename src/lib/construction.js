// Keyed by capableType with construction time in seconds
export const CONSTRUCTION_TIMES = {
  1: 72000,
  2: 86400,
  3: 172800,
  4: 144000,
  5: 216000,
  6: 388800,
  7: 388800,
  8: 432000,
  9: 604800
};

export const STATUS_NEW = 0;
export const STATUS_PLANNED = 1;
export const STATUS_UNDER_CONSTRUCTION = 2;
export const STATUS_OPERATIONAL = 3;
export const STATUSES = ['New', 'Planned', 'Under Construction', 'Operational'];

/**
 * @param {integer} capableType A constructable capable type
 * @param {float} totalBonus The crew bonus to apply to the construction time
 * @returns The construction time required in seconds
 */
export const getConstructionTime = (capableType, totalBonus = 1) => {
  if (CONSTRUCTION_TIMES[capableType]) {
    return Math.ceil(CONSTRUCTION_TIMES[capableType] / totalBonus);
  } else {
    throw new Error('Capable type is invalid or not constructable');
  }
};

/**
 * Returns the plain text description of the construction status
 * @param {integer} status
 */
export const getStatus = (status) => {
  return STATUSES[status];
};

export default {
  CONSTRUCTION_TIMES,
  STATUS_NEW,
  STATUS_PLANNED,
  STATUS_UNDER_CONSTRUCTION,
  STATUS_OPERATIONAL,
  STATUSES,
  getConstructionTime,
  getStatus
};
