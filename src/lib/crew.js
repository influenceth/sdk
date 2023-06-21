import Crewmate from './crewmate.js';

export const CLASS_EFFICIENCY = [0.5, 1.0, 1.25, 1.375, 1.4375, 1.46875];

/**
 * @param {integer} abilityId Crewmate ability identifier
 * @param {[object]} crewmates Array of crewmate objects including classId, traitIds, and titleId
 * @return The overall bonus to be applied to the ability
 */
export const getAbilityBonus = (abilityId, crewmates = []) => {
  const ability = Crewmate.getAbility(abilityId);
  const details = { name: ability.name, totalBonus: 1, traits: {}, titles: {} };
  if (ability.class) details.class = { classId: ability.class, matches: 0 };

  crewmates.forEach(crewmate => {
    crewmate = Object.assign({ traitIds: [] }, crewmate);
    if (ability.class && crewmate.classId === ability.class) {
      const info = details.class || { matches: 0 };
      info.matches++;
      details.class = info;
    }

    // If the crewmate has a title and it has a match in the ability
    if (crewmate.titleId && ability.titles && ability.titles[crewmate.titleId]) {
      const info = details.titles[crewmate.titleId] || { matches: 0, bonusPerMatch: ability.titles[crewmate.titleId], bonus: 0 };
      info.matches++;
      info.bonus += ability.titles[crewmate.titleId];
      details.titles[crewmate.titleId] = info;
      details.totalBonus += ability.titles[crewmate.titleId];
    }

    // Get traits bonuses
    crewmate.traitIds.forEach(traitId => {
      if (traitId && ability.traits && ability.traits[traitId]) {
        const info = details.traits[traitId] || { matches: 0, bonusPerMatch: ability.traits[traitId], bonus: 0 };
        info.matches++;
        info.bonus += ability.traits[traitId];
        details.traits[traitId] = info;
        details.totalBonus += ability.traits[traitId];
      }
    });
  });

  // If there's a class affinity apply it
  if (details.class) {
    details.class.multiplier = CLASS_EFFICIENCY[details.class.matches];
    details.totalBonus *= details.class.multiplier;
  }

  return details;
};

export default {
  CLASS_EFFICIENCY,
  getAbilityBonus
};
