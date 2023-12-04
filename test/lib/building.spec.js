import { expect } from 'chai';
import building from '../../src/lib/building.js';
import { checkIdsAndTypes } from '../testUtils.js';

describe('Building library', function () {
  checkIdsAndTypes(building.IDS, building.TYPES);

  it('should not have any undefined CONSTRUCTION_TYPES keys', function () {
    expect(!!Object.keys(building.CONSTRUCTION_TYPES).find((k) => k === 'undefined')).to.be.false;
  });

  it('should not have any undefined CONSTRUCTION_TYPES requirements', function () {
    const invalid = !!Object.values(building.CONSTRUCTION_TYPES).find((ct) => 
      !!Object.keys(ct.requirements).find((k) => k === 'undefined')
    );
    expect(invalid).to.be.false;
  });

  it('should get type', function () {
    expect(building.getType(building.IDS.WAREHOUSE)?.name).to.equal('Warehouse');
    expect(building.getType(building.IDS.SHIPYARD)?.name).to.equal('Shipyard');
  });

  it('should get construction type', function () {
    const construction = building.getConstructionType(building.IDS.EXTRACTOR);
    expect(construction.constructionTime).to.equal(building.CONSTRUCTION_TYPES[building.IDS.EXTRACTOR].constructionTime);
    expect(construction.requirements).to.deep.equal(building.CONSTRUCTION_TYPES[building.IDS.EXTRACTOR].requirements);
    expect(Object.keys(construction.requirements).length).to.be.greaterThan(0);
  });

  it('should get construction time', function () {
    // no bonus
    let time = building.getConstructionTime(building.IDS.WAREHOUSE);
    expect(time).to.equal(1728000);

    // bonus
    time = building.getConstructionTime(building.IDS.HABITAT, 1.25);
    expect(time).to.equal(11612160);
  });
});