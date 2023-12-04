import { expect } from 'chai';
import extractor from '../../src/lib/extractor.js';
import { checkIdsAndTypes } from '../testUtils.js';

describe('Extractor library', function () {
  checkIdsAndTypes(extractor.IDS, extractor.TYPES);

  it('should get the extraction time', async function () {
    // max possible
    let time = extractor.getExtractionTime(extractor.MAX_YIELD_PER_RUN, extractor.MAX_YIELD_PER_RUN);
    expect(time).to.equal(extractor.MAX_EXTRACTION_TIME);

    // unbonused
    time = extractor.getExtractionTime(2000e6, extractor.MAX_YIELD_PER_RUN);
    expect(time).to.equal(3329345);

    // bonused
    time = extractor.getExtractionTime(2000e6, extractor.MAX_YIELD_PER_RUN, 1.5);
    expect(time).to.equal(2219563);
  });
});