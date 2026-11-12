import { expect } from 'chai';
import { readFileSync } from 'node:fs';
import { CallData, shortString, uint256 } from 'starknet';
import Prospecting from '../../src/lib/prospecting.js';
import System from '../../src/lib/system.js';
import Entity from '../../src/lib/entity.js';
import Lot from '../../src/lib/lot.js';
import components from '../../src/contracts/starknet_components.json' with { type: 'json' };
import events from '../../src/contracts/starknet_events.json' with { type: 'json' };
import types from '../../src/contracts/starknet_types.json' with { type: 'json' };
import dispatcherAbis from '../../src/contracts/starknet_abis.json' with { type: 'json' };

const Game = Prospecting.Game;
const dispatcher = '0x2';
const crew = { label: Entity.IDS.CREW, id: 9 };
const origin = { label: Entity.IDS.LOT, id: Lot.toId(250000, 1) };
const warehouse = { label: Entity.IDS.BUILDING, id: 3 };
const extractor = { label: Entity.IDS.BUILDING, id: 4 };
const deposit = { label: Entity.IDS.DEPOSIT, id: 100 };
const callOptions = { dispatcher, crew };
const encodeExpected = (name, input) => {
  const abi = Game.abis[name].map((entry) => entry.name === 'run'
    ? { ...entry, inputs: entry.inputs.slice(0, -1) }
    : entry);
  const data = new CallData(abi).compile('run', input);
  return { contractAddress: dispatcher, entrypoint: 'run_system',
    calldata: new CallData(dispatcherAbis.Dispatcher).compile('run_system', { name, calldata: data }) };
};
const u256 = value => Object.values(uint256.bnToUint256(value));
function mockClient (campaignData, cores = [], randomness = 1) {
  const calls = [];
  const provider = {
    getChainId: async () => '0x1',
    async callContract (call, block) {
      calls.push({ call, block });
      const name = shortString.decodeShortString(`0x${BigInt(call.calldata[0]).toString(16)}`);
      let data;
      if (name === 'ReadProspectingCampaign') data = campaignData;
      else if (name === 'ReadProspectingSample') data = cores[Number(call.calldata[3])];
      else if (name === 'ReadProspectingRandomness') data = [randomness];
      else if (name === 'ReadProspectingOrigin') data = [7];
      else if (name === 'PreviewProspectingSample') data = [123, 4];
      else throw new Error(`Unexpected read: ${name}`);
      return [data.length, ...data].map(String);
    }
  };
  return { client: Game.createClient({ dispatcher, provider }), calls };
}
const campaignData = ({ context = 10, lot = origin, count = 1, pending = true, status = 1, quality = 10000 } = {}) => [
  1, 9, 3, lot.label, lot.id, 1, ...u256(context), quality, 5, count, Number(pending), status, 86400, 0, 0
];

describe('Prospecting gameplay bindings', function () {
  this.timeout(30000);
  it('publishes real gameplay schemas alongside the historical sandbox adapter', function () {
    expect(Object.keys(Game.manifest.contracts)).to.have.length(25);
    expect(Game.manifest.deployment).to.equal('undeployed');
    expect(Game.manifest.samplingQualityBps).to.equal(10000);
    for (const component of ['claim::Claim', 'prospecting_campaign::ProspectingCampaign',
      'prospecting_core::ProspectingCore', 'prospecting_origin::ProspectingOrigin', 'extractor_slots::ExtractorSlots']) {
      expect(components).to.have.property(`influence::components::${component}`);
      expect(types).to.have.property(`influence::components::${component}`);
    }
    for (const name of ['ProspectingCampaignStarted', 'ProspectingSampleCommitted',
      'ProspectingCampaignFinalized', 'ProspectingCampaignAbandoned', 'ResourceExtractionStartedV1', 'ResourceExtractionStarted']) {
      expect(events).to.have.property(name);
    }
    expect(Game.abis.ProspectingVerifier.some(entry => entry.type === 'interface')).to.equal(true);
    expect(Prospecting.Contracts.manifest.protocol).to.equal('fieldwork-sandbox-v1');
    expect(System.Systems.MissionObserver).to.equal(undefined);
  });
  it('encodes full lot entities, 64-bit IDs, the expected index and both commitment limbs', function () {
    const id = (1n << 64n) - 1n;
    const commitment = (1n << 200n) + 123n;
    expect(Game.getStartCall({ ...callOptions, origin, resource: 1 })).to.deep.equal(encodeExpected('ProspectingStart', {
      origin, resource: 1, caller_crew: crew
    }));
    expect(Game.getSampleCall({ ...callOptions, campaignId: id, lot: origin, index: 2, commitment,
      inventoryOrigin: warehouse, originSlot: 2 })).to.deep.equal(encodeExpected('ProspectingSample', {
      campaign_id: id, lot: origin, expected_index: 2, commitment, origin: warehouse, origin_slot: 2, caller_crew: crew
    }));
    expect(() => Game.getSampleCall({ ...callOptions, campaignId: 7, lot: origin,
      commitment, inventoryOrigin: warehouse, originSlot: 2 })).to.throw();
    expect(() => Game.getStartCall({ ...callOptions, origin: { label: 4, id: 1 }, resource: 1 })).to.throw();
  });
  it('encodes one verifier span and basis points rather than the sandbox percentage', function () {
    const options = { ...callOptions, campaignId: 7, lot: origin, quantity: 1000000, rateBps: 12000, proofCalldata: ['11', '22', '33'] };
    const call = Game.getFinalizeCall(options);
    expect(call).to.deep.equal(encodeExpected('ProspectingFinalize', {
      campaign_id: 7, lot: origin, quantity: 1000000, rate_bps: 12000, proof: ['11', '22', '33'], caller_crew: crew
    }));
    expect(call.calldata.slice(2)).to.deep.equal(['7', '4', String(origin.id), '1000000', '12000', '3', '11', '22', '33', '1', '9']);
    expect(() => Game.getFinalizeCall({ ...options, rateBps: 120 })).to.throw();
    expect(() => Game.getFinalizeCall({ ...options, rateBps: 12001 })).to.throw();
    expect(Game.getAbandonCall({ ...callOptions, campaignId: 7 })).to.deep.equal(encodeExpected('ProspectingAbandon', {
      campaign_id: 7, caller_crew: crew
    }));
  });
  it('uses existing job signatures for claims, baseline and collection', function () {
    const options = { ...callOptions, quantity: 1000, extractor, extractorSlot: 1, destination: warehouse, destinationSlot: 2 };
    const common = { yield: 1000, extractor, extractor_slot: 1, destination: warehouse, destination_slot: 2, caller_crew: crew };
    expect(Game.getBaselineExtractionCall({ ...options, resource: 1 })).to.deep.equal(encodeExpected('BaselineExtractResourceStart', {
      resource: 1, ...common
    }));
    expect(Game.getClaimExtractionCall({ ...options, deposit })).to.deep.equal(encodeExpected('ExtractResourceStart', { deposit, ...common }));
    expect(Game.getExtractionFinishCall(options)).to.deep.equal(encodeExpected('ExtractResourceFinish', {
      extractor, extractor_slot: 1, caller_crew: crew
    }));
    expect(() => Game.getBaselineExtractionCall({ ...options, resource: 1, quantity: 10000001 })).to.throw();
  });
  it('decodes Dispatcher span framing, structured campaigns and fixed block reads', async function () {
    const { client, calls } = mockClient(campaignData(), [[...u256(123), 456, 0, 0, 100, 200]]);
    const options = { blockIdentifier: '0x77' };
    const c = await client.campaign(7, options);
    expect(c).to.include({ id: '7', context: '10', origin: 1, asteroidId: 250000, owner: '0x3', count: 1,
      pending: true, sampleCount: 2, qualityBps: 10000, chainStatus: 1, status: 'SAMPLE_PENDING' });
    expect(await client.core(7, 0, options)).to.deep.equal({ commitment: '123', meta: '456', blockedApproaches: '0', random: '0', target: '100', ready: 200 });
    expect(await client.origin(origin, options)).to.equal('7');
    expect(await client.previewSample(7, origin, options)).to.deep.equal({ meta: '123', blockedApproaches: '4' });
    expect(calls.every(({ block }) => block === '0x77')).to.equal(true);
    expect(() => Game.createClient({ dispatcher })).to.throw();
  });
  it('keeps cancelled, replaced and finalized game campaigns closed during readiness checks', function () {
    for (const status of [2, 3, 4]) {
      const campaign = Game.normalizeCampaign(7, new CallData(Game.abis.ReadProspectingCampaign).parse('run', campaignData({ status }).map(String)));
      const result = Prospecting.getCampaignReadiness({ campaign, now: 999999, blockNumber: 999999 });
      expect(result.status).to.equal(['', '', 'CANCELLED', 'REPLACED', 'FINALIZED'][status]);
      expect(result.sampleCount).to.equal(2);
    }
  });
  it('reconciles a real proof transcript with normalized game records before finalization', async function () {
    const fixtures = JSON.parse(readFileSync(new URL('../fixtures/prospecting/campaigns.json', import.meta.url)));
    const fixture = fixtures[4];
    const input = fixture.input;
    let record = Prospecting.createRecord({ mode: 'chain', campaignId: 7, context: input.context,
      identity: { chainId: '0x1', game: dispatcher, owner: '0x3', asteroidId: 1, originIndex: Number(input.origin), resource: 1 } });
    record = { ...record, claimIndex: Number(input.selected), actions: input.methods.map((method, i) => ({
      action: { method: Number(method), target: Number(input.targets[i]), source: Number(input.sources[i]), depth: Number(input.depths[i]), salt: input.salts[i] },
      meta: input.meta[i], mask: input.blockedApproaches[i], commitment: input.commitments[i], randomness: input.randomness[i]
    })) };
    const cores = record.actions.map((action, i) => [...u256(action.commitment), action.meta, action.mask, i === 4 ? 0 : action.randomness, 100 + i, 200 + i]);
    const lot = { label: 4, id: Lot.toId(1, Number(input.origin)) };
    const { client } = mockClient(campaignData({ lot, context: input.context, count: 4 }), cores, input.randomness[4]);
    const call = await Game.prepareFinalizeCall({ client, record, proof: fixture.proof, publicSignals: fixture.publicSignals, blockIdentifier: '0x77' });
    const result = Prospecting.replayCampaign(record).finalized;
    expect(call.calldata.slice(2, 7)).to.deep.equal(['7', '4', String(Lot.toId(1, result.lot)), String(result.quantity), String(result.rateBps)]);
    expect(call.calldata[7]).to.equal('1935');
    expect(call.calldata).to.have.length(1945);
    for (const identity of [{ ...record.identity, game: '0x99' }, { ...record.identity, chainId: '0x99' }, { ...record.identity, asteroidId: 2 }]) {
      let error;
      try { await Game.prepareFinalizeCall({ client, record: { ...record, identity }, proof: fixture.proof, publicSignals: fixture.publicSignals }); } catch (e) { error = e; }
      expect(error?.message).to.include('another game, chain or rules context');
    }
  });
});
