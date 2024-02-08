import Building from './building';
import Entity from './entity';
import Inventory from './inventory';

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

const MAX_POLICY_DURATION = 31536000; // 1 yr in IRL seconds

const TYPES = {
  [IDS.LOT_USE]: {
    name: 'Use Lot',
    isApplicable: (entity) => entity.label === Entity.IDS.LOT
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

// get the applicable policies, agreements, and allowlists for this entity
const getPolicyDetails = (entity, crewId = null) => {
  return Object.keys(TYPES)
    .filter((id) => TYPES[id].isApplicable(entity))
    .reduce((acc, strPermId) => {
      const permId = Number(strPermId);

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

      // attach crew agreement status (if crew provided)
      permPolicy.crewStatus = '';
      if (crewId) {
        if (entity.Control?.controller?.id === crewId) permPolicy.crewStatus = 'controller';
        else if (permPolicy.policyType === POLICY_IDS.PUBLIC) permPolicy.crewStatus = 'granted';
        else if (permPolicy.allowlist.find((c) => c.id === crewId)) permPolicy.crewStatus = 'granted';
        else if (permPolicy.agreements?.find((a) => a.permitted?.id === crewId)) permPolicy.crewStatus = 'granted';
        else if (POLICY_TYPES[permPolicy.policyType]?.agreementKey) permPolicy.crewStatus = 'available';
        else permPolicy.crewStatus = 'restricted';
      }

      return {
        ...acc,
        [permId]: permPolicy
      };
    }, {});
};

export default {
  IDS,
  TYPES,
  POLICY_IDS,
  POLICY_TYPES,
  MAX_POLICY_DURATION,

  getPolicyDetails
};
