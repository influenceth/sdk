import Crewmate from './crewmate.js';
import Station from './station.js';

const CREWMATE_STACKING_BONUS_EFFICIENCY = [ 0.5, 1.0, 1.25, 1.375, 1.4375, 1.46875 ];
const CREWMATE_FOOD_PER_YEAR = 1000; // kg / year
const STARVING_MULTIPLIER = 0.25;
const YEAR_IN_SECONDS = 31536000; // 60 * 60 * 24 * 365

/**
 * @param {integer} abilityId Crewmate ability identifier
 * @param {[object]} crewmates Array of crewmate objects including classId, traitIds, and titleId
 * @param {object} station Station object including station_type, and population
 * @param {integer} timeSinceFed In-game seconds since the crew was last fed
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
    const crewmateCollection = crewmate.collectionId || crewmate.Crewmate?.collection || crewmate.Crewmate?.coll;

    if (crewmateClass && ability.class && crewmateClass === ability.class) {
      const info = details.class || { matches: 0 };
      info.matches++;
      details.class = info;
    }

    // If the crewmate has a title and it has a match in the departments
    const titleInfo = crewmateTitle ? Crewmate.getTitle(crewmateTitle): {};

    // Includes a half tier department bonus for Arvad Specialists
    if (titleInfo.department && ability.departments && ability.departments[titleInfo.department]) {
      const tier = titleInfo.tier + (crewmateCollection === Crewmate.COLLECTION_IDS.ARVAD_SPECIALIST ? 0.5 : 0);
      const bonusPerMatch = ability.departments[titleInfo.department] * tier;
      const info = details.titles[crewmateTitle] || { matches: 0, bonusPerMatch, bonus: 0 };
      info.matches++;
      info.bonus += bonusPerMatch;
      details.titles[crewmateTitle] = info;
      details.totalBonus += bonusPerMatch;
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
 * @param {integer} timeSinceFed In-game seconds since the crew was last fully fed
 */
const getCurrentFoodRatio = (timeSinceFed = 0) => {
  const timeSinceFedInYears = timeSinceFed / YEAR_IN_SECONDS;
  return Math.min(
    Math.max(
      0,
      1 - timeSinceFedInYears,          // (not fasting)
      0.75 - 0.5 * timeSinceFedInYears  // (fasting)
    ),
    1
  );
};

const getFoodMultiplier = (timeSinceFed = 0) => {
  return Math.min(Math.max(getCurrentFoodRatio(timeSinceFed) / 0.5, STARVING_MULTIPLIER), 1);
}

/**
 * Calculate virtual value for timeSinceFed from the current crew's food amount
 * @param {integer} currentFoodRatio Crew's total food amount / max food amount
 */
const getTimeSinceFed = (currentFoodRatio) => {
  if (currentFoodRatio >= 0.5) return (1 - currentFoodRatio) * YEAR_IN_SECONDS;
  return (1.5 - 2 * currentFoodRatio) * YEAR_IN_SECONDS;
};

export default {
  CREWMATE_STACKING_BONUS_EFFICIENCY,
  CREWMATE_FOOD_PER_YEAR,
  STARVING_MULTIPLIER,

  getAbilityBonus,
  getCurrentFoodRatio,
  getFoodMultiplier,
  getTimeSinceFed
};
