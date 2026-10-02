import { expect } from 'chai';
import Authorization from '../../src/lib/authorization.js';
import Permission from '../../src/lib/permission.js';
import Lot from '../../src/lib/lot.js';

const P = Permission.IDS;
const entity = (label, id, extra = {}) => ({ label, id, ...extra });
const crew = (id, delegatedTo) => entity(1, id, { Crew: { delegatedTo } });
const target = (label, id, controller, extra = {}) => entity(label, id, {
  Control: controller ? { controller } : null,
  PublicPolicies: [],
  WhitelistAgreements: [],
  WhitelistAccountAgreements: [],
  PrepaidAgreements: [],
  ContractAgreements: [],
  ...extra
});
const grant = (permitted, permission) => ({ permitted, permission });
const lease = (permitted, permission, extra = {}) => ({
  ...grant(permitted, permission), endTime: 13600, noticeTime: 0, noticePeriod: 3600, ...extra
});

// Expected values come from access.cairo and the action checks, not another SDK helper.
describe('Contract authorization parity', function () {
  let owner, visitor, sibling, building, entities;
  beforeEach(function () {
    owner = crew(2, '0x222');
    visitor = crew(3, '0x333');
    sibling = crew(4, '0x222');
    building = target(5, 1, owner);
    entities = [owner, visitor, sibling, building];
  });
  const status = (value, expected) => expect(value.status).to.equal(expected);
  const evaluate = (entities, evaluationTime = 10000, policyResults) => Authorization.create({ entities, evaluationTime, policyResults });

  it('matches test_can_control and distinguishes exact identity from delegated control', function () {
    status(evaluate(entities).controls(visitor, visitor), 'allowed');
    status(evaluate(entities).can(owner, building, P.RUN_PROCESS), 'allowed');
    status(evaluate(entities).can(sibling, building, P.RUN_PROCESS), 'allowed');
    status(evaluate(entities).can(visitor, building, P.RUN_PROCESS), 'denied');
    expect(Authorization.sameEntity(owner, sibling)).to.equal(false);
    expect(Authorization.sameEntity(owner, entity(6, owner.id))).to.equal(false);
  });

  it('does not infer control from NFT ownership or sibling ID hints', function () {
    visitor.Nft = { owner: owner.Crew.delegatedTo };
    visitor._siblingCrewIds = [owner.id];
    status(evaluate(entities).controls(visitor, building), 'denied');
  });

  it('checks public before controls, including USE_LOT and unloaded controllers', function () {
    building.label = 4;
    building.PublicPolicies = [grant(null, P.USE_LOT)];
    delete building.Control;
    status(evaluate([building]).can(visitor, building, P.USE_LOT), 'allowed');
    building.PublicPolicies[0].public = false;
    status(evaluate([building]).can(visitor, building, P.USE_LOT), 'unresolved');
  });

  it('checks full entity identity for grants and honors revocation', function () {
    building.WhitelistAgreements = [grant(entity(6, visitor.id), P.RUN_PROCESS)];
    status(evaluate(entities).can(visitor, building, P.RUN_PROCESS), 'denied');
    building.WhitelistAgreements = [grant(visitor, P.RUN_PROCESS)];
    status(evaluate(entities).can(visitor, building, P.RUN_PROCESS), 'allowed');
    building.WhitelistAgreements[0].whitelisted = false;
    status(evaluate(entities).can(visitor, building, P.RUN_PROCESS), 'denied');
  });

  it('matches test_whitelist_account and uses the ship controller delegate', function () {
    const ship = target(6, 9, visitor);
    entities.push(ship);
    building.WhitelistAccountAgreements = [grant('0x0333', P.DOCK_SHIP)];
    status(evaluate(entities).can(visitor, building, P.DOCK_SHIP), 'allowed');
    status(evaluate(entities).can(ship, building, P.DOCK_SHIP), 'allowed');
    visitor.Crew.delegatedTo = '0x444';
    status(evaluate(entities).can(ship, building, P.DOCK_SHIP), 'denied');
  });

  for (const [time, expected] of [[13599, 'allowed'], [13600, 'allowed'], [13601, 'denied']]) {
    it(`matches prepaid contract vector at ${time}`, function () {
      building.PrepaidAgreements = [lease(visitor, P.RUN_PROCESS)];
      status(evaluate(entities, time).can(visitor, building, P.RUN_PROCESS), expected);
      status(evaluate(entities).canUntil(visitor, building, P.RUN_PROCESS, time), expected);
    });
  }
  for (const [time, expected] of [[14999, 'allowed'], [15000, 'allowed'], [15001, 'denied']]) {
    it(`keeps notice extension inclusive at ${time}`, function () {
      building.PrepaidAgreements = [lease(visitor, P.RUN_PROCESS, { noticeTime: 14000, noticePeriod: 1000 })];
      status(evaluate(entities, time).can(visitor, building, P.RUN_PROCESS), expected);
    });
  }

  it('uses max(end, notice + period), including a zero notice timestamp', function () {
    building.PrepaidAgreements = [lease(visitor, P.RUN_PROCESS, { endTime: 100, noticePeriod: 200 })];
    status(evaluate(entities, 200).can(visitor, building, P.RUN_PROCESS), 'allowed');
    building.PrepaidAgreements[0].endTime = 0;
    status(evaluate(entities, 0).can(visitor, building, P.RUN_PROCESS), 'denied');
  });

  it('does not let another entity label inherit a prepaid or contract agreement', function () {
    building.PrepaidAgreements = [lease(entity(6, visitor.id), P.RUN_PROCESS)];
    building.ContractAgreements = [{ ...grant(entity(6, visitor.id), P.RUN_PROCESS), address: '0xabc' }];
    status(evaluate(entities).can(visitor, building, P.RUN_PROCESS), 'denied');
  });

  for (const [response, expected, reason] of [
    [{ status: 'resolved', allowed: true }, 'allowed', 'external-policy'],
    [{ status: 'resolved', allowed: false }, 'denied', 'external-policy'],
    [{ status: 'pending' }, 'unresolved', 'policy-pending'],
    [{ status: 'failed' }, 'unresolved', 'policy-read-failed'],
    [undefined, 'unresolved', 'policy-pending']
  ]) {
    it(`requires external approval: ${JSON.stringify(response)}`, function () {
      building.ContractAgreements = [{ ...grant(visitor, P.RUN_PROCESS), address: '0xabc' }];
      const request = { address: '0xabc', permitted: visitor, target: building, permission: P.RUN_PROCESS };
      const policyResults = { [Authorization.policyKey(request)]: response };
      const value = evaluate(entities, 10000, policyResults).can(visitor, building, P.RUN_PROCESS);
      status(value, expected);
      expect(value.reason).to.equal(reason);
      if (expected === 'unresolved') expect(value.requirements[0]).to.include({ type: 'policy', key: Authorization.policyKey(request) });
    });
  }

  it('preserves the different policy/prepaid evaluation orders', function () {
    building.PrepaidAgreements = [lease(visitor, P.RUN_PROCESS)];
    building.ContractAgreements = [{ ...grant(visitor, P.RUN_PROCESS), address: '0xabc' }];
    const request = { address: '0xabc', permitted: visitor, target: building, permission: P.RUN_PROCESS };
    const auth = evaluate(entities, 10000, { [Authorization.policyKey(request)]: { status: 'resolved', allowed: false } });
    status(auth.can(visitor, building, P.RUN_PROCESS), 'allowed');
    status(auth.canUntil(visitor, building, P.RUN_PROCESS, 11000), 'denied');
    status(evaluate(entities).canUntil(visitor, building, P.RUN_PROCESS, 11000), 'unresolved');
  });

  it('does not skip missing earlier reads for a later grant', function () {
    delete building.PublicPolicies;
    building.WhitelistAgreements = [grant(visitor, P.RUN_PROCESS)];
    const value = evaluate(entities).can(visitor, building, P.RUN_PROCESS);
    status(value, 'unresolved');
    expect(value.requirements[0].component).to.equal('PublicPolicies');
    building.PublicPolicies = null;
    status(evaluate(entities).can(visitor, building, P.RUN_PROCESS), 'allowed');
  });

  it('distinguishes unknown Control from absent Control and missing Crew from rejection', function () {
    delete building.Control;
    status(evaluate(entities).controls(visitor, building), 'unresolved');
    building.Control = null;
    status(evaluate(entities).controls(visitor, building), 'denied');
    visitor.Crew = null;
    expect(evaluate(entities).controls(visitor, building).reason).to.equal('contract-component-absent');
  });

  it('keeps null required fields unresolved rather than interpreting them as zero or no controller', function () {
    building.Control.controller = null;
    status(evaluate(entities).controls(visitor, building), 'unresolved');
    building.Control.controller = owner;
    visitor.Crew.delegatedTo = null;
    status(evaluate(entities).can(visitor, building, P.RUN_PROCESS), 'unresolved');
    visitor.Crew.delegatedTo = '0x333';
    building.PrepaidAgreements = [lease(visitor, P.RUN_PROCESS, { endTime: null })];
    status(evaluate(entities).can(visitor, building, P.RUN_PROCESS), 'unresolved');
  });

  it('requires the permitted Crew read even for matching controllers', function () {
    delete owner.Crew;
    status(evaluate(entities).controls(owner, building), 'unresolved');
    status(evaluate(entities).controls(owner, owner), 'allowed');
  });

  it('requires complete lease fields and explicit time, including zero', function () {
    building.PrepaidAgreements = [lease(visitor, P.RUN_PROCESS)];
    status(Authorization.create({ entities }).can(visitor, building, P.RUN_PROCESS), 'unresolved');
    status(evaluate(entities, 0).can(visitor, building, P.RUN_PROCESS), 'allowed');
    status(evaluate(entities).canUntil(visitor, building, P.RUN_PROCESS), 'unresolved');
    delete building.PrepaidAgreements[0].noticeTime;
    status(evaluate(entities).can(visitor, building, P.RUN_PROCESS), 'unresolved');
  });

  it('recomputes controller and policy changes without retained decisions', function () {
    status(evaluate(entities).controls(visitor, building), 'denied');
    building.Control.controller = visitor;
    status(evaluate(entities).controls(visitor, building), 'allowed');
    building.Control.controller = owner;
    building.PublicPolicies = [grant(null, P.RUN_PROCESS)];
    status(evaluate(entities).can(visitor, building, P.RUN_PROCESS), 'allowed');
    building.PublicPolicies = [];
    status(evaluate(entities).can(visitor, building, P.RUN_PROCESS), 'denied');
  });

  describe('Action rules', function () {
    let lot, asteroid, ship;
    beforeEach(function () {
      lot = target(4, Lot.toId(1, 42), null, { UseLot: null });
      asteroid = target(3, 1, owner);
      ship = target(6, 10, visitor, { Location: { location: lot } });
      entities.push(lot, asteroid, ship);
    });

    // Matches lot_planning_permissions.cairo's no-lease grant matrix and ship_eviction protections.
    for (const scope of ['lot', 'asteroid']) {
      for (const kind of ['entity', 'account', 'public', 'prepaid', 'contract']) {
        it(`protects lot use and a surface ship with a ${scope} ${kind} grant`, function () {
          const resource = scope === 'lot' ? lot : asteroid;
          const policyResults = {};
          if (kind === 'entity') resource.WhitelistAgreements = [grant(visitor, P.USE_LOT)];
          if (kind === 'account') resource.WhitelistAccountAgreements = [grant(visitor.Crew.delegatedTo, P.USE_LOT)];
          if (kind === 'public') resource.PublicPolicies = [grant(null, P.USE_LOT)];
          if (kind === 'prepaid') resource.PrepaidAgreements = [lease(visitor, P.USE_LOT, { endTime: 300, noticePeriod: 20 })];
          if (kind === 'contract') {
            resource.ContractAgreements = [{ ...grant(visitor, P.USE_LOT), address: '0xabc' }];
            const request = { address: '0xabc', permitted: visitor, target: resource, permission: P.USE_LOT };
            policyResults[Authorization.policyKey(request)] = { status: 'resolved', allowed: true };
          }
          status(evaluate(entities, 201, policyResults).lotUsage(visitor, lot), 'allowed');
          status(evaluate(entities, 201, policyResults).shipProtection(ship), 'allowed');
          status(evaluate(entities, 201, policyResults).shipEviction(owner, ship), 'denied');
        });
      }
    }

    it('supports string labels and bigint lot IDs without lossy conversion', function () {
      lot.label = '4';
      lot.id = BigInt(lot.id);
      asteroid.WhitelistAgreements = [grant(visitor, P.USE_LOT)];
      status(evaluate(entities).lotUsage(visitor, lot), 'allowed');
    });

    it('applies active tenant precedence over asteroid grants and shared wallets', function () {
      lot.UseLot = owner;
      lot.WhitelistAgreements = [grant(owner, P.USE_LOT)];
      asteroid.PublicPolicies = [grant(null, P.USE_LOT)];
      status(evaluate(entities).lotUsage(owner, lot), 'allowed');
      status(evaluate(entities).lotUsage(sibling, lot), 'denied');
      status(evaluate(entities).lotUsage(visitor, lot), 'denied');
    });

    it('falls back for expired, revoked and cleared tenancy', function () {
      lot.UseLot = visitor;
      lot.PrepaidAgreements = [lease(visitor, P.USE_LOT, { endTime: 9000 })];
      status(evaluate(entities).lotUsage(owner, lot), 'allowed');
      lot.PrepaidAgreements = [];
      status(evaluate(entities).lotUsage(owner, lot), 'allowed');
      lot.UseLot = null;
      status(evaluate(entities).lotUsage(owner, lot), 'allowed');
      delete lot.UseLot;
      status(evaluate(entities).lotUsage(owner, lot), 'unresolved');
    });

    it('protects an occupied lot independently of planning and allows bystander cleanup after expiry', function () {
      lot.LotUse = ship;
      lot.UseLot = visitor;
      lot.PrepaidAgreements = [lease(visitor, P.USE_LOT)];
      status(evaluate(entities).shipProtection(ship), 'allowed');
      status(evaluate(entities).shipEviction(sibling, ship), 'denied');
      status(evaluate(entities, 13601).shipProtection(ship), 'denied');
      status(evaluate(entities, 13601).shipEviction(sibling, ship), 'allowed');
    });

    it('does not turn unresolved tenant or policy reads into eviction rights', function () {
      lot.UseLot = visitor;
      lot.ContractAgreements = [{ ...grant(visitor, P.USE_LOT), address: '0xabc' }];
      status(evaluate(entities).shipEviction(owner, ship), 'unresolved');
      const request = { address: '0xabc', permitted: visitor, target: lot, permission: P.USE_LOT };
      status(evaluate(entities, 10000, { [Authorization.policyKey(request)]: { status: 'failed' } }).shipEviction(owner, ship), 'unresolved');
    });

    it('classifies same-wallet other crews as force launch', function () {
      ship.Control.controller = owner;
      status(evaluate(entities).controls(sibling, ship), 'allowed');
      status(evaluate(entities).forceLaunch(sibling, ship), 'allowed');
      status(evaluate(entities).forceLaunch(owner, ship), 'denied');
    });

    for (const subject of ['crew', 'ship']) {
      it(`protects docking with a ${subject} grant, independent of asteroid rights`, function () {
        ship.Location.location = building;
        asteroid.PublicPolicies = [grant(null, P.USE_LOT)];
        status(evaluate(entities).shipProtection(ship), 'denied');
        building.WhitelistAgreements = [grant(subject === 'crew' ? visitor : ship, P.DOCK_SHIP)];
        status(evaluate(entities).shipProtection(ship), 'allowed');
        building.WhitelistAgreements = [];
        status(evaluate(entities).shipProtection(ship), 'denied');
      });
    }

    it('recomputes protection when the ship changes location', function () {
      lot.PublicPolicies = [grant(null, P.USE_LOT)];
      status(evaluate(entities).shipProtection(ship), 'allowed');
      ship.Location.location = building;
      status(evaluate(entities).shipProtection(ship), 'denied');
    });

    it('mirrors crew self-ejection and permissionless guest eviction, including shared-wallet guests', function () {
      visitor.Location = { location: building };
      status(evaluate(entities).crewEviction(visitor, visitor), 'allowed');
      status(evaluate(entities).crewEviction(sibling, visitor), 'allowed');
      visitor.Crew.delegatedTo = owner.Crew.delegatedTo;
      status(evaluate(entities).crewEviction(owner, visitor), 'denied');
      delete building.PublicPolicies;
      status(evaluate(entities).crewEviction(owner, visitor), 'unresolved');
    });

    it('protects active tenants from asteroid-controller repossession', function () {
      building.Location = { location: lot };
      lot.UseLot = visitor;
      lot.WhitelistAgreements = [grant(visitor, P.USE_LOT)];
      status(evaluate(entities).repossession(owner, building, 100), 'denied');
      status(evaluate(entities).repossession(visitor, building, 100), 'allowed');
      lot.WhitelistAgreements = [];
      status(evaluate(entities).repossession(owner, building, 100), 'allowed');
    });

    it('requires expired tenants to use planned cleanup and blocks cleanup when their grant is restored', function () {
      building.Location = { location: lot };
      building.Building = { status: 1, plannedAt: 9900 };
      lot.UseLot = visitor;
      lot.PrepaidAgreements = [lease(visitor, P.USE_LOT, { endTime: 9000 })];
      status(evaluate(entities, 9999).repossession(visitor, building, 100), 'denied');
      status(evaluate(entities, 10000).repossession(visitor, building, 100), 'allowed');
      lot.WhitelistAgreements = [grant(visitor, P.USE_LOT)];
      const bystander = crew(99, '0x999');
      entities.push(bystander);
      const decision = evaluate(entities).repossession(bystander, building, 100);
      status(decision, 'denied');
      expect(decision.reason).to.equal('active-tenant-precedence');
      lot.WhitelistAgreements = [];
      status(evaluate(entities).repossession(bystander, building, 100), 'allowed');
      lot.UseLot = null;
      status(evaluate(entities).repossession(bystander, building, 100), 'allowed');
    });

    it('blocks same-wallet crews from taking an active tenant site after grace', function () {
      building.Location = { location: lot };
      building.Building = { status: 1, plannedAt: 9900 };
      lot.UseLot = visitor;
      lot.WhitelistAgreements = [grant(visitor, P.USE_LOT)];
      const tenantSibling = crew(99, visitor.Crew.delegatedTo);
      entities.push(tenantSibling);
      status(evaluate(entities).repossession(tenantSibling, building, 100), 'denied');
      status(evaluate(entities).repossession(visitor, building, 100), 'allowed');
    });

    it('keeps planned cleanup unresolved when tenant access or the preceding controller read is unknown', function () {
      building.Location = { location: lot };
      building.Building = { status: 1, plannedAt: 9900 };
      lot.UseLot = visitor;
      lot.ContractAgreements = [{ ...grant(visitor, P.USE_LOT), address: '0xabc' }];
      status(evaluate(entities).repossession(sibling, building, 100), 'unresolved');
      lot.WhitelistAgreements = [grant(visitor, P.USE_LOT)];
      delete asteroid.Control;
      status(evaluate(entities).repossession(sibling, building, 100), 'unresolved');
    });

    for (const [kind, permission] of [['process', P.RUN_PROCESS], ['extract', P.EXTRACT_RESOURCES], ['assemble', P.ASSEMBLE_SHIP]]) {
      it(`requires ${kind} facility access through completion`, function () {
        const origin = target(5, 20, visitor);
        const destination = target(5, 21, visitor);
        const deposit = target(7, 22, visitor);
        entities.push(origin, destination, deposit);
        building.PrepaidAgreements = [lease(visitor, permission)];
        const args = { crew: visitor, kind, origin, destination, facility: building, deposit, completionTime: 13600 };
        status(evaluate(entities).production(args), 'allowed');
        status(evaluate(entities).production({ ...args, completionTime: 13601 }), 'denied');
        destination.Control.controller = owner;
        status(evaluate(entities).production(args), kind === 'assemble' ? 'allowed' : 'denied');
      });
    }

    it('requires destination permission through completion, not just now', function () {
      ship.PrepaidAgreements = [lease(owner, P.ADD_PRODUCTS)];
      status(evaluate(entities).production({ crew: owner, kind: 'process', origin: building, facility: building, destination: ship, completionTime: 13601 }), 'denied');
      status(evaluate(entities).can(owner, ship, P.ADD_PRODUCTS), 'allowed');
    });

    it('matches the modified checkout delivery permission checks without authorizing payment', function () {
      building.WhitelistAgreements = [grant(visitor, P.REMOVE_PRODUCTS)];
      status(evaluate(entities).packageDelivery(visitor, building), 'allowed');
      status(evaluate(entities).acceptDelivery(visitor, building), 'denied');
      building.WhitelistAgreements = [grant(visitor, P.ADD_PRODUCTS)];
      status(evaluate(entities).acceptDelivery(visitor, building), 'allowed');
      status(evaluate(entities).controls(visitor, building), 'denied');
    });

    it('retains unresolved inventory candidates for clients to resolve', function () {
      delete ship.PublicPolicies;
      const values = evaluate(entities).inventoryAccess(visitor, [building, ship], P.ADD_PRODUCTS);
      expect(values.map((v) => v.authorization.status)).to.deep.equal(['denied', 'unresolved']);
    });
  });

  it('rejects invalid permission paths and supports USE_DEPOSIT agreement paths', function () {
    expect(() => evaluate(entities).can(visitor, building, P.USE_LOT)).to.throw('Invalid permission');
    expect(Permission.getAgreementPath(entity(7, 22), P.USE_DEPOSIT, visitor)).to.have.length(3);
  });

  it('reports incomplete grant keys and absent subject data without granting or denying', function () {
    building.WhitelistAgreements = [{ permission: P.RUN_PROCESS }];
    expect(evaluate(entities).can(visitor, building, P.RUN_PROCESS).reason).to.equal('incomplete-component');
    status(evaluate(entities).can({}, building, P.RUN_PROCESS), 'unresolved');
  });

  it('keeps legacy boolean calls for resolved inputs and throws on unresolved data', function () {
    expect(Permission.isPermitted(visitor, P.RUN_PROCESS, building, 10000, { entities })).to.equal(false);
    building.PublicPolicies = [grant(null, P.RUN_PROCESS)];
    expect(Permission.isPermitted(visitor, P.RUN_PROCESS, building, 10000)).to.equal(true);
    delete building.PublicPolicies;
    expect(() => Permission.isPermitted(visitor, P.RUN_PROCESS, building, 10000)).to.throw('Unresolved authorization');
    building.Processors = [{}];
    expect(Permission.getPolicyDetails(building, visitor, 10000)[P.RUN_PROCESS].crewStatus).to.equal('unresolved');
  });
});
