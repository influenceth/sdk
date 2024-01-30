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
  const uuidInt = BigInt(id) * 65536n + BigInt(label);
  return returnAsHex ? `0x${uuidInt.toString(16)}` : uuidInt;
};

const unpackEntity = function (uuid) {
  uuid = BigInt(uuid);
  const label = uuid % 65536n;
  const id = (uuid - label) / 65536n;
  return { id: Number(id), label: Number(label), uuid };
};

const formatEntity = function (value) {
  if (!value) throw new Error('Invalid entity value');

  if (value.id && value.label) return { id: Number(value.id), label: Number(value.label), uuid: packEntity(value) };

  if (value.uuid) return unpackEntity(value.uuid);

  if (Number(value) > 0) {
    const entity = unpackEntity(value);
    if (entity.id > 0 && entity.label > 0) return entity;
  }

  throw new Error('Invalid entity value');
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
  unpackEntity
};
