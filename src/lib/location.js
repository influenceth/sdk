import Entity from './entity.js';

const fromEntityFormat = (loc) => {
  if (!loc) return null;

  // ship -> building -> lot -> asteroid
  if (loc.label === Entity.IDS.SHIP) {
    return { shipId: loc.id };
  } else if (loc.label === Entity.IDS.BUILDING) {
    return { buildingId: loc.id };
  } else if (loc.label === Entity.IDS.LOT) {
    const split = 2 ** 32;
    return {
      asteroidId: loc.id % split,
      lotId: Math.round(loc.id / split)
    };
  } else if (loc.label === Entity.IDS.ASTEROID) {
    return { asteroidId: loc.id };
  }

  throw Error(`Invalid location label: "${loc.label}"`);
};

const toEntityFormat = (loc) => {
  if (!loc) return null;

  // ship -> building -> lot -> asteroid
  if (loc.shipId) {
    return { label: Entity.IDS.SHIP, id: loc.shipId };
  } else if (loc.buildingId) {
    return { label: Entity.IDS.BUILDING, id: loc.buildingId };
  } else if (loc.asteroidId && loc.lotId) {
    return { label: Entity.IDS.LOT, id: loc.lotId << 32 | loc.asteroidId };
  } else if (loc.asteroidId) {
    return { label: Entity.IDS.ASTEROID, id: loc.asteroidId };
  }

  throw Error(`Invalid location object: "${JSON.stringify(loc)}"`);
};

export default {
  fromEntityFormat,
  toEntityFormat
};
