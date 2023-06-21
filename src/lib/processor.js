export const STATUS_IDLE = 0;
export const STATUS_PROCESSING = 1;
export const STATUSES = ['Idle', 'Processing'];

export const PROCESSES = {
  23: { name: 'Water Electrolysis', inputs: { 1: 9 }, outputs: { 2: 1, 23: 8 } },
  35: { name: 'Fused Quartz Process', inputs: { 26: 1 }, outputs: { 41: 1 } },
  45: { name: 'Fungal Soil Process', inputs: { 10: 3, 24: 2 }, outputs: { 56: 5 } }
};

/**
 * Returns the plain text description of the construction status
 * @param status
 */
export const getStatus = (status) => {
  return STATUSES[status];
};

export default {
  STATUS_IDLE,
  STATUS_PROCESSING,
  STATUSES,
  getStatus
};
