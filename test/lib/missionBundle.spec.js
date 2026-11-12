import { expect } from 'chai';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import Colony from '../../src/lib/colonizationMission.js';
import Observation from '../../src/lib/missionObservation.js';
import gameplay from '../../src/contracts/prospecting/gameplay.json' with { type: 'json' };

const bundle = JSON.parse(readFileSync(new URL('../fixtures/missionObservation/bundle.json', import.meta.url)));
const abis = JSON.parse(readFileSync(new URL('../../src/contracts/starknet_abis.json', import.meta.url)));

describe('Rebuilt mission bundle compatibility', function () {
  it('preserves unaffected ABIs and adopts the compiled prospecting observation policy', function () {
    for (const [name, digest] of Object.entries(bundle.unchangedAbisSha256)) {
      expect(createHash('sha256').update(JSON.stringify(abis[name])).digest('hex'), name).to.equal(digest);
    }
    for (const name of ['MissionObserver', 'StarterMissionCampaign']) {
      expect(abis[name]).to.deep.equal(gameplay[name]);
    }
  });
  it('matches the exported mission rewards, names and observation group limit', function () {
    for (const mission of bundle.manifest.colonization.missions) {
      expect(Colony.TYPES[mission.id].title).to.equal(mission.name);
      expect(Colony.getRewardAmount(mission.id)).to.equal(BigInt(mission.reward));
    }
    expect(Observation.MAX_MISSION_TARGETS).to.equal(bundle.manifest.observationTargets.maxGroups);
  });
});
