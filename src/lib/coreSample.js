export const MAX_YIELD = 10000; // tonnes

export const getSampleBounds = (abundance, initialYield = 0, totalBonus = 1) => {
  let lower = initialYield;
  let upper = abundance * MAX_YIELD;

  if (totalBonus < 1) upper = lower + (upper - lower) * totalBonus;
  if (totalBonus > 1) lower = upper - (upper - lower) / totalBonus;

  return { lower, upper };
};

export default {
  MAX_YIELD,
  getSampleBounds
};
