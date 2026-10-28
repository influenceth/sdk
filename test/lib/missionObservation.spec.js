import { expect } from 'chai';
import Observation from '../../src/lib/missionObservation.js';
import System from '../../src/lib/system.js';
import { encodeMissionTargets, observeMissionAction, escrowWithdrawalArguments } from '../fixtures/missionObservation/reference.js';

const normalizeCalls = (calls) => calls.map((call) => ({ ...call, calldata: call.calldata.map(BigInt) }));
const candidate = { campaign: '0x123', subject: { label: 1, id: 42 }, mission: 1 };
describe('Mission observation', function () {
  it('matches the contract reference grouping and coalesces duplicate assignments', function () {
    const candidates = [candidate, { ...candidate, mission: 7 }, candidate, { ...candidate, campaign: 292 }];
    expect(Observation.encodeMissionTargets(candidates)).to.deep.equal(encodeMissionTargets(candidates));
    expect(Observation.encodeMissionTargets(candidates)).to.have.length(4);
    // Nominating only one mission must not implicitly add any future completion checks.
    expect(BigInt(Observation.encodeMissionTargets([candidate])[1]) >> 80n).to.equal(2n);
  });
  it('enforces group limits after coalescing and validates exact integer inputs', function () {
    const candidates = Array.from({ length: 8 }, (_, i) => ({ ...candidate, campaign: i + 1 }));
    expect(Observation.encodeMissionTargets([...candidates, ...candidates])).to.have.length(16);
    expect(() => Observation.encodeMissionTargets([...candidates, { ...candidate, campaign: 9 }])).to.throw();
    for (const mission of [-1, 32, 0.5, '1']) expect(() => Observation.encodeMissionTargets([{ ...candidate, mission }])).to.throw();
    for (const id of [0, -1, Number.MAX_SAFE_INTEGER + 1, 1n << 64n]) {
      expect(() => Observation.encodeMissionTargets([{ ...candidate, subject: { label: 1, id } }])).to.throw();
    }
    expect(() => Observation.encodeMissionTargets([{ ...candidate, campaign: 1n << 252n }])).to.throw();
    expect(() => Observation.encodeMissionTargets([])).to.throw();
  });
  it('hashes the exact direct execution arguments and always finalizes', function () {
    const options = { dispatcher: '0x123', account: '0x456', system: 'ConstructionStart',
      input: { building: { label: 5, id: 42 }, caller_crew: { label: 1, id: 77 } }, candidates: [candidate] };
    const call = System.getRunSystemCall(options.system, options.input, options.dispatcher);
    const calls = Observation.getObservedSystemCalls(options);
    expect(normalizeCalls(calls)).to.deep.equal(normalizeCalls(observeMissionAction({ ...options, calldata: call.calldata.slice(2), executionCalls: [call] })));
    expect(calls[2].entrypoint).to.equal('end_observation');
  });
  it('preserves callback fields, u256 amounts and the immediate Escrow caller', function () {
    const input = { nativeArguments: [1, 2, 3], caller: '0x123', token: '0x456',
      withdrawals: [{ recipient: '0x789', amount: (1n << 200n) + 5n }] };
    const calldata = Observation.escrowWithdrawalArguments(input);
    expect(calldata.map(BigInt)).to.deep.equal(escrowWithdrawalArguments(input).map(BigInt));
    const options = { dispatcher: '0x123', account: '0x456', expectedCaller: '0x789', system: 'FillBuyOrder',
      calldata, candidates: [candidate], executionCalls: [{ contractAddress: '0x789', entrypoint: 'withdraw', calldata: [] }] };
    expect(normalizeCalls(Observation.observeMissionAction(options))).to.deep.equal(normalizeCalls(observeMissionAction(options)));
    expect(() => Observation.escrowWithdrawalArguments({ ...input, withdrawals: [{ recipient: 1, amount: 1n << 256n }] })).to.throw();
  });
});
