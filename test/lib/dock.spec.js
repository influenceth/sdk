import dock from '../../src/lib/dock.js';
import { checkIdsAndTypes } from '../testUtils.js';

describe('Dock library', function () {
  checkIdsAndTypes(dock.IDS, dock.TYPES);
});