const IDS = {
  LIMIT_BUY: 1,
  LIMIT_SELL: 2
};

const STATUSES = {
  UNINITIALIZED: 0,
  OPEN: 1,
  FILLED: 2,
  CANCELLED: 3
};

const FEE_SCALE = 10000;

// Calculates the required deposit for a limit buy order
const getBuyOrderDeposit = (value, makerFee, makerBonus = 1, enforceBonus = 1) => {
  const makerFees = Math.floor(adjustedFee(makerFee, makerBonus, enforceBonus) * value / FEE_SCALE);
  return value + makerFees;
};

/**
 * Calculates the required withdrawals to player and exchange for filling a limit buy order (market sell)
 * @param {*} value is amount * unit price for the fillAmount, in microSway
 * @param {*} makerFee is unscaled makerFee (i.e. 67 for 0.67%)
 * @param {*} takerFee is unscaled takerFee (i.e. 67 for 0.67%)
 * @param {*} takerBonus is feeReductionBonus of crew placing fill order
 * @param {*} enforceBonus is feeEnforcementBonus of crew controlling exchange
 */
const getFillBuyOrderWithdrawals = (value, makerFee, takerFee, takerBonus = 1, enforceBonus = 1) => {
  const makerFees = Math.floor((value * makerFee) / FEE_SCALE); // not adjusted as it is cached at order creation
  const takerFees = Math.floor(adjustedFee(takerFee, takerBonus, enforceBonus) * value / FEE_SCALE);

  return {
    toExchange: makerFees + takerFees,
    toPlayer: value - takerFees
  }
};

/**
 * Calculates the required payments to player and exchange for filling a limit sell order (market buy)
 * @param {*} value is amount * unit price for the fillAmount, in microSway
 * @param {*} makerFee is unscaled makerFee (i.e. 67 for 0.67%)
 * @param {*} takerFee is unscaled takerFee (i.e. 67 for 0.67%)
 * @param {*} takerBonus is feeReductionBonus of crew placing fill order
 * @param {*} enforceBonus is feeEnforcementBonus of crew controlling exchange
 */
const getFillSellOrderPayments = (value, makerFee, takerFee, takerBonus = 1, enforceBonus = 1) => {
  const makerFees = Math.floor((value * makerFee) / FEE_SCALE); // not adjusted as it is cached at order creation
  const takerFees = Math.floor(adjustedFee(takerFee, takerBonus, enforceBonus) * value / FEE_SCALE);

  return {
    toExchange: makerFees + takerFees,
    toPlayer: value - makerFees
  };
};

// Adjusts a fee based on the player's and the exchange controller's fee bonuses
const adjustedFee = (fee, bonus = 1, enforceBonus = 1) => {
  return Math.round(fee / netEffFeeBonus(bonus, enforceBonus));
}

// Helper to calculate the effective bonus after applying the exchange controller's enforcement bonus
const netEffFeeBonus = (bonus, enforceBonus = 1) => {
  if (bonus > 1 && enforceBonus > 1) {
      return bonus - ((bonus - 1) * (enforceBonus - 1));
  } else {
      return bonus;
  }
}

export default {
  FEE_SCALE,
  IDS,
  STATUSES,

  getBuyOrderDeposit,
  getFillBuyOrderWithdrawals,
  getFillSellOrderPayments,
  adjustedFee,
  netEffFeeBonus
};
