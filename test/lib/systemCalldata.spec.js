import { expect } from 'chai';
import System from '../../src/lib/system.js';

describe('System calldata compatibility', function () {
  const highLimbAmount = (1n << 128n) + 7n;

  for (const format of ['bigint', 'decimal', 'hex']) {
    it(`should encode approval uint256 limbs from ${format}`, function () {
      const amount = format === 'bigint'
        ? highLimbAmount
        : format === 'decimal' ? highLimbAmount.toString() : `0x${highLimbAmount.toString(16)}`;
      expect(System.getApproveErc20Call(amount, '0x123', '0x456')).to.deep.equal({
        contractAddress: '0x123',
        entrypoint: 'approve',
        calldata: ['1110', '7', '1']
      });
    });
  }

  it('should encode the maximum uint256 approval', function () {
    const limb = '340282366920938463463374607431768211455';
    expect(System.getApproveErc20Call((1n << 256n) - 1n, '0x123', '0x456').calldata)
      .to.deep.equal(['1110', limb, limb]);
  });

  it('should encode zero approval', function () {
    expect(System.getApproveErc20Call(0n, '0x123', '0x456').calldata)
      .to.deep.equal(['1110', '0', '0']);
  });

  it('should preserve short strings and nested span lengths in dispatcher calls', function () {
    expect(System.getRunSystemCall('ReadComponent', { name: 'Crew', path: [1n, 2n] }, '0x123'))
      .to.deep.equal({
        contractAddress: '0x123',
        entrypoint: 'run_system',
        calldata: ['6528085051446743490879381925492', '4', '1131570551', '2', '1', '2']
      });
  });

  it('should encode empty system spans', function () {
    expect(System.getRunSystemCall('ReadComponent', { name: 'Crew', path: [] }, '0x123').calldata)
      .to.deep.equal(['6528085051446743490879381925492', '2', '1131570551', '0']);
  });

  it('should encode escrow hooks in withdrawal then deposit order', function () {
    const depositHook = { contractAddress: '0xabc', entrypoint: '0xdef', calldata: [1n, 2n] };
    expect(System.getEscrowDepositCall(highLimbAmount, depositHook, null, '0x123', '0x456'))
      .to.deep.equal({
        contractAddress: '0x123',
        entrypoint: 'deposit',
        calldata: ['1110', '7', '1', '0', '0', '0', '2748', '3567', '2', '1', '2']
      });
  });

  it('should encode withdrawal structs and explicit span lengths without extra prefixes', function () {
    const withdrawals = [
      { recipient: '0xabc', amount: highLimbAmount },
      { recipient: '0xdef', amount: 3n }
    ];
    expect(System.getEscrowWithdrawCall(withdrawals, '0x11', null, [5n, 6n], '0x123', '0x456'))
      .to.deep.equal({
        contractAddress: '0x123',
        entrypoint: 'withdraw',
        calldata: ['17', '1110', '0', '0', '0', '2', '5', '6', '2', '2748', '7', '1', '3567', '3', '0']
      });
  });

  it('should encode booleans, short strings and arrays', function () {
    expect(System.getFormattedCall('0x123', 'example', [true, false, 'Crew', [1n, 2n], []]).calldata)
      .to.deep.equal(['1', '0', '1131570551', '2', '1', '2', '0']);
  });

  it('should preserve an already hashed transfer memo', function () {
    expect(System.getTransferWithConfirmationCall('0x12', 7n, '0x123', '0x34', '0x56'))
      .to.deep.equal({
        contractAddress: '0x56',
        entrypoint: 'transfer_with_confirmation',
        calldata: ['18', '7', '291', '52']
      });
  });
});
