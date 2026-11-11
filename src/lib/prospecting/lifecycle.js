import { integer, positive, uint, ceilDiv } from './validation.js';
import * as Config from './config.js';
import Mining from '../mining.js';

export const STATUSES = Object.freeze({
  ACTIVE_READY: 'ACTIVE_READY',
  SAMPLE_PENDING: 'SAMPLE_PENDING',
  FINALIZED: 'FINALIZED',
  CANCELLED: 'CANCELLED',
  REPLACED: 'REPLACED'
});
const seconds = (value) => integer(value, 0, Number.MAX_SAFE_INTEGER, 'timestamp');
export function getReplacementDeadline ({ createdAt, lastSampleReadyAt }) {
  return seconds(lastSampleReadyAt === undefined ? createdAt : lastSampleReadyAt) + Config.REPLACEMENT_DELAY_SECONDS;
}
export function canReplace (campaign, now) {
  return !['FINALIZED', 'REPLACED'].includes(campaign.status) && seconds(now) >= seconds(campaign.replaceableAt);
}
export function getStartDisabledReason ({ hasOriginPermission, activeCampaign, now, resourceExists }) {
  if (!hasOriginPermission) return 'Origin prospecting permission required';
  if (!resourceExists) return 'Resource absent from this asteroid';
  if (activeCampaign && ![STATUSES.FINALIZED, STATUSES.REPLACED].includes(activeCampaign.status) && !canReplace(activeCampaign, now)) return 'Another campaign occupies this starting lot';
  return null;
}
export function getSampleDisabledReason ({
  campaign, activeCampaignId, hasOriginPermission, crewReady,
  availableDrills, extractors
}) {
  if (String(campaign.id) !== String(activeCampaignId)) return 'Campaign has been replaced';
  if (campaign.status !== STATUSES.ACTIVE_READY) return 'Campaign is not ready for another sample';
  if (!hasOriginPermission) return 'Origin prospecting permission required';
  if (integer(campaign.sampleCount, 0, 10, 'sample count') >= Config.MAX_SAMPLES) return 'Sample limit reached';
  if (!crewReady) return 'Crew is not ready';
  if (uint(availableDrills) < 1n) return 'A core drill is required';
  if (Mining.isSamplingBlocked(extractors)) return 'Extraction blocks sampling on this lot';
  return null;
}
export function getFinalizeDisabledReason ({ campaign, activeCampaignId, productiveSection }) {
  if (String(campaign.id) !== String(activeCampaignId)) return 'Campaign has been replaced';
  if (campaign.status !== STATUSES.ACTIVE_READY) return 'Campaign has unresolved work or is closed';
  if (!productiveSection) return 'Select a productive surveyed section';
  return null;
}
export function getSampleSchedule ({
  now, crewReadyAt, commitBlock, outboundSeconds = 0, returnSeconds = outboundSeconds,
  sampleBonusBps = 10000, timeAcceleration = 24
}) {
  const acceleration = positive(timeAcceleration, 32); const bonus = positive(sampleBonusBps, 32);
  const drillSeconds = Number(ceilDiv(BigInt(Config.SAMPLE_GAME_SECONDS) * 10000n, bonus * acceleration));
  const readyAt = Math.max(seconds(now), seconds(crewReadyAt)) + seconds(outboundSeconds) + drillSeconds;
  const targetBlock = uint(commitBlock) + BigInt(Config.RANDOMNESS_BLOCK_DELAY);
  return {
    readyAt,
    crewReadyAt: readyAt + seconds(returnSeconds),
    drillSeconds,
    replaceableAt: readyAt + Config.REPLACEMENT_DELAY_SECONDS,
    targetBlock: targetBlock.toString(),
    randomnessAvailableBlock: (targetBlock + BigInt(Config.BLOCK_HASH_AVAILABILITY_DELAY)).toString()
  };
}
export function isSampleReady ({ readyAt, targetBlock }, { now, blockNumber }) {
  return seconds(now) >= seconds(readyAt) && uint(blockNumber) >= uint(targetBlock) + BigInt(Config.BLOCK_HASH_AVAILABILITY_DELAY);
}

// A mature sample can remain pending in storage until the next transaction resolves it.
export function getCampaignReadiness ({ campaign, pendingCore, now, blockNumber }) {
  if (campaign.closed) {
    return {
      ...campaign,
      sampleCount: Number(campaign.count),
      status: BigInt(campaign.quantity) > 0n ? STATUSES.FINALIZED : STATUSES.CANCELLED
    };
  }
  const sampleCount = integer(campaign.count, 0, 10, 'resolved sample count') + (campaign.pending ? 1 : 0);
  if (sampleCount > 10) throw new Error('Invalid campaign sample count');
  const waiting = campaign.pending && !isSampleReady({ readyAt: pendingCore.ready, targetBlock: pendingCore.target }, { now, blockNumber });
  return { ...campaign, sampleCount, status: waiting ? STATUSES.SAMPLE_PENDING : STATUSES.ACTIVE_READY };
}
