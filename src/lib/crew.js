import Crewmate from './crewmate.js';
import Station from './station.js';

const CREWMATE_STACKING_BONUS_EFFICIENCY = [ 0.5, 1.0, 1.25, 1.375, 1.4375, 1.46875 ];
const CREWMATE_FOOD_PER_YEAR = 1000; // kg / year
const STARVING_MULTIPLIER = 0.25;

/**
 * @param {integer} abilityId Crewmate ability identifier
 * @param {[object]} crewmates Array of crewmate objects including classId, traitIds, and titleId
 * @param {object} station Station object including station_type, and population
 * @param {integer} timeSinceFed In-game seconds since the crew was last fed (adjust with acceleration first)
 * @return The overall bonus to be applied to the ability
 */
const getAbilityBonus = (abilityId, crewmates = [], station = {}, timeSinceFed = 0) => {
  const ability = Crewmate.getAbility(abilityId);
  const details = {
    name: ability.name,
    totalBonus: 1,
    traits: {},
    titles: {},
    foodMultiplier: 1,
    stationMultiplier: 1
  };

  if (ability.class) details.class = { classId: ability.class, matches: 0 };

  crewmates.forEach(crewmate => {
    if (!crewmate) return;

    const crewmateClass = crewmate.classId || crewmate.Crewmate?.class;
    const crewmateTitle = crewmate.titleId || crewmate.Crewmate?.title;
    const crewmateTraits = crewmate.traitIds || crewmate.Crewmate?.impactful || [];

    if (crewmateClass && ability.class && crewmateClass === ability.class) {
      const info = details.class || { matches: 0 };
      info.matches++;
      details.class = info;
    }

    // If the crewmate has a title and it has a match in the ability
    if (crewmateTitle && ability.titles && ability.titles[crewmateTitle]) {
      const info = details.titles[crewmateTitle] || { matches: 0, bonusPerMatch: ability.titles[crewmateTitle], bonus: 0 };
      info.matches++;
      info.bonus += ability.titles[crewmateTitle];
      details.titles[crewmateTitle] = info;
      details.totalBonus += ability.titles[crewmateTitle];
    }

    // Get traits bonuses
    if (crewmateTraits.length > 0) {
      crewmateTraits.forEach((traitId) => {
        if (traitId && ability.traits && ability.traits[traitId]) {
          const info = details.traits[traitId] || { matches: 0, bonusPerMatch: ability.traits[traitId], bonus: 0 };
          info.matches++;
          info.bonus += ability.traits[traitId];
          details.traits[traitId] = info;
          details.totalBonus += ability.traits[traitId];
        }
      });
    }
  });

  // If there's a class affinity apply it
  if (details.class) {
    details.class.multiplier = CREWMATE_STACKING_BONUS_EFFICIENCY[details.class.matches];
    details.totalBonus *= details.class.multiplier;
  }

  // Get station bonus
  if (station.stationType && station.population) {
    details.stationMultiplier = Station.getEfficiency(station.stationType, station.population);
    details.totalBonus *= details.stationMultiplier;
  }

  // Calculate food bonus
  details.foodMultiplier = getFoodMultiplier(timeSinceFed);
  details.totalBonus *= details.foodMultiplier;

  return details;
};

/**
 * @param {integer} timeSinceFed In-game seconds since the crew was last fed (adjust with acceleration first)
 */
const getCurrentFood = (timeSinceFed = 0) => {
  const timeInYears = timeSinceFed / 31536000; // 60 * 60 * 24 * 365
  const fullTime = CREWMATE_FOOD_PER_YEAR * (1 - timeInYears); // 1000 - 1000x
  const fastTime = (CREWMATE_FOOD_PER_YEAR * 3 / 4) - ((CREWMATE_FOOD_PER_YEAR / 2) * timeInYears); // 750 - 500x
  return Math.max(fullTime, fastTime, 0);
};

const getFoodMultiplier = (timeSinceFed = 0) => {
  return Math.min(Math.max(getCurrentFood(timeSinceFed) / (CREWMATE_FOOD_PER_YEAR / 2), STARVING_MULTIPLIER), 1);
}

export default {
  CREWMATE_STACKING_BONUS_EFFICIENCY,
  CREWMATE_FOOD_PER_YEAR,
  STARVING_MULTIPLIER,

  getAbilityBonus,
  getCurrentFood,
  getFoodMultiplier
};
