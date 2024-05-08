import { expect } from 'chai';
import ship from '../../src/lib/ship.js';
import { checkIdsAndTypes } from '../testUtils.js';

describe('Ship library', function () {
  checkIdsAndTypes(ship.IDS, ship.TYPES);

  it('should not have any undefined CONSTRUCTION_TYPES keys', function () {
    expect(!!Object.keys(ship.CONSTRUCTION_TYPES).find((k) => k === 'undefined')).to.be.false;
  });

  it('should not have any undefined CONSTRUCTION_TYPES requirements', function () {
    const invalid = !!Object.values(ship.CONSTRUCTION_TYPES).find((ct) =>
      !!Object.keys(ct.requirements).find((k) => k === 'undefined')
    );
    expect(invalid).to.be.false;
  });

  it('should get type', function () {
    expect(ship.getType(ship.IDS.SHUTTLE)?.name).to.equal('Shuttle');
    expect(ship.getType(ship.IDS.LIGHT_TRANSPORT)?.name).to.equal('Light Transport');
  });

  it('should get construction type', function () {
    const construction = ship.getConstructionType(ship.IDS.HEAVY_TRANSPORT);
    expect(construction.constructionTime).to.equal(ship.CONSTRUCTION_TYPES[ship.IDS.HEAVY_TRANSPORT].constructionTime);
    expect(construction.requirements).to.deep.equal(ship.CONSTRUCTION_TYPES[ship.IDS.HEAVY_TRANSPORT].requirements);
    expect(Object.keys(construction.requirements).length).to.be.greaterThan(0);
  });

  it('should get variants', function () {
    expect(ship.getVariant(1).name).to.equal('Standard');
  });

  it('should calculate delta-V', function () {
    let deltaV = ship.propellantToDeltaV(ship.IDS.LIGHT_TRANSPORT, 1951773000 + 185525000, 1951773000, 0.5);
    expect(Math.round(deltaV)).to.equal(36662);

    deltaV = ship.propellantToDeltaV(ship.IDS.LIGHT_TRANSPORT, 1951773000 + 185525000, 1951773000, 1);
    expect(Math.round(deltaV)).to.equal(73323);
  });

  it('should calculate required propellant', function () {
    let res = ship.getPropellantRequirement(ship.IDS.LIGHT_TRANSPORT, 1951773000 + 185525000, 73323, 1);
    expect((res - 1951773000) / 1951773000).to.be.lessThan(0.001);

    res = ship.getPropellantRequirement(ship.IDS.LIGHT_TRANSPORT, 1951773000 + 185525000, 36662, 0.5);
    expect((res - 1951773000) / 1951773000).to.be.lessThan(0.001);
  });
});