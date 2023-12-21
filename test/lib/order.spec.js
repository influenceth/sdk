import { expect } from 'chai';
import order from '../../src/lib/order.js';

describe('Order library', function () {
  it.only('should get the correct payments', async function () {
    let payments = order.calculatePayments(1000000, 1000, 67, 200, 1, 1);
    expect(payments.toExchange).to.equal(26700000);
    expect(payments.toPlayer).to.equal(980000000);

    payments = order.calculatePayments(1000000, 1000, 100, 200, 1.5, 1);
    expect(payments.toExchange).to.equal(23333334);
    expect(payments.toPlayer).to.equal(986666666);
  });
});
