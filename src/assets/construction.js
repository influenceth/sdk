export const STATUS_NEW = 0;
export const STATUS_PLANNED = 1;
export const STATUS_UNDER_CONSTRUCTION = 2;
export const STATUS_OPERATIONAL = 3;
export const STATUSES = ['New', 'Planned', 'Under Construction', 'Operational'];

/**
 * Returns the plain text description of the construction status
 * @param status
 */
export const getStatus = (status) => {
  return STATUSES[status];
};

export default {
  STATUS_NEW,
  STATUS_PLANNED,
  STATUS_UNDER_CONSTRUCTION,
  STATUS_OPERATIONAL,
  STATUSES,
  getStatus
};
