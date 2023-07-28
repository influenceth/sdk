import dryDock from '../../src/lib/dryDock.js';
import { checkIdsAndTypes } from '../testUtils.js';

describe('DryDock library', function () {
  checkIdsAndTypes(dryDock.IDS, dryDock.TYPES);
});