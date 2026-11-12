import * as Config from './prospecting/config.js';
import PermissionIds from './permissionIds.js';
import Product from './product.js';
import * as Model from './prospecting/model.js';
import * as Lifecycle from './prospecting/lifecycle.js';
import * as Transactions from './prospecting/transactions.js';
import * as Geography from './prospecting/geography.js';
import Contracts from './prospecting/bindings.js';
import Game from './prospecting/game.js';
import Proof from './prospecting/proof.js';
import * as Kernel from './prospecting/kernel.js';

for (const table of [Kernel.HEADINGS, Kernel.WIDTHS, Kernel.BONUSES, Kernel.CUTS.width, Kernel.CUTS.hardness]) {
  table.forEach(Object.freeze);
  Object.freeze(table);
}
Object.freeze(Kernel.CUTS);
Object.freeze(Kernel.ACCIDENTS);
const getMeasurementOutcomes = (cell, method) => {
  if (!cell?.[3] || ![Config.METHODS.CROSS_CUT, Config.METHODS.CHARACTERIZE].includes(method)) throw new Error('Select a productive section and measurement method');
  const cuts = method === Config.METHODS.CROSS_CUT ? Kernel.CUTS.width[cell[4]] : Kernel.CUTS.hardness[cell[4]];
  const values = method === Config.METHODS.CROSS_CUT ? Kernel.WIDTHS[cell[4]] : Kernel.BONUSES[cell[4]].map((bonus) => 90 + bonus);
  return values.map((value, i) => ({ value, chancePercent: i === 0 ? cuts[0] : i === 1 ? cuts[1] - cuts[0] : 100 - cuts[1] }));
};
const getFollowOreChance = ({ source = Kernel.zero(), meta, depth }) => {
  Model.unpackMeta(Model.packMeta(meta));
  if (!Number.isInteger(depth) || depth < 0 || depth > 4) throw new RangeError('Invalid target depth');
  const normalPercent = 100 - Kernel.ACCIDENTS.stuck - (source[0] && source[3] ? Kernel.ACCIDENTS.collapse : 0);
  return Kernel.followChance(source, meta, depth) * normalPercent / 100000000;
};
const LEGACY_START_SYSTEMS = Object.freeze(['SampleDepositStart', 'SampleDepositImprove', 'PurchaseDepositAndImprove']);
export default {
  ...Config,
  ORIGIN_PERMISSION: PermissionIds.USE_LOT,
  SAMPLE_COST: Object.freeze({ product: Product.IDS.CORE_DRILL, amount: 1 }),
  ...Model,
  ...Lifecycle,
  ...Transactions,
  ...Geography,
  Contracts,
  Game,
  Proof,
  LEGACY_START_SYSTEMS,
  ACCIDENTS: Kernel.ACCIDENTS,
  WIDTHS: Kernel.WIDTHS,
  BONUSES: Kernel.BONUSES,
  CUTS: Kernel.CUTS,
  getMeasurementOutcomes,
  getFollowOreChance
};
