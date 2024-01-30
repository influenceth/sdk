import { expect } from 'chai';
import order from '../../src/lib/order.js';

describe('Order library', function () {
  it('should get the correct withdrawals for filling a limit buy', function () {
    let withdrawals = order.requiredWithdrawals(1000000 * 1000, 67, 200, 1, 1);
    expect(withdrawals.toExchange).to.equal(26700000);
    expect(withdrawals.toPlayer).to.equal(980000000);

    withdrawals = order.requiredWithdrawals(1000000 * 1000, 100, 200, 1.5, 1);
    expect(withdrawals.toExchange).to.equal(23300000);
    expect(withdrawals.toPlayer).to.equal(986700000);

    withdrawals = order.requiredWithdrawals(10000000 * 500, 667, 0, 1, 1);
    expect(withdrawals.toExchange).to.equal(333500000);
    expect(withdrawals.toPlayer).to.equal(5000000000);
  });

  it('should get the correct payments for filling a limit sell', function () {
    let payments = order.requiredPayments(1000000 * 1000, 67, 200, 1, 1);
    expect(payments.toExchange).to.equal(26700000);
    expect(payments.toPlayer).to.equal(993300000);
  });

  it('should fill an order with multiple partial fills', function () {
    const total = order.requiredDeposit(1000 * 1234, 100, 1, 1);

    const orders = [
      order.requiredWithdrawals(333 * 1234, 100, 200, 1.2, 1.3),
      order.requiredWithdrawals(333 * 1234, 100, 200, 1.5, 0.75),
      order.requiredWithdrawals(334 * 1234, 100, 200, 0.8, 1.1)
    ];

    const orderTotals = orders.reduce((acc, order) => acc += (order.toPlayer + order.toExchange), 0);

    expect(total >= orderTotals).to.be.true;
    expect(total - orderTotals).to.be.lessThan(orders.length); // less than # of orders
  });

  it('should generate the correct net eff and adjuste fee', function () {
    expect(order.netEffFeeBonus(1.5, 1.8)).to.equal(1.1);
    expect(order.netEffFeeBonus(1.5, 1)).to.equal(1.5);
    expect(order.netEffFeeBonus(0.5, 1.8)).to.equal(0.5);

    expect(order.adjustedFee(200, 1, 1)).to.equal(200);
    expect(order.adjustedFee(200, 1, 1.5)).to.equal(200);
    expect(order.adjustedFee(200, 1.5, 1)).to.equal(133);
    expect(order.adjustedFee(200, 1, 0.5)).to.equal(200);
    expect(order.adjustedFee(200, 0.5, 1)).to.equal(400);
  });
});
