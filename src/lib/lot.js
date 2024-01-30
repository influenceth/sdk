import Entity from './entity.js';

const toId = (asteroidId, lotIndex) => {
  return asteroidId && lotIndex
    ? (Number(asteroidId) + Number(lotIndex) * 2 ** 32)
    : null;
};

const toIndex = (lotId) => {
  return toPosition(lotId)?.lotIndex || 0;
};

const toPosition = (entityOrLotId) => {
  let lotId;
  if (entityOrLotId && typeof entityOrLotId === 'object') {
    if (entityOrLotId.label !== Entity.IDS.LOT) throw new Error('Invalid entity label');
    lotId = entityOrLotId.id;
  } else {
    lotId = entityOrLotId;
  }

  if (!lotId) return null;

  const split = 2 ** 32;
  return {
    asteroidId: lotId % split,
    lotIndex: Math.floor(lotId / split)
  };
};

export default {
  toId,
  toIndex,
  toPosition
};
