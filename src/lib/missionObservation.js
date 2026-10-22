import { hash, shortString, uint256 } from 'starknet';
import Entity from './entity.js';
import System from './system.js';
import { toFelt, toUnsignedBigInt } from './mission.js';

const MISSION_OBSERVER = shortString.encodeShortString('MissionObserver');
const MAX_MISSION_TARGETS = 8;
const namedFelt = (value) => toFelt(typeof value === 'string' && !/^(0x[0-9a-f]+|[0-9]+)$/i.test(value)
  ? shortString.encodeShortString(value)
  : value);
const address = (value) => {
  const result = toUnsignedBigInt(value, 251);
  if (result === 0n) throw new RangeError('A nonzero address is required');
  return result;
};
const nativeArguments = (values) => {
  if (!Array.isArray(values)) throw new TypeError('Native calldata must be an array');
  return values.map((value) => toFelt(value).toString());
};

const encodeMissionTargets = (candidates) => {
  if (!Array.isArray(candidates) || !candidates.length) throw new TypeError('Mission candidates are required');
  const groups = new Map();
  for (const { campaign, subject, mission } of candidates) {
    if (!Number.isInteger(mission) || mission < 0 || mission > 31) throw new RangeError('Invalid observation mission index');
    const campaignId = namedFelt(campaign);
    const label = toUnsignedBigInt(subject.label, 16);
    const id = toUnsignedBigInt(subject.id, 64);
    if (!campaignId || !label || !id) throw new RangeError('Mission assignment fields must be nonzero');
    const packed = Entity.packEntity({ label, id }, false);
    const key = `${campaignId}:${packed}`;
    const group = groups.get(key) || { campaign: campaignId, subject: packed, mask: 0n };
    group.mask |= 1n << BigInt(mission);
    groups.set(key, group);
  }
  if (groups.size > MAX_MISSION_TARGETS) throw new RangeError('Too many mission targets');
  return [...groups.values()].flatMap(({ campaign, subject, mask }) => [campaign, subject + (mask << 80n)].map(String));
};

// Hash precisely the native arguments, including callback fields but excluding Context.
const observeMissionAction = ({ dispatcher, account, system, calldata, executionCalls, candidates, expectedCaller = account }) => {
  if (!Array.isArray(executionCalls) || !executionCalls.length) throw new TypeError('Execution calls are required');
  address(dispatcher);
  address(account);
  const targets = encodeMissionTargets(candidates);
  return [
    {
      contractAddress: dispatcher,
      entrypoint: 'begin_observation',
      calldata: [MISSION_OBSERVER, namedFelt(system), hash.computePoseidonHashOnElements(nativeArguments(calldata)),
        address(expectedCaller), targets.length, ...targets].map(String)
    },
    ...executionCalls,
    { contractAddress: dispatcher, entrypoint: 'end_observation', calldata: [] }
  ];
};

// Build and hash the same serialized call so direct execution cannot drift from observation.
const getObservedSystemCalls = ({ dispatcher, account, system, input, candidates }) => {
  const call = System.getRunSystemCall(system, input, dispatcher);
  return observeMissionAction({ dispatcher, account, system, candidates, calldata: call.calldata.slice(2), executionCalls: [call] });
};

const escrowWithdrawalArguments = ({ nativeArguments: args, caller, token, withdrawals }) => {
  if (!Array.isArray(withdrawals)) throw new TypeError('Withdrawals must be an array');
  return [
    ...nativeArguments(args), address(caller), 2, address(token), withdrawals.length,
    ...withdrawals.flatMap(({ recipient, amount }) => {
      const value = uint256.bnToUint256(toUnsignedBigInt(amount, 256));
      return [address(recipient), value.low, value.high];
    })
  ].map(String);
};

export default { MISSION_OBSERVER, MAX_MISSION_TARGETS, encodeMissionTargets, observeMissionAction, getObservedSystemCalls, escrowWithdrawalArguments };
