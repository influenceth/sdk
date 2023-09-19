const IDS = {
  LOT_USE: 1,
  RUN_PROCESS: 2,
  ADD_PRODUCTS: 3,
  REMOVE_PRODUCTS: 4,
  STATION_CREW: 5,
  RECRUIT_CREWMATE: 6,
  DOCK_SHIP: 7,
  BUY: 8,
  SELL: 9,
  LIMIT_BUY: 10,
  LIMIT_SELL: 11,
  EXTRACT_RESOURCES: 12,
  ASSEMBLE_SHIP: 13
};

const TYPES = {
  [IDS.LOT_USE]: { label: 'LOT_USE' },
  [IDS.RUN_PROCESS]: { label: 'PROCESS' },
  [IDS.ADD_PRODUCTS]: { label: 'ADD_PRODUCTS' },
  [IDS.REMOVE_PRODUCTS]: { label: 'REMOVE_PRODUCTS' },
  [IDS.STATION_CREW]: { label: 'STATION_CREW' },
  [IDS.RECRUIT_CREWMATE]: { label: 'RECRUIT_CREWMATE' },
  [IDS.DOCK_SHIP]: { label: 'DOCK_SHIP' },
  [IDS.BUY]: { label: 'BUY' },
  [IDS.SELL]: { label: 'SELL' },
  [IDS.LIMIT_BUY]: { label: 'LIMIT_BUY' },
  [IDS.LIMIT_SELL]: { label: 'LIMIT_SELL' },
  [IDS.EXTRACT_RESOURCES]: { label: 'EXTRACT_RESOURCES' },
  [IDS.ASSEMBLE_SHIP]: { label: 'ASSEMBLE_SHIP' }
};

export default {
  IDS,
  TYPES
};
