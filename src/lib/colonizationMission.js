import { shortString } from 'starknet';
import Building from './building.js';
import Entity from './entity.js';
import Mission, { toUnsignedBigInt } from './mission.js';
import { getActionEvidenceSlot as getSharedActionEvidenceSlot, getBuildingFingerprint } from './missionBindings.js';

const REWARD_SCALE = 1_000_000;
const IDS = { CLAIM_A_NEW_WORLD: 0, BUILD_A_HABITAT: 1, CONNECT_THE_COLONY: 2, ESTABLISH_COMMERCE: 3, FOUND_A_COLONY: 4 };
const definitions = [
  ['Claim a New World', 150_000, { requiresEnrollmentBeforeScan: true, requiresObservedScanStartAndFinish: true }],
  ['Build a Habitat', 250_000, { buildingType: Building.IDS.HABITAT, qualifyingUse: 'StationCrew' }],
  ['Connect the Colony', 300_000, { buildingType: Building.IDS.SPACEPORT, qualifyingUse: 'DockShip' }],
  ['Establish Commerce', 350_000, { buildingType: Building.IDS.MARKETPLACE, qualifyingUse: ['FillBuyOrder', 'FillSellOrder'], requiresPositiveFill: true }],
  ['Found a Colony', 450_000, { requiresOperationalSelectedBuildingsAtClaim: true }]
];
const TYPES = Object.fromEntries(Object.entries(IDS).map(([key, id]) => {
  const [title, reward, requirements] = definitions[id];
  return [id, {
    id,
    key,
    title,
    reward,
    prerequisiteId: id === 0 ? null : 0,
    requirements: {
      ...requirements,
      ...(id > 0 && id < 4 ? { requiresObservedConstructionStartAfterScan: true, requiresOperationalUse: true } : {})
    }
  }];
}));
const EVIDENCE_SLOTS = {
  HABITAT: 1n,
  SPACEPORT: 2n,
  MARKETPLACE: 3n,
  ...Object.fromEntries(['Colonizer', 'ScanStarted', 'ScanFinished', 'Earned'].map((name) => [
    name.replace(/([a-z])([A-Z])/g, '$1_$2').toUpperCase(), BigInt(shortString.encodeShortString(name))
  ]))
};
const getMission = (id) => {
  if (!Number.isInteger(id) || !Object.hasOwn(TYPES, id)) throw new RangeError(`Unknown colonization mission: ${id}`);
  return TYPES[id];
};
const getAssignment = ({ campaign, asteroidId, missionId }) => {
  getMission(missionId);
  return Mission.getAssignment({ campaign, subject: { label: Entity.IDS.ASTEROID, id: asteroidId }, mission: missionId });
};
const getRewardAmount = (missionId) => BigInt(getMission(missionId).reward) * BigInt(REWARD_SCALE);
const unpackEarned = (value) => {
  const word = toUnsignedBigInt(value, 128);
  return { scan: !!(word & 1n), habitat: !!(word & 2n), spaceport: !!(word & 4n), marketplace: !!(word & 8n) };
};
const getActionEvidenceSlot = ({ kind, entity }) => {
  if (!['Built', 'Used'].includes(kind)) throw new RangeError(`Unsupported colonization evidence kind: ${kind}`);
  return getSharedActionEvidenceSlot({ kind, entity, slot: 0 });
};
const getRewardPath = ({ campaign, missionId }) => {
  getMission(missionId);
  return Mission.getPath({ type: 'ColonyReward', campaign, mission: missionId });
};

export default { IDS, TYPES, REWARD_SCALE, EVIDENCE_SLOTS, getAssignment, getRewardAmount, unpackEarned, getActionEvidenceSlot, getBuildingFingerprint, getRewardPath };
