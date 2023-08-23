// TODO: remove in favor of TYPES?
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
  [IDS.DELIVERY]: { label: 'DELIVERY' },
};

const packEntity = function ({ id, label }) {
  return BigInt(id) * 65536n + BigInt(label);
};

const unpackEntity = function (value) {
  const _value = Number(value);
  const label = _value % 65536;
  const id = Math.floor((_value - label) / 65536);
  return { id, label };
};

export default {
  IDS,
  TYPES,
  
  packEntity,
  unpackEntity
};
