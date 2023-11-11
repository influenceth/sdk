import { expect } from 'chai';
import station from '../../src/lib/station.js';
import { checkIdsAndTypes } from '../testUtils.js';

describe('Station library', function () {
  checkIdsAndTypes(station.IDS, station.TYPES);

  it('should calculate correct efficiency', function () {
    expect(station.getEfficiency(3, 0)).to.equal(1.2);
    expect(station.getEfficiency(3, 250)).to.equal(1.2);
    expect(station.getEfficiency(3, 375)).to.equal(0.975);
    expect(station.getEfficiency(3, 500)).to.equal(0.75);
    expect(station.getEfficiency(3, 625)).to.equal(0.75);

    expect(station.getEfficiency(1, 5)).to.equal(1.0);
    expect(station.getEfficiency(1, 1)).to.equal(1.0);
  });
});