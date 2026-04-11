import starknetComponents from '../contracts/starknet_components.json' assert { type: 'json' };

/**
 * Converts a snake_case string to camelCase
 * @param {string} str - snake_case string
 * @returns {string} camelCase string
 */
const snakeToCamel = (str) => str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

/**
 * Creates a camelCase-mapped component object from raw on-chain snake_case data.
 * Property names from StarkNet contracts are in snake_case; the SDK entity
 * libraries (e.g. Asteroid.Component.getBonuses) expect camelCase.
 *
 * @param {string} componentName - The component name as it appears in starknet_components.json
 *   (e.g. 'Celestial', 'Crew', 'Building'). The full ABI key
 *   (e.g. 'influence::components::celestial::Celestial') is also accepted.
 * @param {object} rawData - Raw component data from chain (snake_case keys)
 * @returns {object} Component instance with camelCase properties
 *
 * @example
 * // Raw data from ReadComponent system call
 * const rawCelestial = {
 *   celestial_type: 3n,
 *   mass: { mag: 123456n, sign: false },
 *   radius: { mag: 789n, sign: false },
 *   scan_status: 4n,
 *   bonuses: 12345n,
 *   abundances: 67890n
 * };
 * const celestial = Component.fromChain('Celestial', rawCelestial);
 * // celestial.celestialType, celestial.scanStatus, etc. are now available
 * // Use directly with entity library methods:
 * Asteroid.Component.getBonuses(celestial);
 */
const fromChain = (componentName, rawData) => {
  if (!rawData || typeof rawData !== 'object') {
    throw new Error('rawData must be a non-null object');
  }

  // Resolve the full ABI key – accept either short name (e.g. 'Celestial') or full path
  const abiKey = componentName.includes('::')
    ? componentName
    : Object.keys(starknetComponents).find((k) => k.endsWith(`::${componentName}`));

  if (!abiKey) {
    throw new Error(`Unknown component: "${componentName}". Available: ${getComponentNames().join(', ')}`);
  }

  const schema = starknetComponents[abiKey];
  const members = schema?.members ?? [];

  const result = {};

  // Map each defined member from snake_case to camelCase
  for (const member of members) {
    const snakeKey = member.name;
    const camelKey = snakeToCamel(snakeKey);
    if (Object.prototype.hasOwnProperty.call(rawData, snakeKey)) {
      result[camelKey] = rawData[snakeKey];
    }
  }

  // Preserve any extra keys not in the schema (pass-through, still converting names)
  for (const key of Object.keys(rawData)) {
    const camelKey = snakeToCamel(key);
    if (!Object.prototype.hasOwnProperty.call(result, camelKey)) {
      result[camelKey] = rawData[key];
    }
  }

  return result;
};

/**
 * Returns the list of available component short names from the ABI.
 * @returns {string[]}
 */
const getComponentNames = () =>
  Object.keys(starknetComponents).map((k) => k.split('::').pop());

/**
 * Returns the ABI schema for a component by name.
 * @param {string} componentName - Short name (e.g. 'Celestial') or full ABI key
 * @returns {object} ABI schema object with `type` and `members` fields
 */
const getSchema = (componentName) => {
  const abiKey = componentName.includes('::')
    ? componentName
    : Object.keys(starknetComponents).find((k) => k.endsWith(`::${componentName}`));

  if (!abiKey) {
    throw new Error(`Unknown component: "${componentName}". Available: ${getComponentNames().join(', ')}`);
  }

  return starknetComponents[abiKey];
};

const Component = {
  fromChain,
  getComponentNames,
  getSchema,
};

export default Component;
