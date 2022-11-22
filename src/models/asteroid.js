import { hash } from 'starknet';
import { multiply, dot } from 'mathjs';
import procedural from '../lib/procedural.js';
import { SIMPLEX_DISTRIBUTION } from '../constants.js';

const MAX_RADIUS = 375.142; // in km
const OCTAVE_STEP_MOD = 2.30560051;
const RESOURCE_OCTAVE_MUL = 6;
const RESOURCE_OCTAVE_BASE = 2;
const RESOURCE_OCTAVE_PERS = 0.5;
const RESOURCE_SIZE_MUL = 3;
const RESOURCE_SIZE_BASE = 1.5;
const NOISE_STEP_WEIGHT = [
  0, // 1 -> 1
  0.6349435279784, // 2 -> 1
  0.8300386338670, // 3 -> 1
  0.9194357211305, // 4 -> 1
  0.9641163370096, // 5 -> 1
  0.9846124234038, // 6 -> 1
  0.9946991129726, // 7 -> 1
  1 // 8 -> 1
];

export const getLotDistance = (asteroidId, originLotId, destLotId) => {
  const radius = getRadius(asteroidId);
  const origin = multiply(getLotPosition(asteroidId, originLotId), radius);
  const dest = multiply(getLotPosition(asteroidId, destLotId), radius);
  return radius * Math.acos(dot(origin, dest) / (radius * radius));
};

export const getLotPosition = (asteroidId, lotId) => {
  const phi = Math.PI * (3 - Math.sqrt(5));
  const theta = phi * (lotId - 1);

  const numLots = getSurfaceArea(asteroidId);
  const lotFrac = (lotId - 1) / (numLots - 1);
  const y = 1 - (lotFrac * 2);
  const radius = Math.sqrt(1 - y * y); // radius at y

  const x = radius * Math.cos(theta);
  const z = radius * Math.sin(theta);

  return [ x, y, z ];
};

export const getRadius = (asteroidId) => {
  return MAX_RADIUS / Math.pow(asteroidId, 0.475)
};

export const getResourceMapSettings = (asteroidId, asteroidSeed, resourceId, abundance) => {
  const radius = getRadius(asteroidId);
  const radiusRatio = radius / MAX_RADIUS;
  const octaves = RESOURCE_OCTAVE_BASE + Math.floor(RESOURCE_OCTAVE_MUL * radiusRatio);
  const pointScale = RESOURCE_SIZE_BASE + (RESOURCE_SIZE_MUL * radiusRatio);

  const resourceSeed = hash.pedersen([ BigInt(asteroidSeed), BigInt(resourceId) ]);
  const xSeed = hash.pedersen([ BigInt(resourceSeed), 1n ]);
  const ySeed = hash.pedersen([ BigInt(resourceSeed), 2n ]);
  const zSeed = hash.pedersen([ BigInt(resourceSeed), 3n ]);

  let lowShift = -5;
  let highShift = 5;

  let xShift = procedural.realBetween(xSeed, lowShift, highShift);
  let yShift = procedural.realBetween(ySeed, lowShift, highShift);
  let zShift = procedural.realBetween(zSeed, lowShift, highShift);

  // Get simplex distribution based settings
  const cutoffFrac = abundance * 2;
  const cutoffSingle = _getSimplexDist(cutoffFrac);
  let fullStep = (0.5 - cutoffSingle) / OCTAVE_STEP_MOD;
  let partialStep = fullStep * NOISE_STEP_WEIGHT[octaves - 1];
  const lowerCutoff = 1 - cutoffSingle - partialStep;

  const cutoffZero = _getSimplexDist(0);
  fullStep = (0.5 - cutoffZero) / OCTAVE_STEP_MOD;
  partialStep = fullStep * NOISE_STEP_WEIGHT[octaves - 1];
  const upperCutoff = 1 - cutoffZero - partialStep;

  const persistence = RESOURCE_OCTAVE_PERS;
  return { octaves, persistence, lowerCutoff, upperCutoff, pointScale, pointShift: [ xShift, yShift, zShift ]};
};

export const getSurfaceArea = (asteroidId) => {
  const radius = getRadius(asteroidId);
  const area = 4 * Math.PI * Math.pow(radius, 2);
  return Math.floor(area);
};

const _getSimplexDist = (percentile) => {
  const upperHalf = percentile > 0.5;
  if (upperHalf) percentile = 1 - percentile;
  const lower = Math.floor(percentile * 100);
  const upper = lower + 1;
  const lowerDist = SIMPLEX_DISTRIBUTION[lower];
  const upperDist = SIMPLEX_DISTRIBUTION[upper];
  const fracPerc = (percentile * 100) - Math.floor(percentile * 100);
  let result = lowerDist + fracPerc * (upperDist - lowerDist);
  if (upperHalf) result = 1 - result;
  return result;
};

export default {
  getLotDistance,
  getLotPosition,
  getRadius,
  getResourceMapSettings,
  getSurfaceArea
};
