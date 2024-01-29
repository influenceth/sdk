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

const calculatePayments = (orderType, value, makerFee, takerFee, takerBonus = 1, enforceBonus = 1) => {
  const makerFees = Math.floor((value * makerFee) / 10000);
  const scaledTakerFees = value * takerFee / 10000;
  const takerFees = Math.ceil(scaledTakerFees / netEffFeeBonus(takerBonus, enforceBonus));

  if (orderType === IDS.LIMIT_BUY) {
    return {
      toExchange: makerFees + takerFees,
      toPlayer: value - takerFees
    }
  } else {
    return {
      toExchange: makerFees + takerFees,
      toPlayer: value - makerFees
    };
  }
};

const netEffFeeBonus = (bonus, enforceBonus = 1) => {
  if (bonus > 1 && enforceBonus > 1) {
      return bonus - ((bonus - 1) * (enforceBonus - 1));
  } else {
      return bonus;
  }
}

const adjustedFee = (fee, bonus = 1, enforceBonus = 1) => {
  return Math.round(fee / netEffFeeBonus(bonus, enforceBonus));
}

export default {
  IDS,
  STATUSES,

  calculatePayments,
  netEffFeeBonus,
  adjustedFee
};
