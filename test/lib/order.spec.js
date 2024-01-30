import { expect } from 'chai';
import order from '../../src/lib/order.js';

describe('Order library', function () {
  it('should get the correct payments', function () {
    let payments = order.calculatePayments(order.IDS.LIMIT_BUY, 1000000 * 1000, 67, 200, 1, 1);
    expect(payments.toExchange).to.equal(26700000);
    expect(payments.toPlayer).to.equal(980000000);

    payments = order.calculatePayments(order.IDS.LIMIT_BUY, 1000000 * 1000, 100, 200, 1.5, 1);
    expect(payments.toExchange).to.equal(23333334);
    expect(payments.toPlayer).to.equal(986666666);

    payments = order.calculatePayments(order.IDS.LIMIT_SELL, 1000000 * 1000, 67, 200, 1, 1);
    expect(payments.toExchange).to.equal(26700000);
    expect(payments.toPlayer).to.equal(993300000);
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
