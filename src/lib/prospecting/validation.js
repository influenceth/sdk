import { toUnsignedBigInt } from '../../utils/integer.js';

export const FR = 21888242871839275222246405745257275088548364400416034343698204186575808495617n;
export const uint = (value, bits = 64) => toUnsignedBigInt(value, bits);
export function integer (value, min, max, name) {
  const n = Number(uint(value, 53));
  if (n < min || n > max) throw new RangeError(`Invalid ${name}`);
  return n;
}
export function field (value) {
  const n = uint(value, 254);
  if (n >= FR) throw new RangeError('Noncanonical proof field');
  return n.toString();
}
export function positive (value, bits = 64) {
  const n = uint(value, bits);
  if (!n) throw new RangeError('Expected a positive integer');
  return n;
}
export const ceilDiv = (a, b) => (a + b - 1n) / b;
export function integerSqrt (n) {
  if (n < 2n) return n;
  let x = 1n << BigInt(Math.ceil(n.toString(2).length / 2));
  let next = (x + n / x) / 2n;
  while (next < x) { x = next; next = (x + n / x) / 2n; }
  return x;
}
