import { expect } from 'chai';
import Entity from '../../src/lib/entity.js';
import Lot from '../../src/lib/lot.js';
import Permission from '../../src/lib/permission.js';

describe('Permission library', function () {
  it('should get the prices for Adalia Prime lease', function () {
    const entity = {
      label: Entity.IDS.LOT,
      id: Lot.toId(1, 457078),
      PrepaidPolicies: [
        { rate: 1000 }
      ]
    };

    let rate = Permission.Entity.getPrepaidPolicyRate(entity);
    expect(rate).to.equal(500);

    entity.id = Lot.toId(1, 1096252);
    rate = Permission.Entity.getPrepaidPolicyRate(entity);
    expect(rate).to.equal(200);

    entity.id = Lot.toId(1, 1598602);
    rate = Permission.Entity.getPrepaidPolicyRate(entity);
    expect(rate).to.equal(1000);

    entity.id = Lot.toId(1, 1580548);
    rate = Permission.Entity.getPrepaidPolicyRate(entity);
    expect(rate).to.equal(500);

    entity.id = Lot.toId(1, 1547367);
    rate = Permission.Entity.getPrepaidPolicyRate(entity);
    expect(rate).to.equal(250);

    entity.id = Lot.toId(1, 1501732);
    rate = Permission.Entity.getPrepaidPolicyRate(entity);
    expect(rate).to.equal(100);

    entity.id = Lot.toId(1, 1470059);
    rate = Permission.Entity.getPrepaidPolicyRate(entity);
    expect(rate).to.equal(10);
  });

  it('should build prepaid agreement paths and memos', function () {
    const lot = { label: Entity.IDS.LOT, id: Lot.toId(1, 42) };
    const crew = { label: Entity.IDS.CREW, id: 123 };

    expect(Permission.getAgreementPath(lot, Permission.IDS.USE_LOT, crew)).to.deep.equal([
      Entity.packEntity(lot),
      Permission.IDS.USE_LOT,
      Entity.packEntity(crew)
    ]);

    expect(Permission.getUseLotPath(lot)).to.deep.equal([
      '0x5573654c6f74',
      Entity.packEntity(lot)
    ]);

    expect(Permission.getLotUsePath(lot)).to.deep.equal([
      '0x4c6f74557365',
      Entity.packEntity(lot)
    ]);

    expect(Permission.getAuctionControllerMemo(lot, Permission.IDS.USE_LOT, crew)).to.deep.equal([
      Entity.packEntity(lot),
      Permission.IDS.USE_LOT,
      Entity.packEntity(crew),
      '0x61756374696f6e5f636f6e74726f6c6c6572'
    ]);

    expect(Permission.getAuctionBuildingMemo(lot, Permission.IDS.USE_LOT, crew)).to.deep.equal([
      Entity.packEntity(lot),
      Permission.IDS.USE_LOT,
      Entity.packEntity(crew),
      '0x61756374696f6e5f6275696c64696e67'
    ]);
  });

  it('should calculate prepaid agreement auction prices', function () {
    expect(Permission.getAuctionSettings()).to.deep.equal({
      mode: Permission.AUCTION_MODES.MANUAL,
      gracePeriod: 0
    });
    expect(Permission.getAuctionSettings({ mode: Permission.AUCTION_MODES.AUTO, grace_period: 3600 })).to.deep.equal({
      mode: Permission.AUCTION_MODES.AUTO,
      gracePeriod: 3600
    });

    expect(Permission.getAuctionStep({ gracePeriod: 7200 }, 7199)).to.equal(0);
    expect(Permission.getAuctionStep({ gracePeriod: 7200 }, 7200)).to.equal(0);
    expect(Permission.getAuctionStep({ gracePeriod: 7200 }, 10800)).to.equal(1);
    expect(Permission.getAuctionStep({ gracePeriod: 0 }, Permission.AUCTION_DESCENDING_PERIOD)).to.equal(167);

    expect(Permission.getAuctionPriceAtStep(0)).to.equal(1000000000000000000n);
    expect(Permission.getAuctionPriceAtStep(1)).to.equal(847507816922201829n);
    expect(Permission.getAuctionPriceAtStep(167)).to.equal(1000000n);
    expect(Permission.getAuctionPriceAtStep(999)).to.equal(1000000n);
    expect(Permission.getAuctionPrice({ gracePeriod: 3600 }, 7200)).to.equal(847507816922201829n);
  });

  it('should calculate prepaid agreement payments', function () {
    expect(Permission.getPrepaidAgreementPaymentAmount(3600, 3600)).to.equal(3600n);
    expect(Permission.getPrepaidAgreementPaymentAmount(1, 1)).to.equal(1n);
    expect(Permission.getPrepaidAgreementPaymentAmount(1, 3601)).to.equal(2n);

    expect(Permission.getLeaseLapseAmount(3600, 7200)).to.equal(7200n);
    expect(Permission.getLeaseLapseAmount(3600, Permission.MAX_LEASE_LAPSE_SECONDS + 7200)).to.equal(
      BigInt(Permission.MAX_LEASE_LAPSE_SECONDS)
    );

    expect(Permission.getPrepaidAgreementExtensionPaymentAmount({ rate: 3600, endTime: 1000 }, 3600, 4600)).to.equal(
      7200n
    );
    expect(Permission.getPrepaidAgreementExtensionPaymentAmount({ rate: 3600, end_time: 10000 }, 3600, 4600)).to.equal(
      3600n
    );
  });

  it('should split auction payments according to lapse and controller availability', function () {
    expect(Permission.getAuctionPaymentSplit({
      auctionAmount: 1000n,
      leaseLapseAmount: 300n
    })).to.deep.equal({
      toController: 300n,
      toBuildingController: 700n
    });

    expect(Permission.getAuctionPaymentSplit({
      auctionAmount: 1000n,
      leaseLapseAmount: 300n,
      hasBuildingController: false
    })).to.deep.equal({
      toController: 1000n,
      toBuildingController: 0n
    });

    expect(Permission.getAuctionPaymentSplit({
      auctionAmount: 1000n,
      leaseLapseAmount: 1200n
    })).to.deep.equal({
      toController: 1000n,
      toBuildingController: 0n
    });
  });

  it('should summarize prepaid agreement status', function () {
    expect(Permission.getPrepaidAgreementStatus({
      agreement: { rate: 3600, endTime: 2000 },
      now: 1000
    })).to.include({
      isActive: true,
      isExpired: false,
      isAuctionActive: false,
      elapsed: 0,
      auctionElapsed: 0
    });

    const expiredStatus = Permission.getPrepaidAgreementStatus({
      agreement: { rate: 3600, end_time: 1000 },
      auction: { status: Permission.AUCTION_STATUSES.ACTIVE, start_time: 1500 },
      settings: { grace_period: 3600 },
      now: 5100
    });

    expect(expiredStatus).to.include({
      isActive: false,
      isExpired: true,
      isAuctionActive: true,
      elapsed: 4100,
      auctionElapsed: 3600,
      auctionStep: 0
    });
    expect(expiredStatus.auctionPrice).to.equal(1000000000000000000n);
    expect(expiredStatus.leaseLapseAmount).to.equal(4100n);
  });
});
