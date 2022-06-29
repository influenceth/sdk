// Influence global constants
const MASTER_SEED = 'influence';
const START_TIMESTAMP = 1609459200; // Zero date timestamp for orbits

// Asteroid constants and enumerables
const MAX_RADIUS = 375142; // in meters
const TOTAL_ASTEROIDS = 250000;
const REGIONS = [ 'MainBelt', 'Trojans' ];
const SPECTRAL_TYPES = [ 'C', 'Cm', 'Ci', 'Cs', 'Cms', 'Cis', 'S', 'Sm', 'Si', 'M', 'I' ];
const RARITIES = [ 'Common', 'Uncommon', 'Rare', 'Superior', 'Exceptional', 'Incomparable' ];
const SIZES = [ 'Small', 'Medium', 'Large', 'Huge' ];
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

// Crew member enumerables
const CREW_COLLECTIONS = [ 'Arvad Specialist', 'Arvad Citizen', 'Arvad Leadership' ];
const CREW_CLASSES = [ 'Pilot', 'Engineer', 'Miner', 'Merchant', 'Scientist' ];
const CREW_TITLES = [
  'Communications Officer', 'Teaching Assistant', 'Librarian', 'Nurse', 'Public Safety Officer', 'Warehouse Worker',
  'Maintenance Technician', 'Systems Administrator', 'Structural Engineer', 'Farmer', 'Line Cook', 'Artist',
  'Block Captain', 'Observatory Technician', 'Teacher', 'Historian', 'Physician Assistant', 'Security Officer',
  'Logistics Specialist', 'Electrician', 'Software Engineer', 'Life Support Engineer', 'Field Botanist',
  'Section Cook', 'Author', 'Delegate', 'Cartographer', 'Professor', 'Archivist', 'Resident Physician',
  'Tactical Officer', 'Warehouse Manager', 'EVA Technician', 'Embedded Engineer', 'Propulsion Engineer',
  'Nutritionist', 'Kitchen Manager', 'Musician', 'Councilor', 'Navigator', 'Distinguished Professor', 'Curator',
  'Physician', 'Intelligence Officer', 'Logistics Manager', 'Facilities Supervisor', 'Systems Architect',
  'Reactor Engineer', 'Plant Geneticist', 'Chef', 'Actor', 'Justice', 'Chief Navigator', 'Provost', 'Chief Archivist',
  'Chief Medical Officer', 'Head of Security', 'Chief Logistics Officer', 'Chief Steward', 'Chief Technology Officer',
  'Head of Engineering', 'Chief Botanist', 'Chief Cook', 'Entertainment Director', 'High Commander' ];

const CREW_SEX = [ 'Male', 'Female' ];
const CREW_OUTFIT = [
  'Light Spacesuit - Blue', 'Light Spacesuit - Purple', 'Light Spacesuit - Orange',
  'Heavy Spacesuit - Red', 'Heavy Spacesuit - Black', 'Heavy Spacesuit - Blue',
  'Lab Coat - White', 'Lab Coat - Yellow', 'Lab Coat - Green',
  'Tool Vest - Orange', 'Tool Vest - Green', 'Tool Vest - Yellow',
  'Jacket - Red', 'Jacket - Green', 'Jacket - Black',
  'Stationwear - Red',  'Stationwear - Green', 'Stationwear - Black',
  'Light Spacesuit - Navigation', 'Stationwear - Education', 'Stationwear - Archival',
  'Lab Coat - Medical', 'Heavy Spacesuit - Security', 'Light Spacesuit - Logistics',
  'Tool Vest - Maintenance', 'Light Spacesuit - Technology', 'Tool Vest - Engineering',
  'Lab Coat - Botany', 'Jacket - Cooking', 'Jacket - Entertainment',
  'Stationwear - Commander'
];

const CREW_HAIR = [ 'Bald', 'Mohawk', 'Slickback', 'Curly', 'Buzz', 'Top Knot',
  'Bun', 'Long', 'Ponytail', 'Pixie', 'Double Bun', 'Shoulder' ];

const CREW_HAIR_COLOR = [ 'Red', 'Gray', 'Brown', 'Blonde', 'Black' ];
const CREW_FACIAL_FEATURE = [ 'Scar', 'Piercing', 'Long Beard', 'Full Beard', 'Circle Beard',
  'Handlebar Mustache', 'Mustache' ];

const CREW_HEAD_PIECE = [
  'Welding Goggles', 'AR Glasses', 'Eyepatch', 'Mask', 'Helmet', 'Navigation Goggles', 'Spectacles',
  'Archival Glasses', 'Medical Glasses', 'Headset', 'Earmuffs', 'Technology Glasses', 'Botany Glasses',
  'Chef Hat', 'Eyepatch - Orange', 'Eyepatch - Gold'
];
const CREW_BONUS_ITEM = [
  'Glow', 'Drone - Gray', 'Drone - Orange', 'Drone - Green', 'Drone - Yellow', 'Drone - Medical',
  'Drone - Technology', 'Drone - Commander'
];

const CREW_TRAITS = [
  {
    name: 'Survival',
    type: 'cosmetic',
    description: 'You need to live. Your primary drive is the survival of yourself, the people you know, and the species.'
  },
  {
    name: 'Service',
    type: 'cosmetic',
    description: 'You need to fulfill your role. Your primary drive is to serve humanity for the greater good.'
  },
  {
    name: 'Glory',
    type: 'cosmetic',
    description: 'You need to excel. Your primary drive is to be the best at whatever you do.'
  },
  {
    name: 'Command',
    type: 'cosmetic',
    description: 'You need to be in control. Your primary drive is to lead others in what you know to be the right direction.'
  },
  {
    name: 'Adventurous',
    type: 'cosmetic',
    description: 'You are bold, brave, and intrepid. You recognize that in order to move humanity forward, it is sometimes necessary to take that giant leap for mankind.'
  },
  {
    name: 'Ambitious',
    type: 'cosmetic',
    description: 'You know what needs to be done, and you know that you are the one who can do it. You are driven to succeed, no matter the obstacles.'
  },
  {
    name: 'Arrogant',
    type: 'cosmetic',
    description: 'Hubris may have been the downfall of lesser people, but you are steadfastly confident in your own abilities. Let other people be led around by those stronger than themselves, you know what you are capable of.'
  },
  {
    name: 'Cautious',
    type: 'cosmetic',
    description: 'Let others leap before they look. You will stay with what you know works, until there is some proof that another course is safer.'
  },
  {
    name: 'Creative',
    type: 'cosmetic',
    description: 'You seek to bring new ideas to light. Your mind is constantly wandering to the question "what if..." You want to see if you can explain the "unexplainable".'
  },
  {
    name: 'Curious',
    type: 'cosmetic',
    description: 'You are excited to open your mind and learn something new. The universe is full of the undiscovered just waiting to be discovered.'
  },
  {
    name: 'Fierce',
    type: 'cosmetic',
    description: 'You are a forceful person who is drawn to intensity. You have strong convictions and seek out others who do as well.'
  },
  {
    name: 'Flexible',
    type: 'cosmetic',
    description: 'You are open-minded and able to quickly analyze new ideas. You are not stuck in the past and are always ready to respond to new challenges.'
  },
  {
    name: 'Frantic',
    type: 'cosmetic',
    description: 'You are prone to anxiety and always forget your towel.'
  },
  {
    name: 'Hopeful',
    type: 'cosmetic',
    description: 'You know the risks, you understand the downsides, but you just can\'t help your optimism. Besides, when has humanity ever truly expanded its abilities except when it held onto hope in the face of adversity?'
  },
  {
    name: 'Independent',
    type: 'cosmetic',
    description: 'You are free-thinking and not prone to blindly following orders, unless there is a very good explanation behind those orders.'
  },
  {
    name: 'Irrational',
    type: 'cosmetic',
    description: 'You don\'t waste your time with logic, at least not the type that makes sense to anyone else. You have never had the dubious honor of being called "reasonable."'
  },
  {
    name: 'Loyal',
    type: 'cosmetic',
    description: 'You understand the importance of staying the course and trusting those around you to make rational decisions.'
  },
  {
    name: 'Pragmatic',
    type: 'cosmetic',
    description: 'Instead of wasting time wishing for a better reality, you are firmly rooted in your present situation. You prefer to find the most practical solution to a problem, even if it isn\'t always the most desirable.'
  },
  {
    name: 'Rational',
    type: 'cosmetic',
    description: 'You try not to let messy emotions cloud your thinking. Logic is the only reliable constant in the universe.'
  },
  {
    name: 'Reckless',
    type: 'cosmetic',
    description: 'You believe that anyone who takes life too seriously will never know its true enjoyment. Meticulous plans and detailed outcome calculations are for others to worry about.'
  },
  {
    name: 'Regressive',
    type: 'cosmetic',
    description: 'You look to the past and rely on what others have built or imagined. You prefer to rely upon what is tried and true, rather than innovate yourself into a disaster.'
  },
  {
    name: 'Serious',
    type: 'cosmetic',
    description: 'You have no time for self-indulgent nonsense. You understand your role and responsibilities in the universe and you wish that others understood theirs.'
  },
  {
    name: 'Steadfast',
    type: 'cosmetic',
    description: 'You are firm in your beliefs and prefer to rely on what is known, rather than dream about what could be. You believe that experience is the best teacher.'
  },
  {
    name: 'Council Loyalist',
    type: 'cosmetic',
    description: 'You are loyal to the Prime Council and the last High Commander of the Arvad. '
  },
  {
    name: 'Council Moderate',
    type: 'cosmetic',
    description: 'You believe that there is no better alternative to the Prime Council and the last High Commander of the Arvad. '
  },
  {
    name: 'Independent Moderate',
    type: 'cosmetic',
    description: 'You are critical of the leadership of the Prime Council and the last High Commander of the Arvad.'
  },
  {
    name: 'Independent Radical',
    type: 'cosmetic',
    description: 'You openly oppose the leadership of the Prime Council or the last High Commander of the Arvad. '
  },
  {
    name: 'Navigator',
    type: 'impactful',
    description: 'You have increased ship fuel efficency while travelling.'
  },
  {
    name: 'Dietitian',
    type: 'impactful',
    description: 'You have decreased food consumption needs among your crew.'
  },
  {
    name: 'Refiner',
    type: 'impactful',
    description: 'You have increased refining yield while refining raw mined materials.'
  },
  {
    name: 'Surveyor',
    type: 'impactful',
    description: 'You have increased core sampling speed while surveying an asteroid.'
  },
  {
    name: 'Hauler',
    type: 'impactful',
    description: 'You have increased ship cargo capacity while travelling.'
  },
  {
    name: 'Optimistic',
    type: 'cosmetic',
    description: 'You know that no matter how dark it may seem now, dawn is just over the horizon.'
  },
  {
    name: 'Thoughtful',
    type: 'cosmetic',
    description: 'You are not quick to choose. You often prefer to wait for more information before committing yourself.'
  },
  {
    name: 'Pessimistic',
    type: 'cosmetic',
    description: 'You see no point in trying to fool yourself or anyone else. You often expect the worst and are rarely surprised by reality.'
  },
  {
    name: 'Righteous',
    type: 'cosmetic',
    description: 'You believe that you are virtuous and hold others to a high moral standard.'
  },
  {
    name: 'Communal',
    type: 'cosmetic',
    description: 'You believe in community and cooperation. We can all succeed, if we work together.'
  },
  {
    name: 'Impartial',
    type: 'cosmetic',
    description: 'You are capable of viewing many issues without bias or prejudice.'
  },
  {
    name: 'Enterprising',
    type: 'cosmetic',
    description: 'You are resourceful and able to build on the ideas of others.'
  },
  {
    name: 'Opportunistic',
    type: 'cosmetic',
    description: 'You believe in taking advantage of being in the right place at the right time.'
  },
  {
    name: 'Buster',
    type: 'impactful',
    description: 'You have increased top ship acceleration.'
  },
  {
    name: 'Mogul',
    type: 'impactful',
    description: 'You have increased market volume capacity.'
  },
  {
    name: 'Scholar',
    type: 'impactful',
    description: 'You have decreased time to next technology.'
  },
  {
    name: 'Recycler',
    type: 'impactful',
    description: 'You have decreased loss when reprocessing materials.'
  },
  {
    name: 'Mechanic',
    type: 'impactful',
    description: 'You have decreased cost for ship repair.'
  },
  {
    name: 'Operator',
    type: 'impactful',
    description: 'You have reduced rate of wear during ship operation.'
  },
  {
    name: 'Logistician',
    type: 'impactful',
    description: 'You have reduced surface transport fuel costs.'
  },
  {
    name: 'Experimenter',
    type: 'impactful',
    description: 'You have decreased time to next invention.'
  },
  {
    name: 'Builder',
    type: 'impactful',
    description: 'You have decreased assembly waste.'
  },
  {
    name: 'Prospector',
    type: 'impactful',
    description: 'You have increased viability gain per core sample.'
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
  if (rad <= 5000) return SIZES[0];
  if (rad <= 20000) return SIZES[1];
  if (rad <= 50000) return SIZES[2];
  return SIZES[3];
};

/**
 * Returns the collection name the crew member is a part of
 * @param c The unpacked collection id
 */
const toCrewCollection = (c) => CREW_COLLECTIONS[c - 1];

/**
 * Returns the crew class string based on the unpacked class id
 * @param c The unpacked class id
 */
const toCrewClass = (c) => CREW_CLASSES[c - 1];

/**
 * Returns the crew title based on the unpacked title id
 * @param t The unpacked title id
 */
const toCrewTitle = (t) => CREW_TITLES[t - 1];

const toCrewSex = (s) => CREW_SEX[s - 1];
const toCrewOutfit = (o) => CREW_OUTFIT[o - 1];
const toCrewHair = (h) => CREW_HAIR[h];
const toCrewHairColor = (h) => CREW_HAIR_COLOR[h - 1];
const toCrewFacialFeature = (f) => CREW_FACIAL_FEATURE[f - 1];
const toCrewHeadPiece = (h) => CREW_HEAD_PIECE[h - 1];
const toCrewItem = (i) => CREW_BONUS_ITEM[i - 1];
const toCrewTrait = (t) => CREW_TRAITS[t - 1];

/**
 * Class that defines an orbit and provides convenience conversion methods
 */
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
   * Returns an numPoints sized array of uniformly (in radians) separated points along the orbit path
   * @param numPoints Number of points to create along an orbit
   */
  getSmoothOrbit(numPoints) {
    const points = [];
    const delta = 2 * Math.PI / numPoints;
    let angle = 0;

    for (let i = 0; i < numPoints; i++) {
      points.push(this.getPosByAngle(angle));
      angle += delta;
    }

    return points;
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
  RARITIES,
  SIZES,
  BONUS_MAPS,
  CREW_COLLECTIONS,
  CREW_CLASSES,
  CREW_TITLES,
  CREW_SEX,
  CREW_OUTFIT,
  CREW_HAIR,
  CREW_HAIR_COLOR,
  CREW_FACIAL_FEATURE,
  CREW_HEAD_PIECE,
  CREW_BONUS_ITEM,
  CREW_TRAITS,
  toBonus,
  toBonuses,
  toRarity,
  isScanned,
  toSpectralType,
  toSize,
  toCrewCollection,
  toCrewClass,
  toCrewTitle,
  toCrewSex,
  toCrewOutfit,
  toCrewHair,
  toCrewHairColor,
  toCrewFacialFeature,
  toCrewHeadPiece,
  toCrewItem,
  toCrewTrait,
  KeplerianOrbit,
  contracts
};
