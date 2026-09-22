import { expect } from 'chai';
import StarterMission from '../../src/lib/starterMission.js';
import Building from '../../src/lib/building.js';
import Process from '../../src/lib/process.js';
import Processor from '../../src/lib/processor.js';
import Product from '../../src/lib/product.js';

describe('StarterMission library', function () {
  it('defines sequential missions and exact whole-SWAY and micro-SWAY rewards', function () {
    expect(Object.values(StarterMission.IDS)).to.deep.equal([0, 1, 2, 3, 4, 5, 6, 7]);
    const rewards = [5000, 20000, 30000, 20000, 50000, 35000, 40000, 25000];
    let cumulative = 0;
    for (const [key, id] of Object.entries(StarterMission.IDS)) {
      cumulative += rewards[id];
      expect(StarterMission.TYPES[id]).to.include({
        id,
        key,
        prerequisiteId: id === 0 ? null : id - 1,
        reward: rewards[id],
        cumulativeReward: cumulative
      });
      expect(StarterMission.getRewardAmount(id)).to.equal(BigInt(rewards[id]) * 1_000_000n);
    }
    expect(cumulative).to.equal(225000);
  });

  it('builds Crew assignments with an explicit deployment campaign, including mission zero', function () {
    expect(StarterMission.getAssignment({ campaign: '0x123', crewId: 42, missionId: 0 }))
      .to.deep.equal({ campaign: '0x123', subject: { label: 1, id: 42 }, mission: 0 });
    expect(() => StarterMission.getAssignment({ crewId: 42, missionId: 0 })).to.throw(TypeError);
    for (const missionId of [-1, 8, 0.5, '0', undefined]) {
      expect(() => StarterMission.getAssignment({ campaign: 1, crewId: 42, missionId })).to.throw(RangeError);
      expect(() => StarterMission.getRewardAmount(missionId)).to.throw(RangeError);
    }
  });

  it('keeps threshold units and building/processor namespaces explicit', function () {
    const types = StarterMission.TYPES;
    expect(types[1].requirements).to.include({ distinctDeposits: 3, minInitialYieldKg: 500000, requiresInitialSampling: true });
    expect(types[2].requirements).to.include({ minExtractionMassGrams: 100000000, rawProductIdMin: 1, rawProductIdMax: 22 });
    expect(types[3].requirements).to.include({ minStoredMassGrams: 100000000, inventorySlot: 2, requiresCampaignWarehouse: true, requiresQualifyingReceipt: true });
    for (const [id, buildingType, processorType] of [
      [4, Building.IDS.REFINERY, Processor.IDS.REFINERY],
      [5, Building.IDS.BIOREACTOR, Processor.IDS.BIOREACTOR],
      [6, Building.IDS.FACTORY, Processor.IDS.FACTORY]
    ]) {
      expect(types[id].requirements).to.deep.equal({
        buildingType,
        processorType,
        requiresCampaignConstruction: true,
        requiresOperational: true,
        requiresCrewControl: true,
        minRecipes: 1
      });
    }
    expect(types[7].requirements).to.include({ minRecipesPerStage: 1, requiresStage1FinishedBeforeStage2Start: true, requiresEconomicUse: true });
  });

  it('matches approved route indices and process/product relationships', function () {
    const expected = [[24, 24, 23], [29, 32, 38], [27, 27, 40], [35, 41, 56], [89, 91, 33]];
    expect(Object.values(StarterMission.ROUTE_IDS)).to.deep.equal([0, 1, 2, 3, 4]);
    for (const [key, id] of Object.entries(StarterMission.ROUTE_IDS)) {
      const route = StarterMission.ROUTE_TYPES[id];
      expect(route).to.include({ id, key });
      expect([route.stage1ProcessId, route.intermediateProductId, route.stage2ProcessId]).to.deep.equal(expected[id]);
      expect(Process.TYPES[route.stage1ProcessId].outputs[route.intermediateProductId]).to.be.greaterThan(0);
      expect(Process.TYPES[route.stage2ProcessId].inputs[route.intermediateProductId]).to.be.greaterThan(0);
    }
    expect(Process.TYPES[Process.IDS.SILICA_FUSING].processorType).to.equal(Processor.IDS.FACTORY);
  });

  it('includes secondary outputs and rejects unknown routes', function () {
    expect(StarterMission.getRouteOutputProductIds(0)).to.have.members([Product.IDS.HYDROGEN, Product.IDS.OXYGEN]);
    for (const routeId of [-1, 5, '0', undefined]) {
      expect(() => StarterMission.getRouteOutputProductIds(routeId)).to.throw(RangeError);
    }
  });

  describe('State decoding', function () {
    it('separates earned flags, sample count, and upstream route flags', function () {
      const word = 0x4781n; // Earned 0 and 7; three samples; upstream routes 0 and 4.
      for (const value of [word, '18305', '0x4781']) {
        expect(StarterMission.unpackProgress(value)).to.deep.equal({
          earned: [true, false, false, false, false, false, false, true],
          sampleCount: 3,
          upstreamRoutes: [true, false, false, false, true]
        });
      }
      expect(StarterMission.unpackProgress(0)).to.deep.equal({
        earned: Array(8).fill(false), sampleCount: 0, upstreamRoutes: Array(5).fill(false)
      });
      for (let count = 0; count <= 3; count++) {
        expect(StarterMission.unpackProgress(count * 256).sampleCount).to.equal(count);
      }
      expect(StarterMission.unpackProgress(1n << 127n).earned).to.deep.equal(Array(8).fill(false));
    });

    it('decodes final-product pages at 127/128 and 255/256 boundaries', function () {
      for (const [product, slot] of [[0, 100], [127, 100], [128, 101], [129, 101], [255, 101], [256, 102]]) {
        expect(StarterMission.getFinalProductSlot(product)).to.equal(BigInt(slot));
        expect(StarterMission.unpackFinalProducts(1n << BigInt(product % 128), slot)).to.deep.equal([BigInt(product)]);
      }
      expect(StarterMission.unpackFinalProducts('0x80000000000000000000000000000003', 101))
        .to.deep.equal([128n, 129n, 255n]);
      expect(StarterMission.unpackFinalProducts(0, 100)).to.deep.equal([]);
      const maximumProduct = (1n << 64n) - 1n;
      expect(StarterMission.unpackFinalProducts(1n << 127n, StarterMission.getFinalProductSlot(maximumProduct)))
        .to.deep.equal([maximumProduct]);
      expect(() => StarterMission.unpackFinalProducts(1, 99)).to.throw(RangeError);
      expect(() => StarterMission.unpackFinalProducts(1n << 128n, 100)).to.throw(RangeError);
      expect(() => StarterMission.getFinalProductSlot(-1)).to.throw(RangeError);
    });

    it('builds crew-global invalidation and participation paths', function () {
      expect(StarterMission.getInvalidPath(42)).to.deep.equal([0x53746172746572496e76616c6964n, 2752513n]);
      expect(StarterMission.getParticipatedPath(42)).to.deep.equal([0x53746172746572506172746963697061746564n, 2752513n]);
    });

    it('requires an active campaign, strictly newer manned crew, and no invalidation', function () {
      const state = { campaign: '0x123', cutoff: '100', crewId: 101, roster: [42], invalidated: 0 };
      expect(StarterMission.isEligible(state)).to.equal(true);
      for (const change of [
        { campaign: 0 }, { crewId: 100 }, { crewId: 99 }, { roster: [] },
        { invalidated: true }, { invalidated: '0x2' }, { invalidated: 1n }
      ]) expect(StarterMission.isEligible({ ...state, ...change })).to.equal(false);
      expect(StarterMission.isEligible({ ...state, invalidated: false })).to.equal(true);
      expect(StarterMission.isEligible({ ...state, cutoff: '9007199254740992', crewId: '9007199254740993' })).to.equal(true);
      for (const field of Object.keys(state)) {
        const incomplete = { ...state };
        delete incomplete[field];
        expect(() => StarterMission.isEligible(incomplete)).to.throw();
      }
    });
  });
});
