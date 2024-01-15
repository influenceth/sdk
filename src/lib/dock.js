const IDS = {
  BASIC: 1
};

const TYPES = {
  [IDS.BASIC]: {
    i: IDS.BASIC,
    cap: 50,
    delayPerShip: 720 // in in-game seconds
  }
};

const getType = (type) => TYPES[type] ? { ...TYPES[type] } : null;

const Entity = {};
const Component = {};

// Returns the time in
const getGroundDelay = (dockType, dockedShips) => {
  const { delayPerShip } = getType(dockType);
  return dockedShips * delayPerShip;
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
