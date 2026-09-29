import Entity from './entity.js';

const IDS = {
  USE_LOT: 1,
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
  ASSEMBLE_SHIP: 13,
  USE_DEPOSIT: 14
};

export const validatePermission = (target, permission) => {
  if (!target?.label) throw new Error('Invalid target entity');

  const label = Number(target.label);
  permission = Number(permission);
  if (label === Entity.IDS.ASTEROID || label === Entity.IDS.LOT) {
    if (permission === IDS.USE_LOT) return;
  } else if (label === Entity.IDS.BUILDING) {
    if ([
      IDS.RUN_PROCESS,
      IDS.ADD_PRODUCTS,
      IDS.REMOVE_PRODUCTS,
      IDS.STATION_CREW,
      IDS.RECRUIT_CREWMATE,
      IDS.DOCK_SHIP,
      IDS.BUY,
      IDS.SELL,
      IDS.LIMIT_BUY,
      IDS.LIMIT_SELL,
      IDS.EXTRACT_RESOURCES,
      IDS.ASSEMBLE_SHIP
    ].includes(permission)) return;
  } else if (label === Entity.IDS.SHIP) {
    if ([IDS.ADD_PRODUCTS, IDS.REMOVE_PRODUCTS, IDS.STATION_CREW].includes(permission)) return;
  } else if (label === Entity.IDS.DEPOSIT && permission === IDS.USE_DEPOSIT) {
    return;
  }

  throw new Error('Invalid permission');
};

export default IDS;
