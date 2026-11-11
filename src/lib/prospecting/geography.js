import Asteroid from '../asteroid.js';
import { integer } from './validation.js';
import * as Config from './config.js';

// Display/selection preview only. Commitments must use contract-provided metadata
// and approach masks because the Cairo trigonometric approximations differ.
export function getDistanceMetres ({ asteroidId, radiusKm = Asteroid.getRadius(asteroidId), from, to }) {
  if (!Number.isFinite(radiusKm) || radiusKm <= 0) throw new RangeError('Invalid asteroid radius');
  const count = Math.floor(4 * Math.PI * radiusKm * radiusKm);
  const a = integer(from, 1, count, 'source lot'); const b = integer(to, 1, count, 'target lot');
  if (a === b) return 0;
  const origin = Asteroid.getLotPosition(asteroidId, a, count);
  const target = Asteroid.getLotPosition(asteroidId, b, count);
  const dot = origin.reduce((sum, coordinate, i) => sum + coordinate * target[i], 0);
  return radiusKm * 1000 * Math.acos(Math.max(-1, Math.min(1, dot)));
}
export function isWithinOriginReach (options) {
  return getDistanceMetres(options) <= Config.MAX_ORIGIN_DISTANCE_METRES;
}
export function isWithinStepReach ({ fromDepth, toDepth, ...options }) {
  integer(fromDepth, 0, 4, 'source depth');
  integer(toDepth, 0, 4, 'target depth');
  return Math.abs(fromDepth - toDepth) <= 1 && getDistanceMetres(options) <= Config.MAX_STEP_DISTANCE_METRES;
}
