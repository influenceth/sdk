import Crewmate from './crewmate.js';

const CREWMATE_STACKING_BONUS_EFFICIENCY = [ 0.5, 1.0, 1.25, 1.375, 1.4375, 1.46875 ];

/**
 * @param {integer} abilityId Crewmate ability identifier
 * @param {[object]} crewmates Array of crewmate objects including classId, traitIds, and titleId
 * @return The overall bonus to be applied to the ability
 */
const getAbilityBonus = (abilityId, crewmates = []) => {
  const ability = Crewmate.getAbility(abilityId);
  const details = { name: ability.name, totalBonus: 1, traits: {}, titles: {} };
  if (ability.class) details.class = { classId: ability.class, matches: 0 };

  crewmates.forEach(crewmate => {
    if (!crewmate) return;

    const crewmateClass = crewmate.classId || crewmate.class;
    const crewmateTitle = crewmate.titleId || crewmate.title;
    const crewmateTraits = crewmate.traitIds || crewmate.impactful || [];

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

  return details;
};

export default {
  CREWMATE_STACKING_BONUS_EFFICIENCY,
  
  getAbilityBonus,
};
