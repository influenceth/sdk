const IDS = {
  CREW: 1,
  CREWMATE: 2,
  ASTEROID: 3,
  LOT: 4,
  BUILDING: 5,
  SHIP: 6,
  DEPOSIT: 7,
  ORDER: 8,
  DELIVERY: 9
};

const TYPES = {
  [IDS.CREW]: { label: 'CREW' },
  [IDS.CREWMATE]: { label: 'CREWMATE' },
  [IDS.ASTEROID]: { label: 'ASTEROID' },
  [IDS.LOT]: { label: 'LOT' },
  [IDS.BUILDING]: { label: 'BUILDING' },
  [IDS.SHIP]: { label: 'SHIP' },
  [IDS.DEPOSIT]: { label: 'DEPOSIT' },
  [IDS.ORDER]: { label: 'ORDER' },
  [IDS.DELIVERY]: { label: 'DELIVERY' }
};

const packEntity = function ({ id, label }, returnAsHex = true) {
  const value = BigInt(id) * 65536n + BigInt(label);
  return returnAsHex ? `0x${value.toString(16)}` : value;
};

const unpackEntity = function (value) {
  value = BigInt(value);
  const label = value % 65536n;
  const id = (value - label) / 65536n;
  return { id: Number(id), label: Number(label) };
};

const formatEntity = function (value) {
  if (!value) throw new Error('Invalid entity value');

  if (value.id && value.label) return { id: Number(value.id), label: Number(value.label) };

  if (Number(value) > 0) {
    const entity = unpackEntity(value);
    if (entity.id > 0 && entity.label > 0) return entity;
  }

  throw new Error('Invalid entity value');
};

const fromPosition = ({ asteroidId, lotId }) => {
  return { id: Number(asteroidId) + Number(lotId) * 2 ** 32, label: IDS.LOT };
};

const toPosition = (entity) => {
  entity = formatEntity(entity);
  if (entity.label !== IDS.LOT) throw new Error('Invalid entity label');

  const split = 2 ** 32;

  return {
    asteroidId: entity.id % split,
    lotId: Math.floor(entity.id / split)
  };
};

const areEqual = function (entityA, entityB) {
  if (!entityA && !entityB) throw new Error('Invalid entities');
  if (!entityA || !entityB) return false;

  if (typeof entityA === 'object' && typeof entityB === 'object') {
    if (!entityA?.id || !entityB?.label || !entityB?.id || !entityB?.label) {
      throw new Error('Invalid entities');
    }

    return Number(entityA.id) === Number(entityB.id) && Number(entityA.label) === Number(entityB.label);
  }
  return BigInt(entityA) === BigInt(entityB);
};

export default {
  IDS,
  TYPES,
  areEqual,
  formatEntity,
  packEntity,
  unpackEntity,
  fromPosition,
  toPosition
};
