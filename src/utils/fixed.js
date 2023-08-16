export const FIXED_SIZE = 42535295865117307932921825928971026432n; // 2^125
export const ONE = 2305843009213693952n; // 2^61
export const PRIME = 3618502788666131213697322783095070105623107215331596699973092056135872020481n;
export const PRIME_HALF = PRIME / 2n;

// Converts to a felt representation
export const toFelt = (num) => BigInt(num);

// Converts to Cairo 64.61 representation
export const toFixed = (num) => {
  const res = BigInt(num) * ONE;
  if (res > FIXED_SIZE || res <= FIXED_SIZE * -1n) throw new Error('Number is out of valid range');
  return toFelt(res);
};

// Negative values are returned by Starknet so no need to wrap
export const fromFixed = (num) => {
  let res = BigInt(num);
  res = res > PRIME_HALF ? res - PRIME : res;
  const int = Number(res / ONE);
  const frac = Number(res % ONE) / Number(ONE);
  return int + frac;
};

export class Fixed {
  constructor (mag, sign, size = 64) {
    if (![64, 128].includes(size)) throw new Error('Invalid size. Must be 64 or 128');
    this.mag = mag;
    this.sign = Number(sign);
    this.size = size;
  }

  static toFixed (input, size = 64) {
    if (Array.isArray) return new Fixed(input[0], input[1], size);
    return new Fixed(input);
  }

  valueOf () {
    const _value = this.mag / (2 ** (this.size === 64 ? 32 : 64));
    return (this.sign) ? -_value : _value;
  }
}

export default {
  FIXED_SIZE,
  ONE,
  PRIME,
  PRIME_HALF,
  Fixed,
  toFelt,
  toFixed,
  fromFixed
};
