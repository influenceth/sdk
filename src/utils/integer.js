// Reject unsafe numbers before BigInt conversion can preserve an already-rounded value.
export const toUnsignedBigInt = (value, bits) => {
  if ((typeof value === 'number' && !Number.isSafeInteger(value)) ||
      !['number', 'string', 'bigint'].includes(typeof value) ||
      (typeof value === 'string' && !/^(0x[0-9a-f]+|[0-9]+)$/i.test(value))) {
    throw new TypeError('Expected an unsigned integer, decimal string, or hex string');
  }
  const result = BigInt(value);
  if (result < 0n || result >= (1n << BigInt(bits))) throw new RangeError(`Expected a u${bits}`);
  return result;
};
