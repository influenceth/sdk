const START_TIMESTAMP = 1609459200; // Zero date timestamp for orbits
const LORE_TIME_DIFF = 2558; // Time in adays between zero-time for orbits and zero-time for game clock (assume gameclock zero at 1618668000)

const orbitTimeToGameTime = (orbitTime) => {
  return orbitTime - LORE_TIME_DIFF;
};

const orbitTimeToRealDate = (orbitTime) => {
  return new Date((orbitTime * 86400 / 24 + START_TIMESTAMP) * 1000);
};

const unixTimeToGameTime = (unixTime) => {
  const orbitTime = (unixTime - START_TIMESTAMP) / 3600;
  return orbitTimeToGameTime(orbitTime);
};

export default {
  LORE_TIME_DIFF,
  START_TIMESTAMP,

  orbitTimeToGameTime,
  orbitTimeToRealDate,
  unixTimeToGameTime
}