import { ec } from 'starknet';
import { fixed64ToReal, Fixed64ONE } from './fixed.js';

export const derive = (seed, entropy) => {
  return ec.starkCurve.pedersen(BigInt(seed), BigInt(entropy));
};

/**
 * Generates a random integer value evenly distributed between low (inclusive) and high (exclusive)
 * @param {felt252} seed
 * @param {integer} low
 * @param {integer} high
 */
export const intBetween = (seed, low, high) => {
  const rem = fixed64ToReal(BigInt(seed) % Fixed64ONE);
  return Math.floor(rem * (high - low)) + low;
};

/**
 * Generates a random float value evenly distributed between low and high
 * @param {felt252} seed
 * @param {float} low
 * @param {float} high
*/
export const realBetween = (seed, low, high) => {
  const rem = fixed64ToReal(BigInt(seed) % Fixed64ONE);
  return rem * (high - low) + low;
};

export const normalIntBetween = (seed, low, high) => {
  let res = 0;

  for (let i = 5; i > 0; i--) {
    const iterSeed = derive(seed, i);
    res += intBetween(iterSeed, low, high);
  }

  return Number(BigInt(res) / BigInt(5));
};

export const normalRealBetween = (seed, low, high) => {
  let res = 0;

  for (let i = 5; i > 0; i--) {
    const iterSeed = derive(seed, i);
    res += realBetween(iterSeed, low, high);
  }

  return res / 5;
};

export default {
  derive,
  intBetween,
  realBetween,
  normalIntBetween,
  normalRealBetween
};
