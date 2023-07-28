import station from '../../src/lib/station.js';
import { checkIdsAndTypes } from '../testUtils.js';

describe('Station library', function () {
  checkIdsAndTypes(station.IDS, station.TYPES);
});