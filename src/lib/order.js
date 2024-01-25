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

const calculatePayments = (price, count, makerFee, takerFee, takerBonus = 1, enforceBonus = 1) => {
  const value = price * count;
  const makerFees = Math.floor((value * makerFee) / 10000);
  const scaledTakerFees = value * takerFee / 10000;
  const takerFees = Math.ceil(scaledTakerFees / netEffFeeBonus(takerBonus, enforceBonus));

  return {
    toExchange: makerFees + takerFees,
    toPlayer: value - takerFees
  };
};

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

  calculatePayments,
  netEffFeeBonus
};
