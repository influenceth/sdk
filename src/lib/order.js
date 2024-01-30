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

// Calculates the required deposit for a limit buy order
const requiredDeposit = (value, makerFee, makerBonus = 1, enforceBonus = 1) => {
  const makerFees = Math.floor(adjustedFee(makerFee, makerBonus, enforceBonus) * value / 10000);
  return value + makerFees;
};

// Calculates the required withdrawals to player and exchange for filling a limit buy order (market sell)
const requiredWithdrawals = (value, makerFee, takerFee, takerBonus = 1, enforceBonus = 1) => {
  const makerFees = Math.floor((value * makerFee) / 10000); // not adjusted as it is cached at order creation
  const takerFees = Math.floor(adjustedFee(takerFee, takerBonus, enforceBonus) * value / 10000);

  return {
    toExchange: makerFees + takerFees,
    toPlayer: value - takerFees
  }
};

// Calculates the required payments to player and exchange for filling a limit sell order (market buy)
const requiredPayments = (value, makerFee, takerFee, takerBonus = 1, enforceBonus = 1) => {
  const makerFees = Math.floor((value * makerFee) / 10000); // not adjusted as it is cached at order creation
  const takerFees = Math.floor(adjustedFee(takerFee, takerBonus, enforceBonus) * value / 10000);

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
  IDS,
  STATUSES,

  requiredDeposit,
  requiredWithdrawals,
  requiredPayments,
  adjustedFee,
  netEffFeeBonus
};
