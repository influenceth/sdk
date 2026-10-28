import { expect } from 'chai';
import inventory from '../../src/lib/inventory.js';
import Crew from '../../src/lib/crew.js';
import Crewmate from '../../src/lib/crewmate.js';
import Product from '../../src/lib/product.js';
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

  it('should truncate modified capacities for every inventory and capacity bonus', function () {
    for (const base of Object.values(inventory.TYPES).filter(type => type.modifiable)) {
      for (let rank = 0; rank <= 55; rank++) {
        const magnitude = 2n ** 32n + BigInt(rank) * 125n * 429496n / 2n;
        const bonus = Number(magnitude) / 2 ** 32;
        const type = inventory.getType(base.i, { mass: bonus, volume: bonus });
        const mass = Number(BigInt(base.massConstraint) * magnitude / 2n ** 32n);
        const volume = Number(BigInt(base.volumeConstraint) * magnitude / 2n ** 32n);
        expect(type.massConstraint).to.equal(mass);
        expect(type.volumeConstraint).to.equal(volume);
        expect(inventory.getFilledCapacity(base.i, { mass: bonus, volume: bonus }))
          .to.deep.equal({ filledMass: mass, filledVolume: volume });
      }
    }
  });

  it('should preserve unmodifiable inventories and base types', function () {
    const site = inventory.getType(inventory.IDS.WAREHOUSE_SITE);
    expect(inventory.getType(site.i, { mass: 1.25, volume: 1.25 })).to.deep.equal(site);
    const base = { ...inventory.TYPES[inventory.IDS.CARGO_SMALL] };
    inventory.getType(base.i, { mass: 1.25, volume: 1.25 });
    expect(inventory.TYPES[base.i]).to.deep.equal(base);
    expect(inventory.getType(-1)).to.equal(null);
  });

  for (const occupied of [false, true]) {
    for (const reserved of [false, true]) {
      for (const dimension of ['mass', 'volume']) {
        it(`should fit a full ${dimension} transfer with occupied=${occupied}, reserved=${reserved}`, function () {
          const crewmates = [
            { titleId: 58, collectionId: Crewmate.COLLECTION_IDS.ARVAD_SPECIALIST, traitIds: [Crewmate.TRAIT_IDS.HAULER] },
            { titleId: 19, collectionId: Crewmate.COLLECTION_IDS.ARVAD_CITIZEN, traitIds: [Crewmate.TRAIT_IDS.HAULER] }
          ];
          const bonuses = {
            mass: Crew.getAbilityBonus(Crewmate.ABILITY_IDS.INVENTORY_MASS_CAPACITY, crewmates).totalBonus,
            volume: Crew.getAbilityBonus(Crewmate.ABILITY_IDS.INVENTORY_VOLUME_CAPACITY, crewmates).totalBonus
          };
          const base = inventory.TYPES[dimension === 'mass' ? inventory.IDS.CARGO_MEDIUM : inventory.IDS.WAREHOUSE_PRIMARY];
          const type = inventory.getType(base.i, bonuses);
          // Contract arithmetic is independent of the SDK's computed bonuses.
          const contractMass = BigInt(base.massConstraint) * (2n ** 32n + 1000n * 429496n) / 2n ** 32n;
          const contractVolume = BigInt(base.volumeConstraint) * (2n ** 32n + 15n * 125n * 429496n / 2n) / 2n ** 32n;
          const productId = dimension === 'mass' ? Product.IDS.STEEL : Product.IDS.HYDROGEN;
          const product = Product.TYPES[productId];
          const used = occupied ? inventory.getContents({ [productId]: 12345 }).totals : { mass: 0, volume: 0 };
          const held = reserved ? inventory.getContents({ [productId]: 6789 }).totals : { mass: 0, volume: 0 };
          const quantity = Math.floor(Math.min(
            (type.massConstraint - used.mass - held.mass) / product.massPerUnit,
            (type.volumeConstraint - used.volume - held.volume) / product.volumePerUnit
          ));
          const total = inventory.getContents({ [productId]: quantity }).totals;
          const mass = BigInt(total.mass + used.mass + held.mass);
          const volume = BigInt(total.volume + used.volume + held.volume);
          expect(mass <= contractMass).to.equal(true);
          expect(volume <= contractVolume).to.equal(true);
          expect(dimension === 'mass'
            ? mass + BigInt(product.massPerUnit) > contractMass
            : volume + BigInt(product.volumePerUnit) > contractVolume).to.equal(true);
        });
      }
    }
  }

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
