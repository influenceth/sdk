import Entity from './entity.js';

const toId = (asteroidId, lotIndex) => {
  return asteroidId && lotIndex ? Entity.fromPosition({ asteroidId, lotIndex }).id : null;
};

const toIndex = (lotId) => {
  return toPosition(lotId)?.lotIndex || -1;
};

const toPosition = (lotId) => {
  return lotId ? Entity.toPosition({ id: lotId, label: Entity.IDS.LOT }) : null;
};

export default {
  toId,
  toIndex,
  toPosition
};