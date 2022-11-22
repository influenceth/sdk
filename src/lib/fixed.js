export const ONE = 2n ** 61n;
const FIXED_SIZE = 2n ** 125n;
const PRIME = 3618502788666131213697322783095070105623107215331596699973092056135872020481n;
const PRIME_HALF = PRIME / 2n;

// Converts to a felt representation
export const toFelt = (num) => BigInt(num);

// Converts to Cairo 64.61 representation
export const toFixed = (num) => {
  let res = BigInt(num) * ONE;
  if (res > FIXED_SIZE || res <= FIXED_SIZE * -1n) throw new Error('Number is out of valid range')
  return toFelt(res);
};

// Negative values are returned by Starknet so no need to wrap
export const fromFixed = (num) => {
  let res = BigInt(num);
  res = res > PRIME_HALF ? res - PRIME : res;
  const int = Number(res / ONE);
  const frac = Number(res % ONE) / Number(ONE);
  return int + frac;
}

export default {
  ONE,
  toFelt,
  toFixed,
  fromFixed
};
