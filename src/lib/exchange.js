const IDS = {
  BASIC: 1
};

const TYPES = {
  [IDS.BASIC]: {
    i: IDS.BASIC,
    productCap: 20
  }
};

const getType = (type) => TYPES[type] ? { ...TYPES[type] } : null;

export default {
  IDS,
  TYPES,

  getType
};
