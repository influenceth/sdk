import { expect } from 'chai';
import assets from '../../src/lib/assets.js';
import building from '../../src/lib/building.js';
import product from '../../src/lib/product.js';
import ship from '../../src/lib/ship.js';

describe('Assets library', function () {
  it('all building ids should be represented', function () {
    expect(!!Object.values(building.IDS).find((id) => !assets.Building[id])).to.be.false;
  });

  it('all product ids should be represented', function () {
    expect(!!Object.values(product.IDS).find((id) => !assets.Product[id])).to.be.false;
  });

  it('all ships ids should be represented', function () {
    expect(!!Object.values(ship.IDS).find((id) => !assets.Ship[id])).to.be.false;
  });

  it('no undefined entries should be present', function () {
    expect(!!Object.keys(assets.Building).find((k) => k === 'undefined')).to.be.false;
    expect(!!Object.keys(assets.Product).find((k) => k === 'undefined')).to.be.false;
    expect(!!Object.keys(assets.Ship).find((k) => k === 'undefined')).to.be.false;
  });

  it('all entries should specify an iconVersion and modelVersion', function () {
    let invalidFound = !!Object.values(assets).find((typeAssets) =>
      !!Object.values(typeAssets).find((versions) =>
        !versions.iconVersion || !versions.modelVersion
      )
    );
    expect(invalidFound).to.be.false;
  });
});