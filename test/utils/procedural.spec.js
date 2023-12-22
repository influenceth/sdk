import { expect } from 'chai';
import procedural from '../../src/utils/procedural.js';

describe('Procedural library', function () {
  it('should return the correct derived seed', function () {
    const result = procedural.derive(42, 13);
    expect(BigInt(result)).to.equal(1837115955738129657812122445577296609649291210085196769922948815975224765856n);
  });

  it('should return the correct int between values', function () {
    const low = 1;
    const high = 101;

    for (let i = 1; i <= 10; i++) {
      const entropy = Math.floor(2 ** 16 * Math.random());
      const seed = procedural.derive(42, entropy);
      const result = procedural.intBetween(seed, low, high);
      expect(Number(result)).to.be.greaterThanOrEqual(low);
      expect(Number(result)).to.be.lessThan(high);
    }
  });

  it('should return a real value between low and high', async () => {
    const low = 0;
    const high = 10;
    let seed = procedural.derive(432352089298734n, 701022376584n);

    for (let i = 100; i > 0; i--) {
      seed = procedural.derive(seed, i);
      const result = procedural.realBetween(seed, low, high);

      expect(Number(result)).to.be.greaterThanOrEqual(low);
      expect(Number(result)).to.be.lessThan(high);
    }
  });

  it('should return normally distributed int values', async () => {
    const low = 0;
    const high = 10;

    for (let i = 1; i <= 25; i++) {
      const entropy = Math.floor(2 ** 16 * Math.random());
      const seed = procedural.derive(42, entropy);
      const result = procedural.normalIntBetween(seed, low, high);
      expect(result).to.be.greaterThanOrEqual(low);
      expect(result).to.be.lessThan(high);
    }
  });

  it('should return normally distributed real values', async () => {
    const low = 0;
    const high = 10;

    for (let i = 1; i <= 25; i++) {
      const entropy = Math.floor(2 ** 16 * Math.random());
      const seed = procedural.derive(42, entropy);
      const result = procedural.normalRealBetween(seed, low, high);
      expect(result).to.be.greaterThanOrEqual(low);
      expect(result).to.be.lessThan(high);
    }
  });
});
