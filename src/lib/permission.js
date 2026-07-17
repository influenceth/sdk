import { shortString } from 'starknet';
import Address from '../utils/address.js';
import Asteroid from './asteroid.js';
import Building from './building.js';
import Entity from './entity.js';
import Lot from './lot.js';
import Inventory from './inventory.js';

const MAX_POLICY_DURATION = 31536000; // in IRL seconds
const MAX_LEASE_LAPSE_SECONDS = 31536000;
const MAX_AUCTION_LEASE_LAPSE_SECONDS = 15768000;

const AUCTION_STEPS = 168;
const AUCTION_STEP_SECONDS = 3600;
const AUCTION_DESCENDING_PERIOD = 604800;

const AUCTION_MODES = {
  MANUAL: 1,
  AUTO: 2
};

const AUCTION_STATUSES = {
  INACTIVE: 0,
  ACTIVE: 1
};

const DEFAULT_PREPAID_AGREEMENT_AUCTION_SETTINGS = {
  mode: AUCTION_MODES.MANUAL,
  gracePeriod: 0
};

const AUCTION_PRICES = [
  1000000000000000000n, 847507816922201829n, 718269499744236373n, 608739015690039773n,
  515911074262835575n, 437238668274483725n, 370563189223278490n, 314055199530349540n,
  266164236547033044n, 225576271058740502n, 191177653034444020n, 162024555367531806n,
  137317077207327299n, 116377296330119398n, 98630668352047662n, 83590262416621616n,
  70843400816664960n, 60040335969476251n, 50884654064766367n, 43125142081271588n,
  36548895019758263n, 30975474229114060n, 26251956542046379n, 22248738378886241n,
  18855979692763086n, 15980590185343013n, 13543675101108422n, 11478370518043979n,
  9728008739571616n, 8244563449874440n, 6987331970879664n, 5921818464750930n,
  5018787439270645n, 4253461586252832n, 3604841943327583n, 3055131725739148n,
  2589248019290944n, 2194407936299403n, 1859777879529861n, 1576176290640554n,
  1335821727165310n, 1132119355787117n, 959480003718509n, 813166803331979n,
  689165222285491n, 584072913037881n, 495006359452125n, 419521759061877n,
  355547970173893n, 301329684013196n, 255379262671881n, 216435921394247n,
  183431135244384n, 155459320986529n, 131752989749501n, 111661688715573n,
  94634154037181n, 80203185294331n, 67972826479005n, 57607501779253n,
  48822808071277n, 41377711484499n, 35067933929465n, 29720348128532n,
  25188227360580n, 21347219582505n, 18091935465728n, 15333056730456n,
  12994885436373n, 11013266987335n, 9333829861617n, 7910493769543n,
  6704205305402n, 5681866402579n, 4815426190893n, 4081111338594n,
  3458773761188n, 2931337799572n, 2484331699177n, 2105490534880n,
  1784419686766n, 1512309633204n, 1281694235747n, 1086245883700n,
  920601877535n, 780217287484n, 661240250041n, 560406280773n,
  474948703607n, 402522738944n, 341141167744n, 289119806337n,
  245031295898n, 207665938664n, 175998506326n, 149160109878n,
  126414359094n, 107137157504n, 90799578467n, 76953352524n,
  65218567802n, 55273246021n, 46844508069n, 39701086769n,
  33646981377n, 28516079732n, 24167600481n, 20482230324n,
  17358850307n, 14711761328n, 12468332726n, 10567009449n,
  8955623110n, 7589960591n, 6432550931n, 5451637197n,
  4620305139n, 3915744722n, 3318624261n, 2812560002n,
  2383666587n, 2020176066n, 1712115007n, 1451030852n,
  1229759990n, 1042231204n, 883299092n, 748602885n,
  634446797n, 537698620n, 455703783n, 386212519n,
  327318128n, 277404672n, 235102628n, 199251315n,
  168867047n, 143116142n, 121292049n, 102795960n,
  87120379n, 73835202n, 62575911n, 53033574n,
  44946368n, 38092398n, 32283605n, 27360608n,
  23188329n, 19652290n, 16655469n, 14115640n,
  11963115n, 10138834n, 8592741n, 7282415n,
  6171903n, 5230736n, 4433090n, 3757078n,
  3184153n, 2698595n, 2287080n, 1938318n,
  1642740n, 1392235n, 1179930n, 1000000n
];

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
  ASSEMBLE_SHIP: 13,
  USE_DEPOSIT: 14
};

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
  },
  [IDS.USE_DEPOSIT]: {
    name: 'Use Deposit',
    isApplicable: (entity) => !!entity.Deposit
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
    description: 'The permission is retained by the controlling crew.',
    policyKey: null,
    agreementKey: null,
    additionSystem: null,
    removalSystem: null
  },
  [POLICY_IDS.PUBLIC]: {
    name: 'Public',
    description: 'The permission is granted to any visiting crew.',
    policyKey: 'PublicPolicies',
    agreementKey: null,
    additionSystem: 'AssignPublicPolicy',
    removalSystem: 'RemovePublicPolicy'
  },
  [POLICY_IDS.PREPAID]: {
    name: 'Prepaid Lease',
    nameShort: 'Prepaid',
    description: 'The permission may be leased for up to 12 months for a pre-paid sum.',
    policyKey: 'PrepaidPolicies',
    agreementKey: 'PrepaidAgreements',
    additionSystem: 'AssignPrepaidPolicy',
    removalSystem: 'RemovePrepaidPolicy'
  },
  [POLICY_IDS.CONTRACT]: {
    name: 'Custom Contract',
    nameShort: 'Custom',
    description: 'The permission is granted through terms specified in the Custom Contract.',
    policyKey: 'ContractPolicies',
    agreementKey: 'ContractAgreements',
    additionSystem: 'AssignContractPolicy',
    removalSystem: 'RemoveContractPolicy'
  }
};

const toBigInt = (value) => BigInt(value || 0);

const divCeil = (numerator, denominator) => {
  numerator = toBigInt(numerator);
  denominator = toBigInt(denominator);
  return numerator === 0n ? 0n : (numerator - 1n) / denominator + 1n;
};

const getRoundedHours = (seconds) => divCeil(toBigInt(seconds), 3600n);

const toFelt = (value) => {
  if (value && typeof value === 'object' && value.id !== undefined && value.label !== undefined) {
    return Entity.packEntity(value);
  }
  return value;
};

const validatePermission = (target, permission) => {
  if (!target?.label) throw new Error('Invalid target entity');

  if (target.label === Entity.IDS.ASTEROID || target.label === Entity.IDS.LOT) {
    if (permission === IDS.USE_LOT) return;
  } else if (target.label === Entity.IDS.BUILDING) {
    if ([
      IDS.RUN_PROCESS,
      IDS.ADD_PRODUCTS,
      IDS.REMOVE_PRODUCTS,
      IDS.STATION_CREW,
      IDS.RECRUIT_CREWMATE,
      IDS.DOCK_SHIP,
      IDS.BUY,
      IDS.SELL,
      IDS.LIMIT_BUY,
      IDS.LIMIT_SELL,
      IDS.EXTRACT_RESOURCES,
      IDS.ASSEMBLE_SHIP
    ].includes(permission)) return;
  } else if (target.label === Entity.IDS.SHIP) {
    if ([IDS.ADD_PRODUCTS, IDS.REMOVE_PRODUCTS, IDS.STATION_CREW].includes(permission)) return;
  }

  throw new Error('Invalid permission');
};

const validateLot = (lot) => {
  if (!lot || lot.label !== Entity.IDS.LOT) throw new Error('Invalid lot entity');
};

const getAgreementPath = (target, permission, permitted) => {
  permission = Number(permission);
  validatePermission(target, permission);
  return [Entity.packEntity(target), permission, toFelt(permitted)];
};

const getUseLotPath = (lot) => {
  validateLot(lot);
  return [shortString.encodeShortString('UseLot'), Entity.packEntity(lot)];
};

const getLotUsePath = (lot) => {
  validateLot(lot);
  return [shortString.encodeShortString('LotUse'), Entity.packEntity(lot)];
};

const getPrepaidAgreementMemo = (target, permission, permitted) => getAgreementPath(target, permission, permitted);

const getAuctionControllerMemo = (target, permission, previousTenant) => [
  ...getAgreementPath(target, permission, previousTenant),
  shortString.encodeShortString('auction_controller')
];

const getAuctionBuildingMemo = (target, permission, previousTenant) => [
  ...getAgreementPath(target, permission, previousTenant),
  shortString.encodeShortString('auction_building')
];

const getAuctionSettings = (settings = null) => {
  if (!settings) return { ...DEFAULT_PREPAID_AGREEMENT_AUCTION_SETTINGS };
  return {
    mode: settings.mode || DEFAULT_PREPAID_AGREEMENT_AUCTION_SETTINGS.mode,
    gracePeriod: settings.gracePeriod ?? settings.grace_period ?? DEFAULT_PREPAID_AGREEMENT_AUCTION_SETTINGS.gracePeriod
  };
};

const getAuctionPriceAtStep = (step) => AUCTION_PRICES[Math.max(0, Math.min(Number(step), AUCTION_STEPS - 1))];

const getAuctionStep = (settings, elapsed) => {
  settings = getAuctionSettings(settings);
  elapsed = Number(elapsed || 0);

  if (elapsed < settings.gracePeriod) return 0;

  const descendingElapsed = elapsed - settings.gracePeriod;
  if (descendingElapsed >= AUCTION_DESCENDING_PERIOD) return AUCTION_STEPS - 1;

  return Math.floor(descendingElapsed / AUCTION_STEP_SECONDS);
};

const getAuctionPrice = (settings, elapsed) => getAuctionPriceAtStep(getAuctionStep(settings, elapsed));

const getLeaseLapseAmount = (rate, elapsed, maxElapsed = MAX_LEASE_LAPSE_SECONDS) => (
  toBigInt(rate) * getRoundedHours(Math.min(Number(elapsed || 0), maxElapsed))
);

const getAuctionLeaseLapseAmount = (rate, elapsed) => (
  getLeaseLapseAmount(rate, elapsed, MAX_AUCTION_LEASE_LAPSE_SECONDS)
);

const getPrepaidAgreementPaymentAmount = (rate, term) => toBigInt(rate) * getRoundedHours(term);

const getPrepaidAgreementExtensionPaymentAmount = (agreement, addedTerm) => {
  return getPrepaidAgreementPaymentAmount(agreement?.rate || 0, addedTerm);
};

const getAuctionPaymentSplit = ({ auctionAmount, auctionLeaseLapseAmount, leaseLapseAmount, hasBuildingController = true }) => {
  auctionAmount = toBigInt(auctionAmount);
  auctionLeaseLapseAmount = toBigInt(auctionLeaseLapseAmount ?? leaseLapseAmount);

  let toController = auctionAmount < auctionLeaseLapseAmount ? auctionAmount : auctionLeaseLapseAmount;
  let toBuildingController = auctionAmount - toController;

  if (!hasBuildingController && toBuildingController > 0n) {
    toController = auctionAmount;
    toBuildingController = 0n;
  }

  return { toController, toBuildingController };
};

const isAuctionActive = (auction) => !!auction && Number(auction.status) === AUCTION_STATUSES.ACTIVE;

const getPrepaidAgreementStatus = ({ agreement = null, auction = null, settings = null, now = null } = {}) => {
  now = Number(now || Math.floor(Date.now() / 1000));
  const agreementEndTime = agreement?.endTime ?? agreement?.end_time;
  const auctionStartTime = auction?.startTime ?? auction?.start_time;
  const isActive = !!agreementEndTime && Number(agreementEndTime) > now;
  const elapsed = agreementEndTime ? Math.max(0, now - Number(agreementEndTime)) : 0;
  const activeAuction = isAuctionActive(auction);
  const auctionElapsed = activeAuction ? Math.max(0, now - Number(auctionStartTime || 0)) : elapsed;
  const resolvedSettings = getAuctionSettings(settings);

  return {
    isActive,
    isExpired: !!agreement && !isActive,
    isAuctionActive: activeAuction,
    elapsed,
    auctionElapsed,
    auctionStep: getAuctionStep(resolvedSettings, auctionElapsed),
    auctionPrice: getAuctionPrice(resolvedSettings, auctionElapsed),
    leaseLapseAmount: agreement ? getLeaseLapseAmount(agreement.rate, elapsed) : 0n,
    auctionLeaseLapseAmount: agreement ? getAuctionLeaseLapseAmount(agreement.rate, elapsed) : 0n
  };
};

const getPermissionPolicy = (entity, rawPermId, crew, blockTime = null) => {
  const nowTime = blockTime || Math.floor(Date.now() / 1000);
  const permId = Number(rawPermId);

  // default perm policy to private
  const permPolicy = {
    policyType: POLICY_IDS.PRIVATE,
    policyDetails: {},
    agreements: []
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
        permPolicy.agreements.push(
          ...(entity[agreementKey] || [])
            .filter((a) => a.permission === permId)
            .filter((a) => !a.endTime || a.endTime > nowTime)
        );
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
    else if ((crew._siblingCrewIds || []).includes(entity.Control?.controller?.id)) permPolicy.crewStatus = 'controller';

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
const isPermitted = (crew, permission, hydratedTarget, blockTime = null) => {
  try {
    const policy = getPermissionPolicy(hydratedTarget, permission, crew, blockTime);
    return policy.crewStatus === 'controller' || policy.crewStatus === 'granted';
  } catch {}
  return false;
};

// get the applicable policies, agreements, and allowlists for this entity
const getPolicyDetails = (entity, crew = null, blockTime = null) => {
  return Object.keys(TYPES)
    .filter((id) => TYPES[id].isApplicable(entity))
    .reduce((acc, permId) => ({
      ...acc,
      [permId]: getPermissionPolicy(entity, permId, crew, blockTime)
    }), {});
};
Entity.getPolicyDetails = getPolicyDetails;

// Return Adalia Prime's unique prepaid policy rate
const getAdaliaPrimeLotRate = (policy, lotIndex) => {
  const centers = [
    { lot: 457078, modifier: 2 }, // Secondary colony (Ya'axche)
    { lot: 1096252, modifier: 5 }, // Mining colony (Saline)
    { lot: 1602262, modifier: 1 } // Primary colony (Arkos)
  ];

  let minDistance = Infinity;
  let modifier = 0;

  centers.forEach((center) => {
    const distance = Asteroid.getLotDistance(1, lotIndex, center.lot);

    if (distance < minDistance) {
      minDistance = distance;
      modifier = center.modifier;
    }
  });

  if (minDistance < 20) return Math.ceil(policy.rate / modifier);
  if (minDistance < 50) return Math.ceil(policy.rate / (2 * modifier));
  if (minDistance < 75) return Math.ceil(policy.rate / (4 * modifier));
  if (minDistance < 100) return Math.ceil(policy.rate / (10 * modifier));
  return Math.ceil(policy.rate / 100);
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
  AUCTION_DESCENDING_PERIOD,
  AUCTION_MODES,
  AUCTION_PRICES,
  AUCTION_STATUSES,
  AUCTION_STEP_SECONDS,
  AUCTION_STEPS,
  IDS,
  DEFAULT_PREPAID_AGREEMENT_AUCTION_SETTINGS,
  MAX_AUCTION_LEASE_LAPSE_SECONDS,
  MAX_LEASE_LAPSE_SECONDS,
  TYPES,
  POLICY_IDS,
  POLICY_TYPES,
  MAX_POLICY_DURATION,

  getAdaliaPrimeLotRate,
  getAgreementPath,
  getAuctionBuildingMemo,
  getAuctionControllerMemo,
  getAuctionLeaseLapseAmount,
  getAuctionPaymentSplit,
  getAuctionPrice,
  getAuctionPriceAtStep,
  getAuctionSettings,
  getAuctionStep,
  getLeaseLapseAmount,
  getLotUsePath,
  getPolicyDetails,
  getPrepaidAgreementExtensionPaymentAmount,
  getPrepaidAgreementMemo,
  getPrepaidAgreementPaymentAmount,
  getPrepaidAgreementStatus,
  getPrepaidPolicyRate,
  getUseLotPath,
  isPermitted,

  Entity
};
