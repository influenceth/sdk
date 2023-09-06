import Entity from './entity.js';

const TYPES = {
  [Entity.IDS.ASTEROID]: { min: 4, max: 28, alpha: true, num: true, sym: true },
  [Entity.IDS.BUILDING]: { min: 4, max: 28, alpha: true, num: true, sym: true },
  [Entity.IDS.CREW]: { min: 4, max: 28, alpha: true, num: false, sym: true },
  [Entity.IDS.CREWMATE]: { min: 4, max: 28, alpha: true, num: false, sym: true },
  [Entity.IDS.SHIP]: { min: 4, max: 28, alpha: true, num: true, sym: true },
};

const getType = (entityType) => TYPES[entityType] ? { ...TYPES[entityType] } : null;

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
  isNameValid
};