import { hash } from 'starknet';
import { ONE, fromFixed } from './fixed.js';

export const derive = (seed, entropy) => {
  return hash.pedersen([ BigInt(seed), BigInt(entropy) ]);
};

export const intBetween = (seed, low, high) => {
  const range = BigInt(high - low);
  const rem = BigInt(seed) % ONE;
  const real = rem * range;
  const int = real / ONE;
  return Number(int) + low;
};

export const realBetween = (seed, low, high) => {
  const range = BigInt(high - low);
  const rem = BigInt(seed) % ONE;
  const real = rem * range;
  return fromFixed(real) + Number(low);
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
