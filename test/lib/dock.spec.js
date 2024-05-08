import { expect } from 'chai';
import dock from '../../src/lib/dock.js';
import { checkIdsAndTypes } from '../testUtils.js';

describe('Dock library', function () {
  checkIdsAndTypes(dock.IDS, dock.TYPES);

  it('should get the ground delay for a dock', function () {
    const dockType = dock.IDS.BASIC;
    expect(dock.getGroundDelay(dockType, 0)).to.equal(0);
    expect(dock.getGroundDelay(dockType, 25)).to.equal(0);
    expect(dock.getGroundDelay(dockType, 35)).to.equal(10 * 720);
    expect(dock.getGroundDelay(dockType, 50)).to.equal(25 * 720);
  });
});