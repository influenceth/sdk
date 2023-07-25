import Process from './Process';

const IDS = {
  REFINERY: 1,
  FACTORY: 2,
  BIOREACTOR: 3,
  SHIPYARD: 4,
};

const STATUSES = {
  IDLE: 0,
  RUNNING: 1
};

const getAvailableProcesses = (processorId) => {
  return Object.values(Process.TYPES).filter(p => p.processorType === processorId);
};

export default {
  IDS,
  STATUSES,

  getAvailableProcesses
}