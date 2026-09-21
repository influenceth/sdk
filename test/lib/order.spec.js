import { expect } from 'chai';
import order from '../../src/lib/order.js';

describe('Order library', function () {
  describe('buy order cancellation refund', function () {
    it('rounds fractional fees up while leaving deposits rounded down', function () {
      expect(order.getBuyOrderCancellationRefund(3, 101, 67)).to.equal(306);
      expect(order.getBuyOrderDeposit(3 * 101, 67)).to.equal(305);
    });

    it('does not add a unit when the division is exact', function () {
      expect(order.getBuyOrderCancellationRefund(100, 100, 67)).to.equal(10067);
    });

    it('refunds the remaining value when fees are zero', function () {
      expect(order.getBuyOrderCancellationRefund(3, 101, 0)).to.equal(303);
    });

    it('uses only the unfilled amount and the stored maker fee', function () {
      const remainingAmount = 1000 - 333 - 333;
      expect(order.getBuyOrderCancellationRefund(remainingAmount, 1234, 67)).to.equal(414918);
    });

    it('returns zero when no amount remains', function () {
      expect(order.getBuyOrderCancellationRefund(0, 1234, 67)).to.equal(0);
    });

    it('preserves precision when the intermediate numerator exceeds the safe integer range', function () {
      expect(order.getBuyOrderCancellationRefund(1, 9000000000000001, 1)).to.equal(9000900000000002);
    });

    it('rejects refunds that cannot be represented as safe integers', function () {
      expect(() => order.getBuyOrderCancellationRefund(1, Number.MAX_SAFE_INTEGER, 1)).to.throw(RangeError);
    });
  });

  it('should get the correct withdrawals for filling a limit buy', function () {
    let withdrawals = order.getFillBuyOrderWithdrawals(1000000 * 1000, 67, 200, 1, 1);
    expect(withdrawals.toExchange).to.equal(26700000);
    expect(withdrawals.toPlayer).to.equal(980000000);

    withdrawals = order.getFillBuyOrderWithdrawals(1000000 * 1000, 100, 200, 1.5, 1);
    expect(withdrawals.toExchange).to.equal(23300000);
    expect(withdrawals.toPlayer).to.equal(986700000);

    withdrawals = order.getFillBuyOrderWithdrawals(10000000 * 500, 667, 0, 1, 1);
    expect(withdrawals.toExchange).to.equal(333500000);
    expect(withdrawals.toPlayer).to.equal(5000000000);
  });

  it('should get the correct payments for filling a limit sell', function () {
    let payments = order.getFillSellOrderPayments(1000000 * 1000, 67, 200, 1, 1);
    expect(payments.toExchange).to.equal(26700000);
    expect(payments.toPlayer).to.equal(993300000);
  });

  it('should fill an order with multiple partial fills', function () {
    const total = order.getBuyOrderDeposit(1000 * 1234, 100, 1, 1);

    const orders = [
      order.getFillBuyOrderWithdrawals(333 * 1234, 100, 200, 1.2, 1.3),
      order.getFillBuyOrderWithdrawals(333 * 1234, 100, 200, 1.5, 0.75),
      order.getFillBuyOrderWithdrawals(334 * 1234, 100, 200, 0.8, 1.1)
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
