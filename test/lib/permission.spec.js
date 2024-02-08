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

    const rate = Permission.Entity.getPrepaidPolicyRate(entity);
    expect(rate).to.equal(1000);

    entity.id = Lot.toId(1, 1598602);
    const rate2 = Permission.Entity.getPrepaidPolicyRate(entity);
    expect(rate2).to.be.lessThan(1000);

    entity.id = Lot.toId(1, 1);
    const rate3 = Permission.Entity.getPrepaidPolicyRate(entity);
    expect(rate3).to.equal(10);
  });
});
