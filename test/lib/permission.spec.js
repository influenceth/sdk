import { expect } from 'chai';
import Entity from '../../src/lib/entity.js';
import Lot from '../../src/lib/lot.js';
import Permission from '../../src/lib/permission.js';

describe('Permission library', function () {
  it('should get the prices for Adalia Prime lease', function () {
    const entity = {
      label: Entity.IDS.LOT,
      id: Lot.toId(1, 457078),
      PrepaidPolicies: [
        { rate: 1000 }
      ]
    };

    let rate = Permission.Entity.getPrepaidPolicyRate(entity);
    expect(rate).to.equal(500);

    entity.id = Lot.toId(1, 1096252);
    rate = Permission.Entity.getPrepaidPolicyRate(entity);
    expect(rate).to.equal(200);

    entity.id = Lot.toId(1, 1598602);
    rate = Permission.Entity.getPrepaidPolicyRate(entity);
    expect(rate).to.equal(1000);

    entity.id = Lot.toId(1, 1580548);
    rate = Permission.Entity.getPrepaidPolicyRate(entity);
    expect(rate).to.equal(500);

    entity.id = Lot.toId(1, 1547367);
    rate = Permission.Entity.getPrepaidPolicyRate(entity);
    expect(rate).to.equal(250);

    entity.id = Lot.toId(1, 1501732);
    rate = Permission.Entity.getPrepaidPolicyRate(entity);
    expect(rate).to.equal(100);

    entity.id = Lot.toId(1, 1470059);
    rate = Permission.Entity.getPrepaidPolicyRate(entity);
    expect(rate).to.equal(10);
  });
});
