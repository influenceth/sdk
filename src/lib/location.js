
const IDS = {
  ASTEROID: 'Asteroid',
  LOT: 'Lot',
  BUILDING: 'Building',
  SHIP: 'Ship',
}

const fromEntityFormat = (loc) => {
  if (!loc) return null;

  // ship -> building -> lot -> asteroid
  if (loc.label === IDS.SHIP) {
    return { shipId: loc.id };

  } else if (loc.label === IDS.BUILDING) {
    return { buildingId: loc.id };

  } else if (loc.label === IDS.LOT) {
    const split = 2 ** 32;
    return {
      asteroidId: loc.id % split,
      lotId: Math.round(loc.id / split)
    };

  } else if (loc.label === IDS.ASTEROID) {
    return { asteroidId: loc.id };
  }

  throw `Invalid location label: "${loc.label}"`;
};

const toEntityFormat = (loc) => {
  if (!loc) return null;

  // ship -> building -> lot -> asteroid
  if (loc.shipId) {
    return { label: IDS.SHIP, id: loc.shipId };

  } else if (loc.buildingId) {
    return { label: IDS.BUILDING, id: loc.buildingId };

  } else if (loc.asteroidId && loc.lotId) {
    return { label: IDS.LOT, id: loc.lotId << 32 | loc.asteroidId };

  } else if (loc.asteroidId) {
    return { label: IDS.ASTEROID, id: loc.asteroidId };
  }

  throw `Invalid location object: "${JSON.stringify(loc)}"`;
};

export default {
  IDS,

  fromEntityFormat,
  toEntityFormat,
};