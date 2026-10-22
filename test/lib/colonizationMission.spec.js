import { expect } from 'chai';
import Colony from '../../src/lib/colonizationMission.js';
import Starter from '../../src/lib/starterMission.js';
import Mission from '../../src/lib/mission.js';
import Entity from '../../src/lib/entity.js';
import System from '../../src/lib/system.js';

describe('Colonization missions', function () {
  it('describes independent branches and exact rewards', function () {
    expect(Object.values(Colony.IDS).map(Colony.getRewardAmount)).to.deep.equal([
      150000000000n, 250000000000n, 300000000000n, 350000000000n, 450000000000n
    ]);
    for (const id of [1, 2, 3, 4]) expect(Colony.TYPES[id].prerequisiteId).to.equal(0);
    expect(Colony.getAssignment({ campaign: 123, asteroidId: 42, missionId: 0 }).subject)
      .to.deep.equal({ label: Entity.IDS.ASTEROID, id: 42 });
    expect(() => Colony.getRewardAmount(5)).to.throw();
  });
  it('decodes historical earned flags separately from capstone claim readiness', function () {
    expect(Colony.unpackEarned(15)).to.deep.equal({ scan: true, habitat: true, spaceport: true, marketplace: true });
    expect(Colony.unpackEarned(2)).to.deep.equal({ scan: false, habitat: true, spaceport: false, marketplace: false });
    expect(Colony.TYPES[4].requirements.requiresOperationalSelectedBuildingsAtClaim).to.equal(true);
  });
  it('shares exact construction bindings while supporting Used evidence', function () {
    const entity = { label: 5, id: 42 };
    const building = { building_type: 1, planned_at: 123, finish_time: 456 };
    expect(Colony.getBuildingFingerprint(entity, building)).to.equal(Starter.getBuildingFingerprint(entity, building));
    expect(Colony.getActionEvidenceSlot({ kind: 'Built', entity })).to.equal(Starter.getActionEvidenceSlot({ kind: 'Built', entity }));
    expect(Colony.getActionEvidenceSlot({ kind: 'Used', entity })).not.to.equal(Colony.getActionEvidenceSlot({ kind: 'Built', entity }));
    expect(() => Starter.getActionEvidenceSlot({ kind: 'Used', entity })).to.throw();
  });
  it('round-trips new persistent paths and registers only current systems', function () {
    expect(Mission.parsePath(Colony.getRewardPath({ campaign: 123, missionId: 4 })))
      .to.deep.equal({ type: 'ColonyReward', campaign: 123n, mission: 4 });
    const marker = { type: 'StarterObserverMigrated', campaign: 123n };
    expect(Mission.parsePath(Mission.getPath(marker))).to.deep.equal(marker);
    expect(System.Systems).not.to.have.property('MissionAction');
    for (const name of ['ConfigureColonizationMissions', 'MigrateStarterObserver', 'UpgradeMissionCampaign']) {
      expect(System.Systems).to.have.property(name);
    }
  });
});
