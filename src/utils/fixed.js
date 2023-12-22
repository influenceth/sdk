export const Fixed64ONE = 2n ** 32n;

export const realToFixed64 = (real) => {
  return BigInt(Math.round(real * 2 ** 32));
}

export const fixed64ToReal = (fixed) => {
  return Number(fixed) / 2 ** 32;
}

export const Fixed128ONE = 2n ** 64n;

export const realToFixed128 = (real) => {
  return BigInt(Math.round(real * 2 ** 64));
}

export const fixed128ToReal = (fixed) => {
  return Number(fixed) / 2 ** 64;
}

export default {
  Fixed64ONE,
  realToFixed64,
  fixed64ToReal,
  Fixed128ONE,
  realToFixed128,
  fixed128ToReal
};
