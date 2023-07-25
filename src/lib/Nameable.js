const TYPES = {
  Asteroid: { min: 4, max: 28, alpha: true, num: true, sym: true },
  Building: { min: 4, max: 28, alpha: true, num: true, sym: true },
  Crew: { min: 4, max: 28, alpha: true, num: false, sym: true },
  Crewmate: { min: 4, max: 28, alpha: true, num: false, sym: true },
  Ship: { min: 4, max: 28, alpha: true, num: true, sym: true },
};

const getType = (type) => TYPES[type] ? { ...TYPES[type] } : null;

const isNameValid = (name = '', config) => {
  if (!config) return false;
  if (config.min && name.length < config.min) return false;
  if (config.max && name.length > config.max) return false;
  if (!config.alpha && name.match(/[a-z]/i)) return false;
  if (!config.num && name.match(/[0-9]/)) return false;
  if (!config.sym && name.match(/[^a-z0-9]/i)) return false;
  return true;
};

export default {
  TYPES,

  getType,
  isNameValid
};