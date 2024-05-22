const IDS = {
  BASIC: 1
};

const TYPES = {
  [IDS.BASIC]: {
    i: IDS.BASIC,
    name: 'Basic Dock',
    cap: 50,
    delayPerShip: 720 // in in-game seconds
  }
};

const getType = (type) => TYPES[type] ? { ...TYPES[type] } : null;

const Entity = {};
const Component = {};

// Delays only start once the dock is half full
const getGroundDelay = (dockType, dockedShips) => {
  const { delayPerShip, cap } = getType(dockType);
  const effectiveDockedShips = Math.max(0, dockedShips - cap / 2);
  return effectiveDockedShips * delayPerShip;
};
Component.getGroundDelay = (dock) => getGroundDelay(dock.dockType, dock.dockedShips);
Entity.getGroundDelay = (dockable) => Component.getGroundDelay(dockable.Dock);

export default {
  IDS,
  TYPES,

  getType,
  getGroundDelay,

  Entity,
  Component
};
