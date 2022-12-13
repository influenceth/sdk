export const MAX_YIELD = 10000; // tonnes
export const STATUS_NEW = 0;
export const STATUS_STARTED = 1;
export const STATUS_FINISHED = 2;
export const STATUS_USED = 3;
export const STATUSES = ['New', 'Started', 'Finished', 'Used'];

/**
 * Returns the plain text description of the construction status
 * @param status
 */
 export const getStatus = (status) => {
  return STATUSES[status];
};

export const getSampleBounds = (abundance, initialYield = 0, totalBonus = 1) => {
  let lower = initialYield;
  let upper = abundance * MAX_YIELD;

  if (totalBonus < 1) upper = lower + (upper - lower) * totalBonus;
  if (totalBonus > 1) lower = upper - (upper - lower) / totalBonus;

  return { lower, upper };
};

export default {
  MAX_YIELD,
  STATUS_NEW,
  STATUS_STARTED,
  STATUS_FINISHED,
  STATUS_USED,
  STATUSES,
  getSampleBounds,
  getStatus
};
