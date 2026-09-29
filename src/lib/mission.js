import { shortString } from 'starknet';
import Entity from './entity.js';

/** Build an assignment without coercing deployment-specific felt values. */
const getAssignment = ({ campaign, subject, mission }) => {
  if (campaign === undefined || campaign === null || campaign === '') {
    throw new TypeError('A campaign is required');
  }
  if (!subject || subject.label === undefined || subject.id === undefined) {
    throw new TypeError('A subject with label and id is required');
  }
  if (!Number.isInteger(mission) || mission < 0 || mission > 0xffffffff) {
    throw new RangeError('Mission must be a u32 integer');
  }
  return { campaign, subject: { label: subject.label, id: subject.id }, mission };
};

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

const PATH_FIELDS = {
  Lifecycle: ['campaign', 'subject', 'page'],
  Evidence: ['campaign', 'subject', 'slot'],
  Definition: ['campaign'],
  DefinitionCount: ['campaign'],
  ExecutionLock: [],
  StarterInvalid: ['subject'],
  StarterParticipated: ['subject']
};
const PATH_PREFIXES = Object.fromEntries(Object.keys(PATH_FIELDS)
  .map((type) => [type, shortString.encodeShortString(type)]));

const toFelt = (value) => {
  const result = toUnsignedBigInt(value, 252);
  if (result >= (1n << 251n) + 17n * (1n << 192n) + 1n) throw new RangeError('Invalid felt');
  return result;
};

/** Build an unhashed Mission component path. All returned elements are bigint. */
const getPath = ({ type, ...values }) => {
  if (!Object.hasOwn(PATH_FIELDS, type)) throw new RangeError(`Unknown mission path type: ${type}`);
  return [BigInt(PATH_PREFIXES[type]), ...PATH_FIELDS[type].map((field) => {
    if (field === 'subject') {
      const label = toUnsignedBigInt(values.subject.label, 16);
      const id = toUnsignedBigInt(values.subject.id, 64);
      return Entity.packEntity({ label, id }, false);
    }
    if (field === 'page') return toUnsignedBigInt(values.page, 27);
    return toFelt(values[field]);
  })];
};

/** Unknown prefixes return null; malformed known paths throw. Subject IDs remain bigint. */
const parsePath = (path) => {
  if (!Array.isArray(path) || path.length === 0) throw new TypeError('Expected a mission path array');
  const prefix = toFelt(path[0]);
  const type = Object.keys(PATH_PREFIXES).find((key) => BigInt(PATH_PREFIXES[key]) === prefix);
  if (!type) return null;
  const fields = PATH_FIELDS[type];
  if (path.length !== fields.length + 1) throw new RangeError(`Invalid ${type} path length`);
  const result = { type };
  fields.forEach((field, index) => {
    const value = toFelt(path[index + 1]);
    if (field === 'subject') {
      toUnsignedBigInt(value, 80);
      result.subject = { label: Number(value & 65535n), id: value >> 16n };
    } else if (field === 'page') {
      result.page = Number(toUnsignedBigInt(value, 27));
    } else {
      result[field] = value;
    }
  });
  return result;
};

const getLifecyclePath = (assignment) => {
  const { campaign, subject, mission } = getAssignment(assignment);
  return getPath({ type: 'Lifecycle', campaign, subject, page: Math.floor(mission / 32) });
};

const getEvidencePath = ({ campaign, subject }, slot) => getPath({ type: 'Evidence', campaign, subject, slot });

/** Decode one mission from its lifecycle page, not from a campaign-wide bitmap. */
const unpackLifecycle = (value, missionId) => {
  const word = toUnsignedBigInt(value, 128);
  const index = toUnsignedBigInt(missionId, 32) % 32n;
  return {
    accepted: (word & (1n << index)) !== 0n,
    completed: (word & (1n << (32n + index))) !== 0n,
    claimed: (word & (1n << (64n + index))) !== 0n
  };
};

export default { getAssignment, getPath, parsePath, getLifecyclePath, getEvidencePath, unpackLifecycle };
