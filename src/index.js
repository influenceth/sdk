import Constants from './constants.js';

import Assets from './lib/assets.js';
import Asteroid from './lib/asteroid.js';
import Building from './lib/building.js';
import Crew from './lib/crew.js';
import Crewmate from './lib/crewmate.js';
import Delivery from './lib/delivery.js';
import Deposit from './lib/deposit.js';
import Dock from './lib/dock.js';
import DryDock from './lib/dryDock.js';
import Entity from './lib/entity.js';
import Exchange from './lib/exchange.js';
import Extractor from './lib/extractor.js';
import Inventory from './lib/inventory.js';
import Lot from './lib/lot.js';
import Name from './lib/name.js';
import Order from './lib/order.js';
import Permission from './lib/permission.js';
import * as Planet from './lib/planet.js';
import Process from './lib/process.js';
import Processor from './lib/processor.js';
import Product from './lib/product.js';
import RandomEvent from './lib/randomEvent.js';
import Ship from './lib/ship.js';
import Station from './lib/station.js';
import System from './lib/system.js';

import AdalianOrbit from './utils/AdalianOrbit.js';
import Address from './utils/address.js';
import Encryption from './utils/encryption.js';
import Fixed from './utils/fixed.js';
import Merkle from './utils/MerkleTree.js';
import ProductionJSON from './utils/ProductionJSON.js';
import Simplex from './utils/simplex.js';
import Time from './utils/Time.js';

import ethereumAddresses from './contracts/ethereum_addresses.json' assert { type: 'json' };
import ethereumContracts from './contracts/ethereum_abis.json' assert { type: 'json' };
import starknetAddresses from './contracts/starknet_addresses.json' assert { type: 'json' };
import starknetContracts from './contracts/starknet_abis.json' assert { type: 'json' };

(async function() {
  const isNode = typeof process !== 'undefined' && !!process?.versions?.node;
  if (isNode && !globalThis.crypto) {
    const { webcrypto } = await import('crypto');
    if (webcrypto) {
      globalThis.crypto = webcrypto;
    }
  }
})();

// Utility libs
export {
  AdalianOrbit,
  Address,
  Encryption,
  Fixed,
  Merkle,
  ProductionJSON,
  Simplex,
  Time
};

// Game asset libs
export {
  Assets,
  Asteroid,
  Building,
  Crew,
  Crewmate,
  Delivery,
  Entity,
  Deposit,
  Dock,
  DryDock,
  Exchange,
  Extractor,
  Inventory,
  Lot,
  Name,
  Order,
  Permission,
  Planet,
  Process,
  Processor,
  Product,
  RandomEvent,
  Ship,
  Station,
  System
};

// Contract ABIs
export { ethereumAddresses, ethereumContracts, starknetAddresses, starknetContracts };

export const ADALIA_MASS = Constants.ADALIA_MASS;
export const GM_ADALIA = Constants.GM_ADALIA;
export const SIMPLEX_POLY_FIT = Constants.SIMPLEX_POLY_FIT;
