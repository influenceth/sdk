const toBitIntAddress = (address) => {
  try {
    if (typeof address === 'string' && address.substring(0, 2) !== '0x') {
      address = '0x' + address;
    }
    return BigInt(address);
  } catch (error) {
    console.error('Could not standardize address: ', address);
  }
  return null;
};

// Standardizes addresses to the correct length, and all downcased
const toStandard = (address, explicitChain) => {
  const intAddress = toBitIntAddress(address);

  const chain = explicitChain || inferChain(intAddress);
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

const inferChain = (address) => {
  return toBitIntAddress(address) <= 2n ** 160n ? 'ethereum' : 'starknet';
};

// Check for equality, chain is optional but is useful if one or both addresses
// may possibly be the null address (since the detection can't determine # of bits)
const areEqual = (address1, address2, chain1, chain2) => {
  address1 = toStandard(address1, chain1);
  address2 = toStandard(address2, chain2);
  return address1 === address2;
};

module.exports = {
  areEqual,
  inferChain,
  toStandard,
};