import Asteroid from './asteroid.js';
import Building from './building.js';
import Entity from './entity.js';
import Lot from './lot.js';
import Inventory from './inventory.js';

const IDS = {
  USE_LOT: 1,
  RUN_PROCESS: 2,
  ADD_PRODUCTS: 3,
  REMOVE_PRODUCTS: 4,
  STATION_CREW: 5,
  RECRUIT_CREWMATE: 6,
  DOCK_SHIP: 7,
  BUY: 8,
  SELL: 9,
  LIMIT_BUY: 10,
  LIMIT_SELL: 11,
  EXTRACT_RESOURCES: 12,
  ASSEMBLE_SHIP: 13
};

const MAX_POLICY_DURATION = 31536000; // 1 yr in IRL seconds

const TYPES = {
  [IDS.USE_LOT]: {
    name: 'Use Lot',
    isApplicable: (entity) => entity.label === Entity.IDS.ASTEROID || entity.label === Entity.IDS.LOT,
    isExclusive: true
  },
  [IDS.RUN_PROCESS]: {
    name: 'Run Processes',
    isApplicable: (entity) => !!entity.Processors?.length
  },
  [IDS.ADD_PRODUCTS]: {
    name: 'Add Products',
    isApplicable: (entity) => !!(entity.Inventories || [])?.find((i) => i.status === Inventory.STATUSES.AVAILABLE)
  },
  [IDS.REMOVE_PRODUCTS]: {
    name: 'Remove Products',
    isApplicable: (entity) => !!(entity.Inventories || [])?.find((i) => i.status === Inventory.STATUSES.AVAILABLE)
  },
  [IDS.STATION_CREW]: {
    name: 'Station Crews',
    isApplicable: (entity) => !!entity.Station
  },
  [IDS.RECRUIT_CREWMATE]: {
    name: 'Recruit Crewmates',
    isApplicable: (entity) => entity.Building?.buildingType === Building.IDS.HABITAT
  },
  [IDS.DOCK_SHIP]: {
    name: 'Dock Ships',
    isApplicable: (entity) => !!entity.Dock
  },
  [IDS.BUY]: {
    name: 'Place Market Buys',
    isApplicable: (entity) => !!entity.Exchange
  },
  [IDS.SELL]: {
    name: 'Place Market Sells',
    isApplicable: (entity) => !!entity.Exchange
  },
  [IDS.LIMIT_BUY]: {
    name: 'Place Limit Buys',
    isApplicable: (entity) => !!entity.Exchange
  },
  [IDS.LIMIT_SELL]: {
    name: 'Place Limit Sells',
    isApplicable: (entity) => !!entity.Exchange
  },
  [IDS.EXTRACT_RESOURCES]: {
    name: 'Extract Resources',
    isApplicable: (entity) => !!entity.Extractors?.length
  },
  [IDS.ASSEMBLE_SHIP]: {
    name: 'Assemble Ships',
    isApplicable: (entity) => !!entity.DryDocks?.length
  }
};

const POLICY_IDS = {
  PRIVATE: 1,
  PUBLIC: 2,
  PREPAID: 3,
  CONTRACT: 4
};

const POLICY_TYPES = {
  [POLICY_IDS.PRIVATE]: {
    name: 'Private',
    description: `The permission is retained by the controlling crew.`,
    policyKey: null,
    agreementKey: null,
    additionSystem: null,
    removalSystem: null,
  },
  [POLICY_IDS.PUBLIC]: {
    name: 'Public',
    description: `The permission is granted to any visiting crew.`,
    policyKey: 'PublicPolicies',
    agreementKey: null,
    additionSystem: 'AssignPublicPolicy',
    removalSystem: 'RemovePublicPolicy'
  },
  [POLICY_IDS.PREPAID]: {
    name: 'Prepaid Lease',
    nameShort: 'Prepaid',
    description: `The permission may be leased for up to 12 months for a pre-paid sum.`,
    policyKey: 'PrepaidPolicies',
    agreementKey: 'PrepaidAgreements',
    additionSystem: 'AssignPrepaidPolicy',
    removalSystem: 'RemovePrepaidPolicy'
  },
  [POLICY_IDS.CONTRACT]: {
    name: 'Custom Contract',
    nameShort: 'Custom',
    description: `The permission is granted through terms specified in the Custom Contract.`,
    policyKey: 'ContractPolicies',
    agreementKey: 'ContractAgreements',
    additionSystem: 'AssignContractPolicy',
    removalSystem: 'RemoveContractPolicy'
  },
};

const getPermissionPolicy = (entity, rawPermId, crew) => {
  const permId = Number(rawPermId);

  // default perm policy to private
  const permPolicy = {
    policyType: POLICY_IDS.PRIVATE,
    policyDetails: {},
    agreements: [],
  };

  // if there is one, find and apply an active policy for the perm (and related agreements)
  Object.keys(POLICY_TYPES).forEach((key) => {
    const { policyKey, agreementKey } = POLICY_TYPES[key];
    if (policyKey) {
      const activePolicy = (entity[policyKey] || []).find((p) => p.permission === permId);
      if (activePolicy) {
        const { permission, ...policyDetails } = activePolicy;
        permPolicy.policyType = Number(key);
        permPolicy.policyDetails = policyDetails;
      }

      // agreement could be from previous policy, so need to attach agreements from any policy type (even if not active)
      if (agreementKey) {
        permPolicy.agreements.push(...(entity[agreementKey] || []).filter((a) => a.permission === permId));
      }
    }
  });

  // attach whitelist for the perm
  permPolicy.allowlist = (entity.WhitelistAgreements || []).filter((a) => a.permission === permId).map((a) => a.permitted);
  permPolicy.accountAllowlist = (entity.WhitelistAccountAgreements || []).filter((a) => a.permission === permId).map((a) => a.permitted);

  // attach crew agreement status (if crew provided)
  permPolicy.crewStatus = '';
  if (crew) {
    if (entity.Control?.controller?.id === crew.id) permPolicy.crewStatus = 'controller';
    // if not exclusive, policy is "granted" just by being public or on allowlist
    else if (!TYPES[permId].isExclusive && permPolicy.policyType === POLICY_IDS.PUBLIC) permPolicy.crewStatus = 'granted';
    else if (!TYPES[permId].isExclusive && permPolicy.allowlist.find((c) => c.id === crew.id)) permPolicy.crewStatus = 'granted';
    else if (!TYPES[permId].isExclusive && crew?.Crew?.delegatedTo && permPolicy.accountAllowlist.find((a) => Address.areEqual(a, crew?.Crew?.delegatedTo))) permPolicy.crewStatus = 'granted';
    // else, granted if have explicit agreement
    else if (permPolicy.agreements?.find((a) => a.permitted?.id === crew.id)) permPolicy.crewStatus = 'granted';
    // for exclusive perms, also worth noting when being excluded
    else if (TYPES[permId].isExclusive && permPolicy.agreements?.length > 0) permPolicy.crewStatus = 'under contract';
    else if (POLICY_TYPES[permPolicy.policyType]?.agreementKey) permPolicy.crewStatus = 'available';
    else permPolicy.crewStatus = 'restricted';
  }

  return permPolicy;
};

// TODO: put this in Crew?
const isPermitted = (crew, permission, hydratedTarget) => {
  const policy = getPermissionPolicy(hydratedTarget, permission, crew);
  return policy.crewStatus === 'controller' || policy.crewStatus === 'granted';
}

// get the applicable policies, agreements, and allowlists for this entity
const getPolicyDetails = (entity, crew = null) => {
  return Object.keys(TYPES)
    .filter((id) => TYPES[id].isApplicable(entity))
    .reduce((acc, permId) => ({
      ...acc,
      [permId]: getPermissionPolicy(entity, permId, crew)
    }), {});
};
Entity.getPolicyDetails = getPolicyDetails;

// Return Adalia Prime's unique prepaid policy rate
const getAdaliaPrimeLotRate = (policy, lotIndex) => {
  const centers = [
    457078, // Secondary colony
    1096252, // Mining colony
    1602262 // Primary colony
  ];

  const minDistance = Math.min(...centers.map((center) => Asteroid.getLotDistance(1, lotIndex, center)));

  if (minDistance < 20) return Math.floor(policy.rate);
  if (minDistance < 50) return Math.floor(policy.rate / 2);
  if (minDistance < 75) return Math.floor(policy.rate / 4);
  if (minDistance < 100) return Math.floor(policy.rate / 10);
  return Math.floor(policy.rate / 100);
};

// Retrieves the prepaid policy rate for the entity in SWAY / IRL hour
const getPrepaidPolicyRate = (entity) => {
  const policy = entity.PrepaidPolicies ? entity.PrepaidPolicies[0] : null;
  if (!policy) return 0;

  const lotPos = Lot.toPosition(entity);
  if (entity.label === Entity.IDS.LOT && lotPos.asteroidId === 1) {
    return getAdaliaPrimeLotRate(policy, lotPos.lotIndex);
  }

  return policy.rate;
};
Entity.getPrepaidPolicyRate = getPrepaidPolicyRate;

export default {
  IDS,
  TYPES,
  POLICY_IDS,
  POLICY_TYPES,
  MAX_POLICY_DURATION,

  getAdaliaPrimeLotRate,
  getPolicyDetails,
  getPrepaidPolicyRate,
  isPermitted,

  Entity
};
