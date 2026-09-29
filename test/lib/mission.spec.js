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

  describe('State decoding', function () {
    const subject = { label: 1, id: 42 };
    const campaign = '0x123';

    it('builds contract lifecycle and evidence paths, including page boundaries', function () {
      expect(Mission.getLifecyclePath({ campaign, subject, mission: 31 }))
        .to.deep.equal([0x4c6966656379636c65n, 291n, 2752513n, 0n]);
      expect(Mission.getLifecyclePath({ campaign, subject, mission: 32 }))
        .to.deep.equal([0x4c6966656379636c65n, 291n, 2752513n, 1n]);
      expect(Mission.getLifecyclePath({ campaign, subject, mission: 0xffffffff })[3]).to.equal(134217727n);
      expect(Mission.getEvidencePath({ campaign, subject }, '0x64'))
        .to.deep.equal([0x45766964656e6365n, 291n, 2752513n, 100n]);
    });

    it('parses all supported paths without losing large felt or entity values', function () {
      const large = (1n << 200n) + 7n;
      const largeSubject = { label: 1, id: (1n << 64n) - 1n };
      for (const descriptor of [
        { type: 'Lifecycle', campaign: large, subject: largeSubject, page: 1 },
        { type: 'Evidence', campaign: large, subject: largeSubject, slot: large },
        { type: 'Definition', campaign: large },
        { type: 'DefinitionCount', campaign: large },
        { type: 'StarterInvalid', subject: largeSubject },
        { type: 'StarterParticipated', subject: largeSubject },
        { type: 'ExecutionLock' }
      ]) {
        const path = Mission.getPath(descriptor);
        for (const encoded of [path, path.map(String), path.map((n) => `0x${n.toString(16)}`)]) {
          expect(Mission.parsePath(encoded)).to.deep.equal(descriptor);
        }
      }
    });

    it('decodes independent lifecycle flags across the 32-mission page boundary', function () {
      const word = (1n << 31n) | (1n << 32n) | (1n << 95n);
      for (const value of [word, word.toString(), `0x${word.toString(16)}`]) {
        expect(Mission.unpackLifecycle(value, 31)).to.deep.equal({ accepted: true, completed: false, claimed: true });
        expect(Mission.unpackLifecycle(value, 32)).to.deep.equal({ accepted: false, completed: true, claimed: false });
        expect(Mission.unpackLifecycle(value, 1)).to.deep.equal({ accepted: false, completed: false, claimed: false });
      }
      expect(Mission.unpackLifecycle(0, 0)).to.deep.equal({ accepted: false, completed: false, claimed: false });
      expect(Mission.unpackLifecycle((1n << 128n) - 1n, 0xffffffff)).to.deep.equal({ accepted: true, completed: true, claimed: true });
    });

    it('rejects malformed known paths and unsafe packed values', function () {
      expect(Mission.parsePath([0])).to.equal(null);
      expect(() => Mission.parsePath([])).to.throw(TypeError);
      expect(() => Mission.parsePath([0x4c6966656379636c65n])).to.throw(RangeError);
      expect(() => Mission.getPath({ type: 'Unknown' })).to.throw(RangeError);
      expect(() => Mission.getEvidencePath({ campaign: (1n << 251n) + 17n * (1n << 192n) + 1n, subject }, 0)).to.throw(RangeError);
      expect(() => Mission.getPath({ type: 'Lifecycle', campaign, subject, page: 2 ** 27 })).to.throw(RangeError);
      for (const value of [-1, 1.5, Number.MAX_SAFE_INTEGER + 1, '', null, true, 1n << 128n]) {
        expect(() => Mission.unpackLifecycle(value, 0)).to.throw();
      }
      expect(() => Mission.unpackLifecycle(0, 2 ** 32)).to.throw(RangeError);
    });
  });
});
