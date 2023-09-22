import { expect } from 'chai';
import axios from 'axios';
import asteroid from '../../src/lib/asteroid.js';
import product from '../../src/lib/product.js';
import { SIMPLEX_POLY_FIT } from '../../src/constants.js';
import { checkIdsAndTypes } from '../testUtils.js';

describe('Asteroid library', function () {
  describe('SPECTRAL_TYPES', function () {
    checkIdsAndTypes(asteroid.SPECTRAL_IDS, asteroid.SPECTRAL_TYPES);

    it('should not have any undefined resources within a type', function () {
      expect(!!Object.keys(asteroid.SPECTRAL_TYPES).find((k) => asteroid.SPECTRAL_TYPES[k].resources.includes(undefined))).to.be.false;
    });
  });

  it('should get base name', function() {
    expect(asteroid.getBaseName(1, 1)).to.equal('1-C');
    expect(asteroid.getBaseName(104, 5)).to.equal('104-CMS');
    expect(asteroid.getBaseName(250000, 11)).to.equal('250000-I');
  });

  it('should get asteroid seed', function () {
    expect(asteroid.getSeed(1)).to.eql('0xc724751ccde05a7706fc8a93757fa3783eda21e98941d100b254017f455576ab');
    expect(asteroid.getSeed(4)).to.eql('0x22d99e32b149d9f3e77b55c2a90a946a79e759762a1cd3d73e95af8f14e4768d');
    expect(asteroid.getSeed(250000)).to.eql('0xa57bd63a2ca351918eec3092d3aada3808e7492ba2471532998a82f84969c91e');
    expect(asteroid.Entity.getSeed({ id: 1 })).to.eql('0xc724751ccde05a7706fc8a93757fa3783eda21e98941d100b254017f455576ab');
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

  it('should get unpacked abundances', function () {
    let abundances = {};
    abundances = asteroid.getAbundances(0n);
    expect(Object.keys(abundances).length).to.equal(22);
    expect(!!Object.values(abundances).find((v) => v > 0)).to.be.false;

    abundances = asteroid.getAbundances(164550455732120604215496918255735050498273586563358426139512320200n);
    expect(JSON.stringify(abundances)).to.equal(`{"1":0.2,"2":0.3,"3":0,"4":0,"5":0.4,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0.1}`);
  });

  it('should get bonus by index', function () {
    let bonus = asteroid.getBonus(asteroid.BONUS_IDS.YIELD_2);
    expect(bonus.name).to.equal('Yield2');
    bonus = asteroid.getBonus(asteroid.BONUS_IDS.FISSILE);
    expect(bonus.name).to.equal('Fissile3');
  });

  it('should get bonuses', function () {
    const allBonuses = parseInt('110010010010010', 2);
    // C-Type has Volatile, Organic
    const bonuses1 = asteroid.getBonuses(parseInt('10100010', 2), asteroid.SPECTRAL_IDS.C_TYPE);
    expect(bonuses1.length).to.equal(3);
    expect(bonuses1[0].name).to.equal('Yield1');
    expect(bonuses1[1].name).to.equal('Volatile2');
    expect(bonuses1[2].name).to.equal('Organic0');

    const bonuses2 = asteroid.getBonuses(allBonuses, asteroid.SPECTRAL_IDS.C_TYPE);
    expect(bonuses2.length).to.equal(3);
    expect(bonuses2[0].name).to.equal('Yield1');
    expect(bonuses2[1].name).to.equal('Volatile1');
    expect(bonuses2[2].name).to.equal('Organic1');

    // M-Type has Metal, Fissile
    const bonuses3 = asteroid.getBonuses(allBonuses, asteroid.SPECTRAL_IDS.M_TYPE);
    expect(bonuses3.length).to.equal(3);
    expect(bonuses3[0].name).to.equal('Yield1');
    expect(bonuses3[1].name).to.equal('Metal1');
    expect(bonuses3[2].name).to.equal('Fissile3');
  });

  it('should return bonus for resource and a set of bonuses', function () {
    let packed = parseInt('101001', 2);
    let bonuses = asteroid.getBonuses(packed, asteroid.SPECTRAL_IDS.C_TYPE);

    let bonus = asteroid.getBonusByResource(bonuses, product.IDS.WATER);
    expect(bonus.totalBonus).to.equal(1.38);
    bonus = asteroid.getBonusByResource(bonuses, product.IDS.APATITE);
    expect(bonus.totalBonus).to.equal(1.15);

    packed = parseInt('1', 2);
    bonuses = asteroid.getBonuses(packed, asteroid.SPECTRAL_IDS.C_TYPE);
    bonus = asteroid.getBonusByResource(bonuses, product.IDS.WATER);
    expect(bonus.totalBonus).to.equal(1);
  });

  it('should get rarity from bonuses', function () {
    let rarity = asteroid.getRarity([]);
    expect(rarity).to.equal('Common');

    rarity = asteroid.getRarity([
      asteroid.getBonus(asteroid.BONUS_IDS.YIELD_1)
    ]);
    expect(rarity).to.equal('Uncommon');

    rarity = asteroid.getRarity([
      asteroid.getBonus(asteroid.BONUS_IDS.YIELD_3),
    ]);
    expect(rarity).to.equal('Superior');

    rarity = asteroid.getRarity([
      asteroid.getBonus(asteroid.BONUS_IDS.YIELD_3),
      asteroid.getBonus(asteroid.BONUS_IDS.ORGANIC_1)
    ]);
    expect(rarity).to.equal('Exceptional');

    rarity = asteroid.getRarity([
      asteroid.getBonus(asteroid.BONUS_IDS.YIELD_3),
      asteroid.getBonus(asteroid.BONUS_IDS.VOLATILE_3),
      asteroid.getBonus(asteroid.BONUS_IDS.METAL_3),
      asteroid.getBonus(asteroid.BONUS_IDS.ORGANIC_3),
    ]);
    expect(rarity).to.equal('Incomparable');
  });

  it('should get mass from spectral type and radius', function () {
    expect(asteroid.getMass(asteroid.SPECTRAL_IDS.C_TYPE, asteroid.MAX_RADIUS)).to.equal(309601968481880060);
    expect(asteroid.getMass(asteroid.SPECTRAL_IDS.M_TYPE, asteroid.MAX_RADIUS)).to.equal(1172064594967117300);
    expect(asteroid.getMass(asteroid.SPECTRAL_IDS.S_TYPE, 12)).to.equal(19543219579451.383);
    expect(asteroid.getMass(asteroid.SPECTRAL_IDS.CMS_TYPE, 12)).to.equal(22679785684795.434);
  });

  it('should get size from radius', function () {
    let size = asteroid.getSize(1.023);
    expect(size).to.equal('Small');

    size = asteroid.getSize(40);
    expect(size).to.equal('Large');
  });

  it('should get spectral type names', function () {
    let typeName = asteroid.getSpectralType(asteroid.SPECTRAL_IDS.C_TYPE);
    expect(typeName).to.equal('C');
    typeName = asteroid.getSpectralType(asteroid.SPECTRAL_IDS.SM_TYPE);
    expect(typeName).to.equal('Sm');
  });

  it('should gracefully fail to get invalid spectral type name', function () {
    let typeName = asteroid.getSpectralType(0);
    expect(typeName).to.equal('');
    typeName = asteroid.getSpectralType(100);
    expect(typeName).to.equal('');
  });

  it('should get abundance at a specific lot', function () {
    const asteroidSeed = 3590329621830653642883442320016035471801660656180234502900732533901525272177n;
    const abundance = asteroid.getAbundanceAtLot(1000, asteroidSeed, 2096, 10, 0.212)
    expect(Number(abundance.toFixed(5))).to.equal(0.106);
  });

  it('should get abundances at a unit sphere position', function () {
    const point = asteroid.getLotPosition(100, 1);
    const abundance = asteroid.getAbundanceAtPosition(point, {
      abundance: 1, octaves: 6, polyParams: SIMPLEX_POLY_FIT[6], pointScale: 1, pointShift: [ -0.005, 11.578, -2.87 ]
    });

    expect(Number(abundance.toFixed(5))).to.equal(0.59825)
  });

  it('should calculate abundance map params', function () {
    let settings = asteroid.getAbundanceMapSettings(1, 42, 1, 0.25);
    expect(settings.octaves).to.equal(8);
    settings = asteroid.getAbundanceMapSettings(104, 42, 1, 0.25);
    expect(settings.octaves).to.equal(5);
    settings = asteroid.getAbundanceMapSettings(250000, 42, 1, 0.25);
    expect(settings.octaves).to.equal(3);
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

  it('should get the lot position', function () {
    let position = asteroid.getLotPosition(1, 1);
    expect(position).to.eql([ 0, 1, 0 ]);
    position = asteroid.getLotPosition(250000, 13);
    expect(position).to.eql([ -0, -1, -0 ]);
  });

  it('should not get an lot position', function () {
    let position;
    try {
      position = asteroid.getLotPosition(250000, -1);
      expect(true).to.be.false;
    } catch (error) {
      expect(error.message).to.deep.contain('Invalid lot id');
    }

    try {
      position = asteroid.getLotPosition(250000, 100);
      expect(true).to.be.false;
    } catch (error) {
      expect(error.message).to.deep.contain('Invalid lot id');
    }
  });

  it('should get lot region tally', function () {
    let tally = asteroid.getLotRegionTally(12);
    expect(tally).to.equal(100);
    tally = asteroid.getLotRegionTally(12345);
    expect(tally).to.equal(124);
    tally = asteroid.getLotRegionTally(1234567);
    expect(tally).to.equal(asteroid.MAX_LOT_REGIONS);
  });

  it('should get lot regions for a list of unit sphere positions', function () {
    let asteroidId = 1;
    let lotTally = asteroid.getSurfaceArea(asteroidId);
    let regionTally = asteroid.getLotRegionTally(lotTally);
    let regions = asteroid.getRegionsOfLotPositions(
      [
        ...asteroid.getLotPosition(0, 1, lotTally),
        ...asteroid.getLotPosition(0, 101, lotTally),
        ...asteroid.getLotPosition(0, 25235, lotTally),
        ...asteroid.getLotPosition(0, 122222, lotTally),
        ...asteroid.getLotPosition(0, lotTally, lotTally),
      ],
      regionTally
    );
    expect(Array.from(regions)).to.deep.equal([ 1, 1, 60, 363, 5000 ]);

    lotTally = asteroid.getSurfaceArea(404); // 5909
    regionTally = asteroid.getLotRegionTally(lotTally);
    regions = asteroid.getRegionsOfLotPositions(
      [
        ...asteroid.getLotPosition(0, 1, lotTally),
        ...asteroid.getLotPosition(0, 101, lotTally),
        ...asteroid.getLotPosition(0, 423, lotTally),
        ...asteroid.getLotPosition(0, 5432, lotTally),
        ...asteroid.getLotPosition(0, lotTally, lotTally),
      ],
      regionTally
    );
    expect(Array.from(regions)).to.deep.equal([ 1, 4, 12, 86, 100 ]);
  });

  describe('getClosestLots', function () {
    it('should get lots closest to a unit sphere position', function () {
      let lots = asteroid.getClosestLots({ center: [0.5, 0.5, 0.5], lotTally: 1000, findTally: 5 });
      expect(lots).to.deep.equal([ 216, 182, 237, 250, 195 ]);
      lots = asteroid.getClosestLots({ center: [-0.25, 0.6, 0.03], lotTally: 1000, findTally: 5 });
      expect(lots).to.deep.equal([ 128, 141, 162, 175, 196 ]);
      lots = asteroid.getClosestLots({ center: [0, 1, 0], lotTally: 13, findTally: 5 });
      expect(lots).to.deep.equal([ 1, 2, 3, 4, 5 ]);
    });

    it('should get lots closest to a lot id', function () {
      let lots = asteroid.getClosestLots({ centerLot: 1, lotTally: 1000, findTally: 5 });
      expect(lots).to.deep.equal([ 2, 3, 4, 5, 6 ]);
      expect(lots).not.to.deep.include(1);  // should not include center lot
      lots = asteroid.getClosestLots({ centerLot: 824, lotTally: 1000, findTally: 5 });
      expect(lots).to.deep.equal([ 790, 858, 845, 803, 769 ]);
      lots = asteroid.getClosestLots({ centerLot: 13, lotTally: 13, findTally: 5 });
      expect(lots).to.deep.equal([ 12, 11, 10, 9, 8 ]);
    });

    it('should return expected number of lots', function () {
      let lots = asteroid.getClosestLots({ center: [0.5, 0.5, 0.5], lotTally: 100, findTally: 10 });
      expect(lots.length).to.equal(10);

      lots = asteroid.getClosestLots({ center: [0.5, 0.5, 0.5], lotTally: 100 });
      expect(lots.length).to.equal(100);

      lots = asteroid.getClosestLots({ centerLot: 1, lotTally: 100 });
      expect(lots.length).to.equal(99);

      lots = asteroid.getClosestLots({ center: [0.5, 0.5, 0.5], lotTally: 500 });
      expect(lots.length).to.equal(500);
    });
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

  it('should unpack binary asteroid details data', async function () {
    const url = 'https://d1c1daundk1ax0.cloudfront.net/influence/goerli/data/asteroids.bin';
    const { data: buffer } = await axios({ url, method: 'GET', responseType: 'arraybuffer' });
    const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
    const parsed = new Uint32Array(arrayBuffer);
    const unpacked = asteroid.getUnpackedAsteroidDetails(parsed);

    expect(unpacked[0]).to.deep.include({
      i: 1,
      r: 375.142,
      spectralType: 0,
      orbital: {
        a: 2.082,
        e: 0.325,
        i: 0.002443460952792061,
        o: 3.4108969571725183,
        w: 5.283809777487633,
        m: 0.9480628496833199
      }
    });

    expect(unpacked[103]).to.deep.include({
      i: 104,
      r: 41.314723757085574,
      spectralType: 4,
      orbital: {
        a: 1.816,
        e: 0.147,
        i: 0.05969026041820607,
        o: 2.4717352866743694,
        w: 0.3218387140677544,
        m: 3.9975021187678124
      }
    });

    expect(unpacked[249999]).to.deep.include({
      i: 250000,
      r: 1.0237034933988756,
      spectralType: 2,
      orbital: {
        a: 3.716,
        e: 0.038,
        i: 0.2698279023583233,
        o: 2.2516492679978843,
        w: 1.5184364492350666,
        m: 0.30578168494940655
      }
    });
  });

  it('should get boost from purchase order', function () {
    let boost = asteroid.getBoostFromPurchaseOrder(null);
    expect(boost).to.equal(1);

    boost = asteroid.getBoostFromPurchaseOrder(50);
    expect(boost).to.equal(4);

    boost = asteroid.getBoostFromPurchaseOrder(500);
    expect(boost).to.equal(3);

    boost = asteroid.getBoostFromPurchaseOrder(5000);
    expect(boost).to.equal(2);

    boost = asteroid.getBoostFromPurchaseOrder(50000);
    expect(boost).to.equal(1);
  });
});
