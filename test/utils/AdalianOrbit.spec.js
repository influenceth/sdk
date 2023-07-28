import { expect } from 'chai';
import almostEqual from 'almost-equal';
import AdalianOrbit from '../../src/utils/AdalianOrbit.js';

describe('Orbital library', function () {
  it('should create an orbit from a position', function () {
    const r = [ -192699041645.188, -223423094198.8061, 400973733.18174685 ];
    const v = [ 10641.777646952463, -17626.86516323293, 48.436547164921816 ];
    const orbit = AdalianOrbit.fromStateVectors(r, v);
    const pos = orbit.getPositionAtTime(0);
    expect(almostEqual(pos.x, r[0], 0, 1e-7)).to.be.true;
    expect(almostEqual(pos.y, r[1], 0, 1e-7)).to.be.true;
    expect(almostEqual(pos.z, r[2], 0, 1e-7)).to.be.true;
  });

  it('should create an orbit from a set of asteroid params', function () {
    const orbit = new AdalianOrbit({
      a: 2.192,
      e: 0.325,
      i: 0.002443460952792061,
      o: 3.4108969571725183,
      w: 5.283809777487633,
      m: 0.9480628496833199
    });

    const pos = orbit.getPositionAtTime(0);
    expect(almostEqual(pos.x, -192699041645.188, 0, 1e-7)).to.be.true;
    expect(almostEqual(pos.y, -223423094198.8061, 0, 1e-7)).to.be.true;
    expect(almostEqual(pos.z, 400973733.18174685, 0, 1e-7)).to.be.true;
  });
});
