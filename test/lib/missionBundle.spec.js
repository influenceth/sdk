import { expect } from 'chai';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import Colony from '../../src/lib/colonizationMission.js';
import Observation from '../../src/lib/missionObservation.js';

const bundle = JSON.parse(readFileSync(new URL('../fixtures/missionObservation/bundle.json', import.meta.url)));
const abis = JSON.parse(readFileSync(new URL('../../src/contracts/starknet_abis.json', import.meta.url)));

describe('Rebuilt mission bundle compatibility', function () {
  it('ships the exact combined ABI from the pinned bundle', function () {
    const bytes = readFileSync(new URL('../../src/contracts/starknet_abis.json', import.meta.url));
    expect(createHash('sha256').update(bytes).digest('hex')).to.equal(bundle.sha256['starknet_abis.json']);
    for (const name of ['Dispatcher', 'MissionObserver', 'StarterMissionCampaign', 'ColonizationMissionCampaign']) {
      expect(abis).to.have.property(name);
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
