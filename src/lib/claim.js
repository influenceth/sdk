import Deposit from './deposit.js';
import PermissionIds from './permissionIds.js';
import Entity from './entity.js';
import Lot from './lot.js';
import { integer, positive, uint } from './prospecting/validation.js';
import { CLAIM_RULES_VERSION } from './prospecting/config.js';

const RULES_VERSION = CLAIM_RULES_VERSION;
// Missing metadata always means this historical rule, even after future versions are added.
const DEFAULT_LEGACY_PARAMETERS = Object.freeze({ rulesVersion: 1, rateBps: 12000 });
const METADATA_FIELDS = Object.freeze(['rulesVersion', 'rateBps', 'referenceAbundancePpm', 'campaignId']);

const getParameters = (entity, { localAbundancePpm } = {}) => {
  if (!entity?.Deposit) throw new TypeError('A Deposit entity is required');
  if (!entity.Claim) {
    return {
      ...DEFAULT_LEGACY_PARAMETERS,
      referenceAbundancePpm: integer(localAbundancePpm, 0, 1000000, 'legacy local abundance'),
      kind: 'legacy'
    };
  }
  const metadata = entity.Claim;
  if (metadata.rulesVersion !== RULES_VERSION) throw new RangeError('Unsupported claim rules version');
  return {
    rulesVersion: RULES_VERSION,
    rateBps: integer(metadata.rateBps, 9000, 20000, 'claim rate'),
    referenceAbundancePpm: integer(metadata.referenceAbundancePpm, 1, 1000000, 'claim reference abundance'),
    campaignId: positive(metadata.campaignId).toString(),
    kind: 'prospected'
  };
};
const isUsable = (entity) => !!entity?.Deposit &&
  [Deposit.STATUSES.SAMPLED, Deposit.STATUSES.USED].includes(entity.Deposit.status) && Number(entity.Deposit.remainingYield) > 0;
const fromEntity = (entity, options) => {
  const deposit = entity.Deposit;
  const parameters = getParameters(entity, options);
  const initialYield = uint(deposit.initialYield); const remainingYield = uint(deposit.remainingYield);
  if (remainingYield > initialYield) throw new RangeError('Claim remaining quantity exceeds its initial quantity');
  const location = entity.Location?.location;
  const lotId = location?.label === Entity.IDS.LOT ? Number(location.id) : null;
  return {
    id: entity.id,
    label: entity.label,
    resource: integer(deposit.resource, 1, 22, 'claim resource'),
    initialYield: initialYield.toString(),
    remainingYield: remainingYield.toString(),
    status: deposit.status,
    ...parameters,
    lotId,
    lotIndex: lotId ? Lot.toIndex(lotId) : null,
    usable: isUsable(entity)
  };
};
const getComponents = ({ quantity, rateBps, resource, referenceAbundancePpm, campaignId }) => {
  const amount = integer(quantity, 1, 4294967295, 'claim quantity');
  const entity = {
    Deposit: {
      status: Deposit.STATUSES.SAMPLED,
      resource: integer(resource, 1, 22, 'claim resource'),
      initialYield: amount,
      remainingYield: amount,
      finishTime: 0,
      yieldEff: 1
    },
    Claim: { rulesVersion: RULES_VERSION, rateBps, referenceAbundancePpm, campaignId }
  };
  const parameters = getParameters(entity);
  entity.Claim = Object.fromEntries(METADATA_FIELDS.map((field) => [field, parameters[field]]));
  return entity;
};

const fromContractMetadata = (value) => ({
  rulesVersion: integer(value.rules_version, 1, 1, 'claim rules'),
  rateBps: integer(value.rate_bps, 9000, 20000, 'claim rate'),
  referenceAbundancePpm: integer(value.reference_abundance_ppm, 1, 1000000, 'claim reference abundance'),
  campaignId: positive(value.campaign_id).toString()
});
const toContractMetadata = (metadata) => {
  const p = getParameters({ Deposit: {}, Claim: metadata });
  return {
    rules_version: p.rulesVersion,
    rate_bps: p.rateBps,
    reference_abundance_ppm: p.referenceAbundancePpm,
    campaign_id: p.campaignId
  };
};
const packMetadata = (metadata) => {
  const p = toContractMetadata(metadata);
  return BigInt(p.rules_version) + (BigInt(p.rate_bps) << 16n) + (BigInt(p.reference_abundance_ppm) << 32n) + (BigInt(p.campaign_id) << 52n);
};
const unpackMetadata = (value) => {
  const word = uint(value, 116);
  if (!word) return null;
  return fromContractMetadata({
    rules_version: word & 65535n,
    rate_bps: (word >> 16n) & 65535n,
    reference_abundance_ppm: (word >> 32n) & 1048575n,
    campaign_id: word >> 52n
  });
};

export default {
  USE_PERMISSION: PermissionIds.USE_DEPOSIT,
  RULES_VERSION,
  DEFAULT_LEGACY_PARAMETERS,
  METADATA_FIELDS,
  getParameters,
  fromEntity,
  getComponents,
  isUsable,
  fromContractMetadata,
  toContractMetadata,
  packMetadata,
  unpackMetadata
};
