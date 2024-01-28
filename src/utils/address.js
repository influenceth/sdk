// Standardizes addresses to the correct length, and all downcased
export const toStandard = (address, explicitChain) => {
  const intAddress = _parseAddress(address);
  if (intAddress === undefined) return undefined;

  const chain = explicitChain || _detectChain(intAddress);

  switch (chain) {
    case 'ethereum':
    case 'l1':
      return '0x' + intAddress.toString(16).padStart(40, 0);

    case 'starknet':
    case 'l2':
    default:
      return '0x' + intAddress.toString(16).padStart(64, 0);
  }
};

export const getChain = (address) => {
  const intAddress = _parseAddress(address);
  return _detectChain(intAddress);
};

// Check for equality, chain is optional but is useful if one or both addresses
// may possibly be the null address (since the detection can't determine # of bits)
export const areEqual = (address1, address2, chain1, chain2) => {
  try {
    address1 = toStandard(address1, chain1);
    address2 = toStandard(address2, chain2);
    return address1 === address2;
  } catch (e) {
    return false;
  }
};

const _parseAddress = (address) => {
  let parseable = true;
  let intAddress;
  let error;

  // Try parsing as BigInt first, if it fails, it's probably an int string
  try {
    intAddress = BigInt(address);
  } catch (e) {
    error = e;
    parseable = false;
  }

  if (typeof address === 'string' && address.substring(0, 2) !== '0x' && !parseable) {
    address = '0x' + address;

    try {
      error = undefined;
      intAddress = BigInt(address);
    } catch (e) {
      error = e;
    }
  }

  if (intAddress === undefined) {
    console.warn('Could not standardize address: ', address, error);
    return undefined;
  }

  return intAddress;
};

const _detectChain = (intAddress) => {
  return intAddress <= BigInt(2 ** 160) ? 'ethereum' : 'starknet';
};

export default {
  toStandard,
  areEqual,
  getChain
};
