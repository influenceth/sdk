import { expect } from 'chai';
import inventory from '../../src/lib/inventory.js';
import { checkIdsAndTypes } from '../testUtils.js';

describe('Inventory library', function () {
  checkIdsAndTypes(inventory.IDS, inventory.TYPES);

  it('should get filled capacity', function () {
    // no massConstraint, but product constraints
    let filled = inventory.getFilledCapacity(inventory.IDS.WAREHOUSE_SITE);
    expect(filled).to.deep.equal({ filledMass: 950e6, filledVolume: 867e6 });

    // massConstraint, but no product constraints
    filled = inventory.getFilledCapacity(inventory.IDS.WAREHOUSE_PRIMARY);
    expect(filled).to.deep.equal({ filledMass: 1500000e6, filledVolume: 75000e6 });

    // massConstraint and product constraints
    filled = inventory.getFilledCapacity(inventory.IDS.PROPELLANT_SMALL);
    expect(filled).to.deep.equal({ filledMass: 2000e6, filledVolume: 26600e6 });
  });

  it('should get resource details and totals with two arrays', function () {
    const { products, totals } = inventory.getContents([ 3, 6, 8 ], [ 34523, 45642, 6743 ]);

    expect(products[3].mass).to.equal(34523000);
    expect(products[3].volume).to.equal(47296510);

    expect(products[6].mass).to.equal(45642000);
    expect(products[6].volume).to.equal(36559242);

    expect(products[8].mass).to.equal(6743000);
    expect(products[8].volume).to.equal(14969460);

    expect(totals.mass).to.equal(86908000);
    expect(totals.volume).to.equal(98825212);
  });

  it('should get resource details and totals with one object', function () {
    const { products, totals } = inventory.getContents({ 3: 34523, 6: 45642, 8: 6743 });

    expect(products[3].mass).to.equal(34523000);
    expect(products[3].volume).to.equal(47296510);

    expect(products[6].mass).to.equal(45642000);
    expect(products[6].volume).to.equal(36559242);

    expect(products[8].mass).to.equal(6743000);
    expect(products[8].volume).to.equal(14969460);

    expect(totals.mass).to.equal(86908000);
    expect(totals.volume).to.equal(98825212);
  });

});