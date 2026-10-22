import { hash, shortString, uint256 } from 'starknet';

export const MISSION_OBSERVER = shortString.encodeShortString('MissionObserver');

export const MAX_MISSION_TARGETS = 8;
const SUBJECT_RADIX = 1n << 80n;
const felt = value => typeof value === 'string' && !value.startsWith('0x') && !/^\d+$/.test(value)
  ? shortString.encodeShortString(value) : String(value);

// Public input uses assignments; the wire format groups their mission bits by subject.
export function encodeMissionTargets(candidates) {
  if (!Array.isArray(candidates) || !candidates.length) throw new Error('Mission candidates are required');
  const targets = new Map();
  for (const { campaign, subject, mission } of candidates) {
    if (!Number.isInteger(mission) || mission < 0 || mission > 31) throw new Error('Invalid mission index');
    const label = BigInt(subject.label), id = BigInt(subject.id), campaignId = BigInt(felt(campaign));
    if (label <= 0n || label >= 65536n || id <= 0n || id >= (1n << 64n) || campaignId <= 0n) {
      throw new Error('Invalid mission assignment');
    }
    const packedSubject = label + id * 65536n;
    const key = `${campaignId}:${packedSubject}`;
    const target = targets.get(key) || { campaign: campaignId, subject: packedSubject, mask: 0n };
    target.mask |= 1n << BigInt(mission);
    targets.set(key, target);
  }
  if (targets.size > MAX_MISSION_TARGETS) throw new Error('Too many mission targets');
  return [...targets.values()].flatMap(({ campaign, subject, mask }) => [campaign, subject + mask * SUBJECT_RADIX].map(String));
}

// calldata is the exact native run_system argument array BEFORE Context is appended.
// For an Escrow callback this includes the fields appended by Escrow.withdraw.
export function observeMissionAction({ dispatcher, account, system, calldata, executionCalls, candidates, expectedCaller = account }) {
  if (!calldata || !executionCalls?.length) throw new Error('Native calldata and execution calls are required');
  const name = felt(system);
  const targets = encodeMissionTargets(candidates);
  return [
    {
      contractAddress: dispatcher,
      entrypoint: 'begin_observation',
      calldata: [MISSION_OBSERVER, name, hash.computePoseidonHashOnElements(calldata), expectedCaller, targets.length, ...targets].map(String)
    },
    ...executionCalls,
    { contractAddress: dispatcher, entrypoint: 'end_observation', calldata: [] }
  ];
}

// nativeArguments contains the fixed order fields plus the fill-specific fields,
// excluding the Dispatcher selector/array-length header and the trailing Context.
export function escrowWithdrawalArguments({ nativeArguments, caller, token, withdrawals }) {
  return [
    ...nativeArguments, caller, 2, token, withdrawals.length,
    ...withdrawals.flatMap(({ recipient, amount }) => {
      const value = uint256.bnToUint256(BigInt(amount));
      return [recipient, value.low, value.high];
    })
  ].map(String);
}
