import Entity from './entity.js';
import IDS, { validatePermission } from './permissionIds.js';

const result = (status, reason, requirements = []) => ({ status, reason, requirements });
const allowed = (reason) => result('allowed', reason);
const denied = (reason) => result('denied', reason);
const unresolved = (reason, requirement) => result('unresolved', reason, [requirement]);
const sameEntity = (a, b) => !!a && !!b && a.label !== undefined && b.label !== undefined &&
  a.id !== undefined && b.id !== undefined && BigInt(a.label) === BigInt(b.label) && BigInt(a.id) === BigInt(b.id);
const key = (entity) => Entity.packEntity(entity);
const policyKey = ({ address, target, permission, permitted }) =>
  `${BigInt(address)}:${key(target)}:${BigInt(permission)}:${key(permitted)}`;
const negate = (value, reason) => value.status === 'unresolved'
  ? value
  : result(value.status === 'allowed' ? 'denied' : 'allowed', reason);

// Ordered, lazy composition: an unknown earlier call may revert on chain, so it cannot be skipped.
const either = (first, next) => first.status === 'denied' ? next() : first;
const both = (first, next) => first.status === 'allowed' ? next() : first;

// Undefined means the agreement has not been fully loaded; zero means unset on chain.
export const getPrepaidAgreementEndTime = (agreement) => {
  if (agreement.endTime != null && BigInt(agreement.endTime) === 0n) return 0n;
  if (['endTime', 'noticeTime', 'noticePeriod'].some((field) => agreement[field] == null)) return undefined;
  const noticeEnd = BigInt(agreement.noticeTime) + BigInt(agreement.noticePeriod);
  return BigInt(agreement.endTime) > noticeEnd ? BigInt(agreement.endTime) : noticeEnd;
};

/**
 * Evaluate a single coherent snapshot. Undefined components are unloaded; null or []
 * mean confirmed absence. Collections must contain all records for the entity.
 * No network calls or implicit clock reads occur here.
 */
const create = ({ entities = [], evaluationTime, policyResults = {} }) => {
  const index = new Map(entities
    .filter((entity) => entity?.id !== undefined && entity?.label !== undefined)
    .map((entity) => [key(entity), entity]));
  const missing = (entity, component, reason = 'missing-component') =>
    unresolved(reason, { type: 'component', entity, component });
  const read = (entity, component) => {
    if (!entity || entity.id === undefined || entity.label === undefined) {
      return { error: unresolved('missing-entity', { type: 'entity', entity }) };
    }
    const value = index.get(key(entity))?.[component];
    return value === undefined ? { error: missing(entity, component) } : { value };
  };
  const required = (entity, component, field) => {
    const data = read(entity, component);
    if (data.error) return data;
    if (data.value === null || data.value[field] == null) {
      return { error: missing(entity, component, data.value === null ? 'contract-component-absent' : 'incomplete-component') };
    }
    return { value: data.value[field] };
  };
  const controller = (entity) => {
    if (Number(entity?.label) === Entity.IDS.CREW) return { value: entity };
    const data = read(entity, 'Control');
    if (data.error || data.value === null) return data;
    return required(entity, 'Control', 'controller');
  };
  const delegate = (entity) => {
    const owner = controller(entity);
    if (owner.error) return owner;
    if (!owner.value) return { error: missing(entity, 'Control', 'contract-component-absent') };
    return required(owner.value, 'Crew', 'delegatedTo');
  };
  const controls = (permitted, target) => {
    if (sameEntity(permitted, target)) return allowed('exact-entity');
    const owner = controller(permitted);
    if (owner.error) return owner.error;
    const account = delegate(permitted);
    if (account.error) return account.error;
    const targetOwner = controller(target);
    if (targetOwner.error) return targetOwner.error;
    if (!targetOwner.value) return denied('uncontrolled-target');
    if (sameEntity(owner.value, targetOwner.value)) return allowed('controller');
    const targetAccount = delegate(target);
    if (targetAccount.error) return targetAccount.error;
    return BigInt(account.value) === BigInt(targetAccount.value) ? allowed('shared-delegate') : denied('different-controller');
  };
  const records = (target, component, permission) => {
    const data = read(target, component);
    if (data.error) return data;
    const collection = data.value || [];
    if (collection.some((record) => record.permission == null)) {
      return { error: missing(target, component, 'incomplete-component') };
    }
    const value = collection.filter((record) => Number(record.permission) === Number(permission));
    if (component !== 'PublicPolicies' && value.some((record) => component === 'WhitelistAccountAgreements'
      ? record.permitted === undefined || record.permitted === null
      : record.permitted?.label === undefined || record.permitted?.id === undefined)) {
      return { error: missing(target, component, 'incomplete-component') };
    }
    return { value };
  };
  const can = (permitted, target, permission, until) => {
    if (target?.id === undefined || target?.label === undefined) {
      return unresolved('missing-entity', { type: 'entity', entity: target });
    }
    validatePermission(target, permission);
    const publicPolicies = records(target, 'PublicPolicies', permission);
    if (publicPolicies.error) return publicPolicies.error;
    if (publicPolicies.value.some((p) => p.public !== false)) return allowed('public-policy');
    const control = controls(permitted, target);
    if (control.status !== 'denied') return control;
    const grants = records(target, 'WhitelistAgreements', permission);
    if (grants.error) return grants.error;
    if (grants.value.some((g) => g.whitelisted !== false && sameEntity(g.permitted, permitted))) return allowed('entity-grant');
    const account = delegate(permitted);
    if (account.error) return account.error;
    const accounts = records(target, 'WhitelistAccountAgreements', permission);
    if (accounts.error) return accounts.error;
    if (accounts.value.some((g) => g.whitelisted !== false && BigInt(g.permitted) === BigInt(account.value))) return allowed('account-grant');
    const prepaid = () => {
      const agreements = records(target, 'PrepaidAgreements', permission);
      if (agreements.error) return agreements.error;
      const agreement = agreements.value.find((a) => sameEntity(a.permitted, permitted));
      if (!agreement) return denied('no-prepaid-agreement');
      const end = getPrepaidAgreementEndTime(agreement);
      if (end === undefined) return missing(target, 'PrepaidAgreements', 'incomplete-component');
      if (end === 0n) return denied('revoked-prepaid-agreement');
      const time = until ?? evaluationTime;
      if (time === undefined || time === null) return unresolved('missing-time', { type: 'time' });
      return BigInt(time) <= end ? allowed('prepaid-agreement') : denied('expired-prepaid-agreement');
    };
    const external = () => {
      const agreements = records(target, 'ContractAgreements', permission);
      if (agreements.error) return agreements.error;
      const agreement = agreements.value.find((a) => sameEntity(a.permitted, permitted));
      if (!agreement) return null;
      if (agreement.address == null) return missing(target, 'ContractAgreements', 'incomplete-component');
      if (BigInt(agreement.address) === 0n) return null;
      const request = { address: agreement.address, target, permission, permitted };
      const requestKey = policyKey(request);
      const response = policyResults[requestKey];
      if (response?.status === 'resolved' && typeof response.allowed === 'boolean') {
        return response.allowed ? allowed('external-policy') : denied('external-policy');
      }
      return unresolved(response?.status === 'failed' ? 'policy-read-failed' : 'policy-pending',
        { type: 'policy', key: requestKey, ...request });
    };
    if (until !== undefined) {
      // can_until returns the policy's answer even when a prepaid agreement would allow access.
      return external() ?? prepaid();
    }
    return either(prepaid(), () => external() ?? denied('no-permission'));
  };
  const canUntil = (permitted, target, permission, until) => {
    if (until === undefined || until === null) return unresolved('missing-completion-time', { type: 'completionTime' });
    return can(permitted, target, permission, until);
  };
  const tenantAccess = (lot) => {
    const tenant = read(lot, 'UseLot');
    if (tenant.error) return { error: tenant.error };
    if (!tenant.value) return { tenant: null, access: denied('no-tenant') };
    return { tenant: tenant.value, access: can(tenant.value, lot, IDS.USE_LOT) };
  };
  const lotUsage = (crew, lot) => {
    const tenancy = tenantAccess(lot);
    if (tenancy.error) return tenancy.error;
    if (tenancy.access.status === 'unresolved') return tenancy.access;
    if (tenancy.access.status === 'allowed') {
      return sameEntity(crew, tenancy.tenant) ? allowed('active-tenant') : denied('active-tenant-precedence');
    }
    const asteroid = { label: Entity.IDS.ASTEROID, id: (BigInt(lot.id) % (2n ** 32n)).toString() };
    return either(can(crew, lot, IDS.USE_LOT), () => can(crew, asteroid, IDS.USE_LOT));
  };
  const spaceportProtection = (crew, ship, spaceport) =>
    either(can(crew, spaceport, IDS.DOCK_SHIP), () => can(ship, spaceport, IDS.DOCK_SHIP));
  const shipProtection = (ship) => {
    const owner = controller(ship);
    if (owner.error) return owner.error;
    if (!owner.value) return missing(ship, 'Control', 'contract-component-absent');
    const location = required(ship, 'Location', 'location');
    if (location.error) return location.error;
    if (Number(location.value.label) === Entity.IDS.LOT) return lotUsage(owner.value, location.value);
    if (Number(location.value.label) === Entity.IDS.BUILDING) return spaceportProtection(owner.value, ship, location.value);
    return unresolved('invalid-ship-location', { type: 'component', entity: ship, component: 'Location' });
  };
  const forceLaunch = (crew, ship) => {
    const owner = controller(ship);
    if (owner.error) return owner.error;
    if (!owner.value) return missing(ship, 'Control', 'contract-component-absent');
    return sameEntity(crew, owner.value) ? denied('pilot-launch') : allowed('force-launch');
  };
  const shipEviction = (crew, ship) => both(forceLaunch(crew, ship), () => negate(shipProtection(ship), 'ship-protection'));
  const crewEviction = (crew, guest) => {
    if (sameEntity(crew, guest)) return allowed('self-ejection');
    const location = required(guest, 'Location', 'location');
    if (location.error) return location.error;
    // EjectCrew has no caller-controls-station assertion; see the audit decision note.
    return negate(can(guest, location.value, IDS.STATION_CREW), 'guest-station-permission');
  };
  const repossession = (crew, building, constructionGracePeriod) => {
    const location = required(building, 'Location', 'location');
    if (location.error) return location.error;
    const lot = location.value;
    if (Number(lot.label) !== Entity.IDS.LOT) return unresolved('invalid-building-location', { type: 'component', entity: building, component: 'Location' });
    const tenancy = tenantAccess(lot);
    if (tenancy.error) return tenancy.error;
    if (tenancy.access.status === 'unresolved') return tenancy.access;
    const asteroid = { label: Entity.IDS.ASTEROID, id: (BigInt(lot.id) % (2n ** 32n)).toString() };
    const control = controls(crew, asteroid);
    if (control.status === 'unresolved') return control;
    const active = tenancy.access.status === 'allowed';
    if (active && !sameEntity(crew, tenancy.tenant)) return denied('active-tenant-precedence');
    if (control.status === 'allowed' || (active && sameEntity(crew, tenancy.tenant))) {
      return allowed('repossession-right');
    }
    const data = read(building, 'Building');
    if (data.error) return data.error;
    if (!data.value || data.value.status === undefined) return missing(building, 'Building', 'incomplete-component');
    if (Number(data.value.status) !== 1) return denied('not-planned');
    if (data.value.plannedAt === undefined) return missing(building, 'Building', 'incomplete-component');
    if (constructionGracePeriod == null) return unresolved('missing-grace-period', { type: 'config', key: 'CONSTRUCTION_GRACE_PERIOD' });
    if (evaluationTime === undefined || evaluationTime === null) return unresolved('missing-time', { type: 'time' });
    return BigInt(evaluationTime) >= BigInt(data.value.plannedAt) + BigInt(constructionGracePeriod)
      ? allowed('planned-site-cleanup')
      : denied('construction-grace-period');
  };
  const production = ({ crew, kind, origin, destination, facility, deposit, completionTime }) => {
    const facilityPermission = { process: IDS.RUN_PROCESS, extract: IDS.EXTRACT_RESOURCES, assemble: IDS.ASSEMBLE_SHIP }[kind];
    if (!facilityPermission) throw new Error('Unknown production kind');
    const start = kind === 'extract' ? can(crew, deposit, IDS.USE_DEPOSIT) : can(crew, origin, IDS.REMOVE_PRODUCTS);
    return both(start, () => both(canUntil(crew, facility, facilityPermission, completionTime), () =>
      kind === 'assemble' ? allowed('assembly-permissions') : canUntil(crew, destination, IDS.ADD_PRODUCTS, completionTime)));
  };
  const packageDelivery = (crew, origin) => can(crew, origin, IDS.REMOVE_PRODUCTS);
  const acceptDelivery = (crew, destination) => can(crew, destination, IDS.ADD_PRODUCTS);
  const inventoryAccess = (crew, targets, permission, completionTime) => {
    if (![IDS.ADD_PRODUCTS, IDS.REMOVE_PRODUCTS].includes(permission)) throw new Error('Expected inventory permission');
    return targets.map((target) => ({
      target,
      authorization: completionTime === undefined
        ? can(crew, target, permission)
        : canUntil(crew, target, permission, completionTime)
    }));
  };
  return {
    controls,
    can,
    canUntil,
    lotUsage,
    spaceportProtection,
    shipProtection,
    forceLaunch,
    shipEviction,
    crewEviction,
    repossession,
    production,
    packageDelivery,
    acceptDelivery,
    inventoryAccess
  };
};

const evaluate = ({ permitted, target, permission, until, ...snapshot }) => {
  const evaluator = create(snapshot);
  return until === undefined ? evaluator.can(permitted, target, permission) : evaluator.canUntil(permitted, target, permission, until);
};

export default { create, evaluate, policyKey, sameEntity };
