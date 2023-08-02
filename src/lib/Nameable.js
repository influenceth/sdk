const TYPES = {
  Asteroid: { min: 4, max: 28, alpha: true, num: true, sym: true },
  Building: { min: 4, max: 28, alpha: true, num: true, sym: true },
  Crew: { min: 4, max: 28, alpha: true, num: false, sym: true },
  Crewmate: { min: 4, max: 28, alpha: true, num: false, sym: true },
  Ship: { min: 4, max: 28, alpha: true, num: true, sym: true },
};

const getType = (type) => TYPES[type] ? { ...TYPES[type] } : null;

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