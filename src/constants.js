// Influence global constants
export const MASTER_SEED = 'influence';
export const START_TIMESTAMP = 1609459200; // Zero date timestamp for orbits

// Asteroid constants and enumerables
export const MAX_RADIUS = 375142; // in meters
export const TOTAL_ASTEROIDS = 250000;
export const REGIONS = ['MainBelt', 'Trojans'];
export const SPECTRAL_TYPES = ['C', 'Cm', 'Ci', 'Cs', 'Cms', 'Cis', 'S', 'Sm', 'Si', 'M', 'I'];
export const RARITIES = ['Common', 'Uncommon', 'Rare', 'Superior', 'Exceptional', 'Incomparable'];
export const SIZES = ['Small', 'Medium', 'Large', 'Huge'];
export const BONUS_MAPS = [
  {
    spectralTypes: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    base: { name: 'Yield0', level: 0, modifier: 0, type: 'yield' },
    bonuses: [
      { position: 1, name: 'Yield1', level: 1, modifier: 3, type: 'yield' },
      { position: 2, name: 'Yield2', level: 2, modifier: 6, type: 'yield' },
      { position: 3, name: 'Yield3', level: 3, modifier: 15, type: 'yield' }
    ]
  },
  {
    spectralTypes: [0, 1, 2, 3, 4, 5, 8, 10],
    base: { name: 'Volatile0', level: 0, modifier: 0, type: 'volatile' },
    bonuses: [
      { position: 4, name: 'Volatile1', level: 1, modifier: 10, type: 'volatile' },
      { position: 5, name: 'Volatile2', level: 2, modifier: 20, type: 'volatile' },
      { position: 6, name: 'Volatile3', level: 3, modifier: 50, type: 'volatile' }
    ]
  },
  {
    spectralTypes: [1, 3, 4, 5, 6, 7, 8, 9],
    base: { name: 'Metal0', level: 0, modifier: 0, type: 'metal' },
    bonuses: [
      { position: 7, name: 'Metal1', level: 1, modifier: 10, type: 'metal' },
      { position: 8, name: 'Metal2', level: 2, modifier: 20, type: 'metal' },
      { position: 9, name: 'Metal3', level: 3, modifier: 50, type: 'metal' }
    ]
  },
  {
    spectralTypes: [0, 1, 2, 3, 4, 5],
    base: { name: 'Organic0', level: 0, modifier: 0, type: 'organic' },
    bonuses: [
      { position: 10, name: 'Organic1', level: 1, modifier: 10, type: 'organic' },
      { position: 11, name: 'Organic2', level: 2, modifier: 20, type: 'organic' },
      { position: 12, name: 'Organic3', level: 3, modifier: 50, type: 'organic' }
    ]
  },
  {
    spectralTypes: [3, 4, 5, 6, 7, 8],
    base: { name: 'RareEarth0', level: 0, modifier: 0, type: 'rareearth' },
    bonuses: [
      { position: 13, name: 'RareEarth3', level: 3, modifier: 30, type: 'rareearth' }
    ]
  },
  {
    spectralTypes: [1, 3, 4, 5, 6, 7, 8, 9],
    base: { name: 'Fissile0', level: 0, modifier: 0, type: 'fissile' },
    bonuses: [
      { position: 14, name: 'Fissile3', level: 3, modifier: 30, type: 'fissile' }
    ]
  }
];

// Crew member enumerables
export const CREW_COLLECTIONS = ['Arvad Specialist', 'Arvad Citizen', 'Arvad Leadership', 'Adalian'];
export const CREW_CLASSES = ['Pilot', 'Engineer', 'Miner', 'Merchant', 'Scientist'];
export const CREW_CLASS_DESCRIPTIONS = [
  'Often restless, always ready for adventure, pilots are happiest when flying. Their expertise gets them and their crew where they want to go quickly, safely, efficiently.',
  'If there is a problem, an engineer will find an answer. Whether it is buildings, ships, or processes, engineers are thrilled to be the one to solve the puzzle.',
  'On the surface it appears that miners value their strength over their brains, but like their quarry, the reality lies underneath: they are highly skilled and erudite in their area of expertise.',
  'Predicting the ebb and flow of the market is about more than just the raw data, it is about anticipating the needs and desires of humanity- this is what merchants strive to understand.',
  'Motivated by a desire to expand human knowledge, scientists learn from the past, while keeping their gaze steadily on the future.'
];
export const CREW_TITLES = [
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
  'Head of Engineering', 'Chief Botanist', 'Chief Cook', 'Entertainment Director', 'High Commander'];

export const CREW_SEX = ['Male', 'Female'];
export const CREW_OUTFIT = [
  'Light Spacesuit - Blue', 'Light Spacesuit - Purple', 'Light Spacesuit - Orange',
  'Heavy Spacesuit - Red', 'Heavy Spacesuit - Black', 'Heavy Spacesuit - Blue',
  'Lab Coat - White', 'Lab Coat - Yellow', 'Lab Coat - Green',
  'Tool Vest - Orange', 'Tool Vest - Green', 'Tool Vest - Yellow',
  'Jacket - Red', 'Jacket - Green', 'Jacket - Black',
  'Stationwear - Red', 'Stationwear - Green', 'Stationwear - Black',
  'Light Spacesuit - Navigation', 'Stationwear - Education', 'Stationwear - Archival',
  'Lab Coat - Medical', 'Heavy Spacesuit - Security', 'Light Spacesuit - Logistics',
  'Tool Vest - Maintenance', 'Light Spacesuit - Technology', 'Tool Vest - Engineering',
  'Lab Coat - Botany', 'Jacket - Cooking', 'Jacket - Entertainment',
  'Stationwear - Commander', 'Pilot Recruit - Primary', 'Pilot Recruit - Variant',
  'Engineer Recruit - Primary', 'Engineer Recruit - Variant', 'Miner Recruit - Primary',
  'Miner Recruit - Variant', 'Merchant Recruit - Primary', 'Merchant Recruit - Variant',
  'Scientist Recruit - Primary', 'Scientist Recruit - Variant'
];

export const CREW_HAIR = ['Bald', 'Mohawk', 'Slickback', 'Curly', 'Buzz', 'Top Knot',
  'Bun', 'Long', 'Ponytail', 'Pixie', 'Double Bun', 'Shoulder'];

export const CREW_HAIR_COLOR = ['Red', 'Gray', 'Brown', 'Blonde', 'Black'];
export const CREW_FACIAL_FEATURE = ['Scar', 'Piercing', 'Long Beard', 'Full Beard', 'Circle Beard',
  'Handlebar Mustache', 'Mustache'];

export const CREW_HEAD_PIECE = [
  'Welding Goggles', 'AR Glasses', 'Eyepatch', 'Mask', 'Helmet', 'Navigation Goggles', 'Spectacles',
  'Archival Glasses', 'Medical Glasses', 'Headset', 'Earmuffs', 'Technology Glasses', 'Botany Glasses',
  'Chef Hat', 'Eyepatch - Orange', 'Eyepatch - Gold'
];
export const CREW_BONUS_ITEM = [
  'Glow', 'Drone - Gray', 'Drone - Orange', 'Drone - Green', 'Drone - Yellow', 'Drone - Medical',
  'Drone - Technology', 'Drone - Commander'
];

export const CREW_TRAITS = [
  {
    name: 'Drive: Survival',
    type: 'cosmetic',
    description: 'You need to live. Your primary drive is the survival of yourself, the people you know, and the species.'
  },
  {
    name: 'Drive: Service',
    type: 'cosmetic',
    description: 'You need to fulfill your role. Your primary drive is to serve humanity for the greater good.'
  },
  {
    name: 'Drive: Glory',
    type: 'cosmetic',
    description: 'You need to excel. Your primary drive is to be the best at whatever you do.'
  },
  {
    name: 'Drive: Command',
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

export const RESOURCES = {
  1: { name: 'Water' },
  2: { name: 'Hydrogen' },
  3: { name: 'Ammonia' },
  4: { name: 'Nitrogen' },
  5: { name: 'Sulfur Dioxide' },
  6: { name: 'Carbon Dioxide' },
  7: { name: 'Carbon Monoxide' },
  8: { name: 'Methane' },
  9: { name: 'Apatite' },
  10: { name: 'Bitumen' },
  11: { name: 'Calcite' },
  12: { name: 'Feldspar' },
  13: { name: 'Olivine' },
  14: { name: 'Pyroxene' },
  15: { name: 'Coffinite' },
  16: { name: 'Merrillite' },
  17: { name: 'Xenotime' },
  18: { name: 'Rhabdite' },
  19: { name: 'Graphite' },
  20: { name: 'Taenite' },
  21: { name: 'Troilite' },
  22: { name: 'Uraninite' }
};
