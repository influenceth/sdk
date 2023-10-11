import exchange from '../../src/lib/exchange.js';
import { checkIdsAndTypes } from '../testUtils.js';

describe('Exchange library', function () {
  checkIdsAndTypes(exchange.IDS, exchange.TYPES);
});