import { expect } from 'chai';
import asteroid from '../../src/models/asteroid.js';

describe.only('Asteroid model', function () {
  it('should get settings for resource maps', function () {
    const result = asteroid.getResourceMapSettings(100000, 13, 1, 0.3332);
    console.log(result);
  });

  it('should get the radius', function () {
    const APRadius = asteroid.getRadius(1);
    expect(APRadius).to.equal(375.142);
    const LasteroidRadius = asteroid.getRadius(250000);
    expect(LasteroidRadius.toFixed(4)).to.equal('1.0237');
  });

  it('should get the surface area', function () {
    const APArea = asteroid.getSurfaceArea(1);
    expect(APArea).to.equal(1768484);
    const LasteroidArea = asteroid.getSurfaceArea(250000);
    expect(LasteroidArea).to.equal(13);
  });

  it('should get the lot position', function () {
    let position = asteroid.getLotPosition(1, 1);
    expect(position).to.eql([ 0, 1, 0 ]);
    position = asteroid.getLotPosition(250000, 13);
    expect(position).to.eql([ -0, -1, -0 ]);
  });

  it('should calculate distances between lots', async function () {
    const argsList = [
      { asteroid_id: 250000, origin_lot: 1, dest_lot: 13 },
      { asteroid_id: 250000, origin_lot: 4, dest_lot: 8 },
      { asteroid_id: 1, origin_lot: 2345, dest_lot: 345634 },
      { asteroid_id: 2500, origin_lot: 123, dest_lot: 342 },
      { asteroid_id: 25000, origin_lot: 78, dest_lot: 23 }
    ];

    const expectedDistances = [ 3.2161, 2.8149, 347.7338, 15.1174, 3.0699 ];

    for (const [ i, args ] of argsList.entries()) {
      const distance = asteroid.getLotDistance(args.asteroid_id, args.origin_lot, args.dest_lot);
      expect(Number(distance.toFixed(4))).to.equal(expectedDistances[i]);
    }
  });
});
