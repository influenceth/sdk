import Building from './building';
import Entity from './entity';
import inventory from './inventory';

const IDS = {
  LOT_USE: 1,
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

const MAX_POLICY_DURATION = 12;

const TYPES = {
  [IDS.LOT_USE]: {
    name: 'Use Lot',
    isApplicable: (entity) => entity.label === Entity.IDS.LOT
  },
  [IDS.RUN_PROCESS]: {
    name: 'Run Processes',
    isApplicable: (entity) => !!(entity.Processor || entity.Processors?.length)
  },
  [IDS.ADD_PRODUCTS]: {
    name: 'Add Products',
    isApplicable: (entity) => !!(entity.Inventory || entity.Inventories)?.find((i) => i.status === inventory.STATUSES.AVAILABLE)
  },
  [IDS.REMOVE_PRODUCTS]: {
    name: 'Remove Products',
    isApplicable: (entity) => !!(entity.Inventory || entity.Inventories)?.find((i) => i.status === inventory.STATUSES.AVAILABLE)
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
    isApplicable: (entity) => !!(entity.Extractor || entity.Extractors?.length)
  },
  [IDS.ASSEMBLE_SHIP]: {
    name: 'Assemble Ships',
    isApplicable: (entity) => !!(entity.DryDock || entity.DryDocks?.length)
  }
};

const POLICY_TYPES = [
  {
    key: 'private',
    name: 'Private',
    description: `The permission is retained by the controlling crew.`,
    color: '#7e2b2a',
    policyKey: 'ContractPolicies',
    agreementKey: 'ContractAgreements',
    additionSystem: 'AssignContractPolicy',
    removalSystem: 'RemoveContractPolicy'
  },
  {
    key: 'contract',
    name: 'Custom Contract',
    nameShort: 'Custom',
    description: `The permission is granted through terms specified in the Custom Contract.`,
    color: '#363d65',
    policyKey: 'ContractPolicies',
    agreementKey: 'ContractAgreements',
    additionSystem: 'AssignContractPolicy',
    removalSystem: 'RemoveContractPolicy'
  },
  {
    key: 'prepaid',
    name: 'Prepaid Lease',
    nameShort: 'Prepaid',
    description: `The permission may be leased for up to 12 months for a pre-paid sum.`,
    color: '#185c5c',
    policyKey: 'PrepaidPolicies',
    agreementKey: 'PrepaidAgreements',
    additionSystem: 'AssignPrepaidPolicy',
    removalSystem: 'RemovePrepaidPolicy'
  },
  {
    key: 'public',
    name: 'Public',
    description: `The permission is granted to any visiting crew.`,
    color: '#336342',
    policyKey: 'PublicPolicies',
    additionSystem: 'AssignPublicPolicy',
    removalSystem: 'RemovePublicPolicy'
  },
];

const getPolicyDetails = (entity) => {

  // get the applicable policies for this entity, default policytype to private for each
  const policies = Object.keys(TYPES)
    .filter((id) => TYPES[id].isApplicable(entity))
    .reduce((acc, permId) => ({
      ...acc,
      [permId]: {
        policyType: 'private',
        policyDetails: {},
        allowlist: [],
      }
    }), {});

  // find the active policy type for each (and related agreements)
  POLICY_TYPES.forEach(({ key, policyKey, agreementKey }) => {
    (entity[policyKey] || []).forEach(({ permission, ...policyDetails }) => {
      policies[permission].policyType = key;
      policies[permission].policyDetails = policyDetails;
      if (agreementKey) {
        policies[permission].agreements = (entity[agreementKey] || []).filter((a) => a.permission === permission);
      }
    });
  });

  // attach allowlist
  (entity.WhitelistAgreements || []).forEach(({ permission, permitted }) => {
    if (policies[permission]) policies[permission].allowlist.push(permitted);
  });

  return policies;
};

export default {
  IDS,
  TYPES,
  POLICY_TYPES,
  MAX_POLICY_DURATION,

  getPolicyDetails
};
