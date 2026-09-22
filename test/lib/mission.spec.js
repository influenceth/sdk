import { expect } from 'chai';
import Mission from '../../src/lib/mission.js';
import System from '../../src/lib/system.js';

describe('Mission library', function () {
  for (const campaign of [0, '0x123', '123', 123n]) {
    it(`preserves campaign ${String(campaign)} (${typeof campaign})`, function () {
      const subject = { label: 1, id: 42 };
      const assignment = Mission.getAssignment({ campaign, subject, mission: 0 });
      expect(assignment).to.deep.equal({ campaign, subject, mission: 0 });
      expect(assignment.subject).not.to.equal(subject);
    });
  }

  it('requires campaign and subject and validates the u32 mission index', function () {
    const input = { campaign: 1, subject: { label: 1, id: 42 }, mission: 0 };
    for (const campaign of [undefined, null, '']) {
      expect(() => Mission.getAssignment({ ...input, campaign })).to.throw(TypeError);
    }
    for (const subject of [undefined, {}, { label: 1 }]) {
      expect(() => Mission.getAssignment({ ...input, subject })).to.throw(TypeError);
    }
    for (const mission of [-1, 0.5, '0', NaN, 2 ** 32]) {
      expect(() => Mission.getAssignment({ ...input, mission })).to.throw(RangeError);
    }
    expect(Mission.getAssignment({ ...input, mission: 0xffffffff }).mission).to.equal(0xffffffff);
  });

  const assignment = { mission: 0, subject: { id: 42, label: 1 }, campaign: '0x123' };
  it('encodes campaign registration class hashes and u32 counts', function () {
    expect(System.Systems.RegisterMissionCampaign.inputs.map(({ type }) => type))
      .to.deep.equal(['String', 'String', 'Number']);
    expect(System.getRunSystemCall('RegisterMissionCampaign', {
      campaign: '0x123', implementation: '0x456', mission_count: 8
    }, '0x789').calldata.slice(1)).to.deep.equal(['3', '291', '1110', '8']);
  });

  for (const name of ['AcceptMission', 'ClaimMissionReward', 'ReadMissionState']) {
    it(`serializes ${name} in ABI order independent of object insertion order`, function () {
      const input = { assignment, slot: '0x5' };
      const expected = ['291', '1', '42', '0'];
      if (name === 'ReadMissionState') expected.push('5');
      expect(System.getRunSystemCall(name, input, '0x456').calldata.slice(1))
        .to.deep.equal([String(expected.length), ...expected]);
      expect(System.Systems[name].isGetter).to.equal(false);
      expect(System.Systems[name].inputs[0].type).to.equal('MissionAssignment');
    });
  }
  for (const name of ['MissionAction', 'MissionValidate']) {
    for (const args of [[], [7n, 8n]]) {
      it(`serializes ${name} with ${args.length} arguments`, function () {
        const expected = ['291', '1', '42', '0'];
        if (name === 'MissionAction') expected.push('9');
        expected.push(String(args.length), ...args.map(String));
        expect(System.getRunSystemCall(name, { assignment, action: '0x9', arguments: args }, '0x456').calldata.slice(1))
          .to.deep.equal([String(expected.length), ...expected]);
      });
    }
  }
});
