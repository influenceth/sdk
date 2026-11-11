import Claim from './claim.js';
import Time from '../utils/Time.js';
import { integer, positive, uint, ceilDiv, integerSqrt } from './prospecting/validation.js';
import * as Config from './prospecting/config.js';

const MODES = Object.freeze({ CLAIM: 'claim', BASELINE: 'baseline' });
const ppm = (value) => integer(value, 0, 1000000, 'abundance');
const getGlobalAbundancePpm = (packed, resource) => {
  const id = integer(resource, 1, 22, 'raw resource');
  const shift = id <= 11 ? (id - 1) * 10 : 128 + (id - 12) * 10;
  const milli = Number((uint(packed, 252) >> BigInt(shift)) & 1023n);
  return integer(milli, 0, 1000, 'packed global abundance') * 1000;
};
const canBaselineMine = (globalAbundancePpm) => ppm(globalAbundancePpm) >= Config.BASELINE_THRESHOLD_PPM;
const isSamplingBlocked = (extractors) => {
  if (!Array.isArray(extractors)) throw new TypeError('The investigated lot extractor slots are required');
  return extractors.some((extractor) => integer(extractor.status, 0, 1, 'extractor status') === 1);
};

// Match Cubit f64 operation order and integer square root in geometry.rate_nano.
// Result is nanounits per game second; one raw-resource unit is one kilogram.
const getIntrinsicRateNano = (localAbundancePpm, rateBps = 10000) => {
  const abundance = BigInt(ppm(localAbundancePpm));
  const multiplier = BigInt(integer(rateBps, 1, 20000, 'rate multiplier'));
  if (!abundance) return 0n;
  const scale = 1n << 32n;
  const q = abundance * 875n * scale / 100n;
  const fraction = q / BigInt(Config.REFERENCE_MAX_QUANTITY);
  const rate = (q / BigInt(Config.REFERENCE_EXTRACTION_GAME_SECONDS)) * scale / integerSqrt(fraction * scale);
  return (rate * multiplier / 10000n) * Config.RATE_SCALE / scale;
};
const getEffectiveRateNano = ({ localAbundancePpm, rateBps, bonusBps, bonusFixed64 }) => {
  if (bonusBps !== undefined && bonusFixed64 !== undefined) throw new Error('Supply a combined bonus once, as BPS or exact Fixed64');
  const rate = getIntrinsicRateNano(localAbundancePpm, rateBps);
  return bonusFixed64 === undefined
    ? rate * positive(bonusBps ?? 10000, 32) / 10000n
    : rate * positive(bonusFixed64, 64) / (1n << 32n);
};
const parameters = ({ mode, claim, localAbundancePpm, globalAbundancePpm, resource, lotId, bonusBps, bonusFixed64 }) => {
  integer(resource, 1, 22, 'raw resource');
  let rateBps; let referenceAbundancePpm; let remainingYield = null;
  if (mode === MODES.BASELINE) {
    if (!canBaselineMine(globalAbundancePpm)) throw new Error('This resource requires a claim');
    referenceAbundancePpm = ppm(localAbundancePpm);
    rateBps = Config.BASELINE_RATE_BPS;
  } else if (mode === MODES.CLAIM) {
    if (!claim?.usable || claim.resource !== resource) throw new Error('An extractable claim for this resource is required');
    if (!claim.lotId || Number(claim.lotId) !== Number(lotId)) throw new Error('The extractor must be on the claim lot');
    ({ rateBps, referenceAbundancePpm } = claim);
    remainingYield = uint(claim.remainingYield);
  } else throw new RangeError('Unknown extraction mode');
  const rateNano = getEffectiveRateNano({ localAbundancePpm: referenceAbundancePpm, rateBps, bonusBps, bonusFixed64 });
  if (!rateNano) throw new Error('This location has no mineable output');
  return { mode, rateBps, referenceAbundancePpm, rateNano, remainingYield };
};
const getMaxQuantity = (options) => {
  const p = parameters(options);
  const limits = [BigInt(Config.MAX_QUANTITY_PER_RUN), ...(p.remainingYield === null ? [] : [p.remainingYield])];
  if (options.maxGameSeconds !== undefined) limits.push(p.rateNano * positive(options.maxGameSeconds) / Config.RATE_SCALE);
  return Number(limits.reduce((a, b) => a < b ? a : b));
};
const quote = (options) => {
  const p = parameters(options);
  const quantity = positive(options.quantity);
  if (quantity > BigInt(getMaxQuantity(options))) throw new RangeError('Extraction exceeds remaining quantity, time or per-run limits');
  const gameSeconds = integer(ceilDiv(quantity * Config.RATE_SCALE, p.rateNano), 1, Number.MAX_SAFE_INTEGER, 'extraction duration');
  const realSeconds = Time.toRealDurationCeil(gameSeconds, options.timeAcceleration ?? Time.DEFAULT_TIME_ACCELERATION);
  return {
    mode: p.mode,
    quantity: Number(quantity),
    resource: options.resource,
    rateBps: p.rateBps,
    referenceAbundancePpm: p.referenceAbundancePpm,
    rateNano: p.rateNano,
    gameSeconds,
    realSeconds,
    crewLaborSeconds: Time.getCrewLaborDuration(realSeconds),
    remainingYield: p.remainingYield === null ? null : (p.remainingYield - quantity).toString()
  };
};
const quoteEntity = ({ entity, localAbundancePpm, ...options }) => quote({
  ...options,
  mode: MODES.CLAIM,
  claim: Claim.fromEntity(entity, { localAbundancePpm })
});

// Existing jobs are immutable quotes: their output and finish time are already
// committed, including any jobs started under the legacy depletion calculation.
const getRunningJob = (extractor, now) => {
  if (integer(extractor.status, 0, 1, 'extractor status') === 0) return null;
  const finishTime = integer(extractor.finishTime, 0, Number.MAX_SAFE_INTEGER, 'extraction finish time');
  return {
    resource: integer(extractor.outputProduct, 1, 22, 'extraction resource'),
    quantity: uint(extractor.yield).toString(),
    destination: extractor.destination,
    destinationSlot: extractor.destinationSlot,
    finishTime,
    readyToCollect: integer(now, 0, Number.MAX_SAFE_INTEGER, 'block time') >= finishTime
  };
};

export default {
  MODES,
  RATE_SCALE: Config.RATE_SCALE,
  BASELINE_THRESHOLD_PPM: Config.BASELINE_THRESHOLD_PPM,
  BASELINE_RATE_BPS: Config.BASELINE_RATE_BPS,
  MAX_QUANTITY_PER_RUN: Config.MAX_QUANTITY_PER_RUN,
  getGlobalAbundancePpm,
  canBaselineMine,
  isSamplingBlocked,
  getIntrinsicRateNano,
  getEffectiveRateNano,
  getMaxQuantity,
  quote,
  quoteEntity,
  getRunningJob
};
