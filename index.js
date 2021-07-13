const MASTER_SEED = 'influence';
const START_TIMESTAMP = 1609459200; // Zero date timestamp for orbits
const MAX_RADIUS = 375142; // in meters
const TOTAL_ASTEROIDS = 250000;
const REGIONS = [ 'MainBelt', 'Trojans' ];
const SPECTRAL_TYPES = [ 'C', 'Cm', 'Ci', 'Cs', 'Cms', 'Cis', 'S', 'Sm', 'Si', 'M', 'I' ];
const RARITIES = [ 'Common', 'Uncommon', 'Rare', 'Superior', 'Exceptional', 'Incomparable' ];
const SIZES = [ 'Small', 'Medium', 'Large', 'Huge' ]
const BONUS_MAPS = [
  {
    spectralTypes: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ],
    base: { name: 'Yield0', level: 0, modifier: 0, type: 'yield' },
    bonuses: [
      { position: 1, name: 'Yield1', level: 1, modifier: 3, type: 'yield' },
      { position: 2, name: 'Yield2', level: 2, modifier: 6, type: 'yield' },
      { position: 3, name: 'Yield3', level: 3, modifier: 15, type: 'yield' }
    ]
  },
  {
    spectralTypes: [ 0, 1, 2, 3, 4, 5, 8, 10 ],
    base: { name: 'Volatile0', level: 0, modifier: 0, type: 'volatile' },
    bonuses: [
      { position: 4, name: 'Volatile1', level: 1, modifier: 10, type: 'volatile' },
      { position: 5, name: 'Volatile2', level: 2, modifier: 20, type: 'volatile' },
      { position: 6, name: 'Volatile3', level: 3, modifier: 50, type: 'volatile' }
    ]
  },
  {
    spectralTypes: [ 1, 3, 4, 5, 6, 7, 8, 9 ],
    base: { name: 'Metal0', level: 0, modifier: 0, type: 'metal' },
    bonuses: [
      { position: 7, name: 'Metal1', level: 1, modifier: 10, type: 'metal' },
      { position: 8, name: 'Metal2', level: 2, modifier: 20, type: 'metal' },
      { position: 9, name: 'Metal3', level: 3, modifier: 50, type: 'metal' }
    ]
  },
  {
    spectralTypes: [ 0, 1, 2, 3, 4, 5 ],
    base: { name: 'Organic0', level: 0, modifier: 0, type: 'organic' },
    bonuses: [
      { position: 10, name: 'Organic1', level: 1, modifier: 10, type: 'organic' },
      { position: 11, name: 'Organic2', level: 2, modifier: 20, type: 'organic' },
      { position: 12, name: 'Organic3', level: 3, modifier: 50, type: 'organic' }
    ]
  },
  {
    spectralTypes: [ 3, 4, 5, 6, 7, 8 ],
    base: { name: 'RareEarth0', level: 0, modifier: 0, type: 'rareearth' },
    bonuses: [
      { position: 13, name: 'RareEarth3', level: 3, modifier: 30, type: 'rareearth' }
    ]
  },
  {
    spectralTypes: [ 1, 3, 4, 5, 6, 7, 8, 9 ],
    base: { name: 'Fissile0', level: 0, modifier: 0, type: 'fissile' },
    bonuses: [
      { position: 14, name: 'Fissile3', level: 3, modifier: 30, type: 'fissile' }
    ]
  }
];

/**
 * Returns the bonus information based on its position in the bitpacked bonuses int
 * @param num Position in the bitpacked bonuses int
 */
const toBonus = (num) => {
  if (num < 1 || num > 14) return '';
  let bonus;

  for (let b of BONUS_MAPS) {
    bonus = b.bonuses.find(p => p.position === num);
    if (!!bonus) return bonus;
  }
};

/**
 * Converts packed bonuses into an array of bonus types including base types
 * @param spectralType The spectral type (int) of the asteroid
 * @param packed The bitpacked bonuses int
 */
const toBonuses = (packed, spectralType) => {
  if (spectralType === undefined) throw new Error('Spectral type is required');

  const bonuses = [];
  let b, p, added;

  for (b of BONUS_MAPS) {

    if (b.spectralTypes.includes(spectralType)) {
      added = false;

      for (p of b.bonuses) {

        if ((packed & (1 << p.position)) > 0) {
          bonuses.push(p);
          added = true;
        }
      }

      if (!added) bonuses.push(b.base);
    }
  }

  return bonuses;
};

/**
 * Returns the rarity level of the asteroid based on the bonuses and size
 * @param bonuses
 * @param radius
 */
const toRarity = (bonuses) => {
  let rarity = 0;

  for (b of bonuses) {
    rarity += b.level;
  }

  if (rarity <= 3) return RARITIES[rarity];
  if (rarity <= 5) return RARITIES[4];
  return RARITIES[5];
};

/**
 * Returns whether the asteroid has been scanned based on its bitpacked bonuses int
 * @param packed The bitpacked bonuses int
 */
const isScanned = (packed) => {
  return ((packed & (1 << 0)) > 0);
}

/**
 * Returns the spectral type string based on its array value
 * @param num The spectral type int value
 */
const toSpectralType = (num) => {
  if (num < 0 || num > 10) return '';
  return SPECTRAL_TYPES[num];
};

/**
 * Returns the size string based on the asteroid radius
 * @param rad The asteroid radius int value
 */
const toSize = (rad) => {
  if (rad <= 5000) return SIZES[0]
  if (rad <= 20000) return SIZES[1]
  if (rad <= 50000) return SIZES[2]
  return SIZES[3]
}

class KeplerianOrbit {
  constructor(elements) {
    this.a = elements.a; // Semi-major axis
    this.e = elements.e; // Eccentricity
    this.i = elements.i; // Inclination
    this.o = elements.o; // Longitude of ascending node
    this.w = elements.w; // Argument of periapsis
    this.m = elements.m; // Mean anomoly at epoch
  }

  /**
    * The distance in AU from center of the ellipse to the object
    * @param t Angular parameter (in radians)
    */
  getRadius(t) {
    const a = this.a;
    const e = this.e;
    return a * (1 - Math.pow(e, 2)) / (1 + e * Math.cos(t));
  }

  /**
   * Returns Cartesian coordinates at a specific angular parameter
   * @param t Angular parmeter (in radians)
   */
  getPosByAngle(t) {
    const i = this.i;
    const o = this.o;
    const w = this.w;

    // Distance to the point from the orbit focus.
    const r = this.getRadius(t);

    // Cartesian transformation
    const x = r * (Math.cos(o) * Math.cos(t + w) - Math.sin(o) * Math.sin(t + w) * Math.cos(i));
    const y = r * (Math.sin(o) * Math.cos(t + w) + Math.cos(o) * Math.sin(t + w) * Math.cos(i));
    const z = r * (Math.sin(t + w) * Math.sin(i));

    const point = { x: x, y: y, z: z };
    return point;
  }

  /**
   * Retrieves the orbital period in days
   */
  getPeriod() {
    const thirdLaw = 0.000007495; // R^3 / T^2
    return Math.sqrt(Math.pow(this.a, 3) / thirdLaw);
  }

  /**
   * Retrieves Cartesian coordinates in AU at a specified elapsed time
   * @param elapsed Time in days (in-game) since game START_TIMESTAMP
   */
  getPositionAtTime(elapsed) {
    const a = this.a;
    const e = this.e;
    const i = this.i;
    const o = this.o;
    const w = this.w;
    const m = this.m;

    // Calculate the longitude of perihelion
    const p = w + o;

    // Calculate mean motion based on assumption that mass of asteroid <<< Sun
    const k = 0.01720209895; // Gaussian constant (units are days and AU)
    const n = k / Math.sqrt(Math.pow(a, 3)); // Mean motion

    // Calcualate the mean anomoly at elapsed time
    const M = m + (n * elapsed);

    // Estimate the eccentric and true anomolies using an iterative approximation
    let E1;
    let E = M;
    let lastDiff = 1;

    while (lastDiff > 0.0000001) {
      E1 = M + (e * Math.sin(E));
      lastDiff = Math.abs(E1 - E);
      E = E1;
    }

    // Calculate in heliocentric polar and then convert to cartesian
    const v = 2 * Math.atan(Math.sqrt((1 + e) / (1 - e)) * Math.tan(E / 2));
    const r = a * (1 - Math.pow(e, 2)) / (1 + e * Math.cos(v)); // Current radius in AU

    const pos = {
      x: r * (Math.cos(o) * Math.cos(v + p - o) - (Math.sin(o) * Math.sin(v + p - o) * Math.cos(i))),
      y: r * (Math.sin(o) * Math.cos(v + p - o) + Math.cos(o) * Math.sin(v + p - o) * Math.cos(i)),
      z: r * Math.sin(v + p - o) * Math.sin(i)
    };

    return {
      x: +pos.x.toFixed(10),
      y: +pos.y.toFixed(10),
      z: +pos.z.toFixed(10)
    }
  }
};

/**
 * ABIs for client interaction with Influence
 */
const contracts = require('./contracts.json');

module.exports = {
  MASTER_SEED,
  START_TIMESTAMP,
  MAX_RADIUS,
  TOTAL_ASTEROIDS,
  REGIONS,
  SPECTRAL_TYPES,
  toBonus,
  toBonuses,
  toRarity,
  isScanned,
  toSpectralType,
  toSize,
  KeplerianOrbit,
  contracts
};
