import { expect } from 'chai';
import asteroid from '../../src/lib/asteroid.js';

describe('Asteroid library', function () {
  it('should get bonuses', function () {
    const packed = parseInt('101001', 2);
    const bonuses = asteroid.getBonuses(packed, 1);
    expect(bonuses[0].name).to.equal('Yield3');
    expect(bonuses[1].name).to.equal('Volatile2');
  });

  it('should return bonus for resource and a set of bonuses', function () {
    let packed = parseInt('101001', 2);
    let bonuses = asteroid.getBonuses(packed, 1);
    let bonus = asteroid.getBonusByResource(bonuses, 1);
    expect(bonus.totalBonus).to.equal(1.38);
    bonus = asteroid.getBonusByResource(bonuses, 9);
    expect(bonus.totalBonus).to.equal(1.15);

    packed = parseInt('1', 2);
    bonuses = asteroid.getBonuses(packed, 1);
    bonus = asteroid.getBonusByResource(bonuses, 1);
    expect(bonus.totalBonus).to.equal(1);
  });

  it('should get spectral types', function () {
    let type = asteroid.getSpectralType(0);
    expect(type.name).to.equal('C');
    type = asteroid.getSpectralType(10);
    expect(type.name).to.equal('I');
  });

  it('should fail to get invalid spectral type', function () {
    try {
      const type = asteroid.getSpectralType(11);
    } catch (error) {
      expect(error.message).to.deep.contain('Invalid spectral type');
    }
  });

  it('should calculate abundance map params', function () {
    let settings = asteroid.getAbundanceMapSettings(1, 42, 1, 0.25);
    expect(settings.octaves).to.equal(8);
    settings = asteroid.getAbundanceMapSettings(104, 42, 1, 0.25);
    expect(settings.octaves).to.equal(5);
    settings = asteroid.getAbundanceMapSettings(250000, 42, 1, 0.25);
    expect(settings.octaves).to.equal(3);
  });

  it('should get abundances at a unit sphere position', function () {
    const point = asteroid.getLotPosition(100, 1);
    const abundance = asteroid.getAbundanceAtPosition(point, {
      octaves: 6, lowerCutoff: 0, upperCutoff: 1, pointScale: 1, pointShift: [ -0.005, 11.578, -2.87 ]
    });

    expect(Number(abundance.toFixed(5))).to.equal(0.40892)
  });

  it('should get abundance at a specific lot', function () {
    const asteroidSeed = 3590329621830653642883442320016035471801660656180234502900732533901525272177n;
    const abundance = asteroid.getAbundanceAtLot(1000, asteroidSeed, 2096, 10, 0.212)
    expect(Number(abundance.toFixed(5))).to.equal(0.04443);
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

  it('should calculate distances between lots', function () {
    const argsList = [
      { asteroid_id: 250000, origin_lot: 1, dest_lot: 13 },
      { asteroid_id: 250000, origin_lot: 4, dest_lot: 8 },
      { asteroid_id: 1, origin_lot: 2345, dest_lot: 345634 },
      { asteroid_id: 2500, origin_lot: 123, dest_lot: 342 },
      { asteroid_id: 25000, origin_lot: 78, dest_lot: 23 }
    ];

    const expected = [ 3.2161, 2.8149, 347.7338, 15.1174, 3.0699 ];

    for (const [ i, args ] of argsList.entries()) {
      const distance = asteroid.getLotDistance(args.asteroid_id, args.origin_lot, args.dest_lot);
      expect(Number(distance.toFixed(4))).to.equal(expected[i]);
    }
  });

  it('should calculate the time to travel between lots', function () {
    const argsList = [
      { asteroid_id: 250000, origin_lot: 1, dest_lot: 13 },
      { asteroid_id: 250000, origin_lot: 4, dest_lot: 8 },
      { asteroid_id: 1, origin_lot: 2345, dest_lot: 345634 },
      { asteroid_id: 2500, origin_lot: 123, dest_lot: 342 },
      { asteroid_id: 25000, origin_lot: 78, dest_lot: 23 }
    ];

    const expected = [ 0, 0, 20865, 908, 0 ];

    for (const [ i, args ] of argsList.entries()) {
      const distance = asteroid.getLotTravelTime(args.asteroid_id, args.origin_lot, args.dest_lot);
      expect(Number(distance.toFixed(4))).to.equal(expected[i]);
    }
  });

  it('should calculate the time to travel between lots with bonuses', function () {
    const argsList = [
      { asteroid_id: 1, origin_lot: 2345, dest_lot: 345634, totalBonus: 1.5 },
      { asteroid_id: 2500, origin_lot: 123, dest_lot: 342, totalBonus: 3.1 }
    ];

    const expected = [13910, 0 ];

    for (const [ i, args ] of argsList.entries()) {
      const distance = asteroid.getLotTravelTime(args.asteroid_id, args.origin_lot, args.dest_lot, args.totalBonus);
      expect(Number(distance.toFixed(4))).to.equal(expected[i]);
    }
  });
});
