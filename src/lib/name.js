import Entity from './entity.js';

const TYPES = {
  [Entity.IDS.ASTEROID]: { min: 4, max: 28, alpha: true, num: true, sym: true },
  [Entity.IDS.BUILDING]: { min: 4, max: 28, alpha: true, num: true, sym: true },
  [Entity.IDS.CREW]: { min: 4, max: 28, alpha: true, num: false, sym: true },
  [Entity.IDS.CREWMATE]: { min: 4, max: 28, alpha: true, num: false, sym: true },
  [Entity.IDS.SHIP]: { min: 4, max: 28, alpha: true, num: true, sym: true },
};

const getType = (entityType) => TYPES[entityType] ? { ...TYPES[entityType] } : null;

const getTypeRegex = (entityType) => {
  if (!Name.TYPES[entityType]) return null;

  const { min, max, alpha, num, sym } = Name.TYPES[entityType];
  let regexPart;
  if (sym) {
    if (alpha && num) regexPart = `[^\\s]`;
    else if (alpha && !num) regexPart = `[^0-9\\s]`;
    else if (!alpha && num) regexPart = `[^a-zA-Z\\s]`;
    else if (!alpha && !num) regexPart = `[^a-zA-Z0-9\\s]`;
  } else {
    regexPart = `[${alpha ? 'a-zA-Z' : ''}${num ? '0-9' : ''}]`;
  }

  return `^(?=.{${min},${max}}$)(${regexPart}+\\s)*${regexPart}+$`;
};

const getNameError = (name = '', config) => {
  if (!config) return 'Invalid type specified.'
  if (config.min && name.length < config.min) return `Name must have a minimum length of ${config.min}.`;
  if (config.max && name.length > config.max) return `Name can have a maximum length of ${config.max}.`;
  if (!config.alpha && name.match(/[a-z]/i)) return `Name cannot contain letters.`;
  if (!config.num && name.match(/[0-9]/)) return `Name cannot contain numbers.`;
  if (!config.sym && name.match(/[^a-z0-9]/i)) return `Name cannot contain symbols.`;
  return null;
}

const isNameValid = (name = '', config) => {
  if (getNameError(name, config)) return false;
  return true;
};

export default {
  TYPES,

  getNameError,
  getType,
  getTypeRegex,
  isNameValid
};