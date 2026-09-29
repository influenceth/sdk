import { expect } from 'chai';
import { ec } from 'starknet';
import StarterMission from '../../src/lib/starterMission.js';
import Mission from '../../src/lib/mission.js';
import { readFileSync } from 'node:fs';

const vectors = JSON.parse(readFileSync(new URL('../fixtures/starterMissionBindings/vectors.json', import.meta.url), 'utf8'));

const fixture = (name) => vectors.find((vector) => vector.name === name);
const run = (vector) => StarterMission[vector.helper](...vector.args);

describe('Starter mission action bindings (Cairo fixtures)', function () {
  for (const vector of vectors) {
    it(`matches Cairo ${vector.name} Serde/Poseidon`, function () {
      expect(run(vector)).to.equal(BigInt(vector.hash));
      expect(BigInt(ec.starkCurve.poseidonHashMany(vector.serialized.map(BigInt)))).to.equal(BigInt(vector.hash));
    });
  }

  it('composes with evidence paths and defaults only the action slot', function () {
    const input = { ...fixture('key_zero').args[0] };
    delete input.slot;
    const slot = StarterMission.getActionEvidenceSlot(input);
    expect(slot).to.equal(BigInt(fixture('key_zero').hash));
    const path = Mission.getEvidencePath({ campaign: 123, subject: { label: 1, id: 42 } }, slot);
    expect(Mission.parsePath(path)).to.deep.equal({ type: 'Evidence', campaign: 123n, subject: { label: 1, id: 42n }, slot });
  });

  it('differentiates key kinds, entity labels/IDs and slots', function () {
    const keys = vectors.filter((v) => v.helper === 'getActionEvidenceSlot').map(run);
    expect(new Set(keys).size).to.equal(keys.length);
  });

  it('commits changed sample and processor fields but excludes delivery status', function () {
    expect(run(fixture('sample'))).not.to.equal(run(fixture('sample_changed')));
    expect(run(fixture('process'))).not.to.equal(run(fixture('process_changed')));
    expect(run(fixture('delivery'))).to.equal(run(fixture('delivery_complete')));
    const [delivery] = fixture('delivery').args;
    expect(StarterMission.getDeliveryFingerprint({ ...delivery, contents: [...delivery.contents].reverse() }))
      .not.to.equal(run(fixture('delivery')));
  });

  it('hashes exactly the twelve processor felts without a length prefix', function () {
    expect(fixture('process').serialized).to.deep.equal([
      '1', '1', '23', '2', '9007199254740995', '0', '5368709121', '1',
      '5', '77', '2', '1700001003'
    ]);
    expect(StarterMission.getProcessFingerprint.length).to.equal(1);
  });

  it('ignores recipe configuration and noncommitted component/path metadata', function () {
    const [processor] = fixture('process').args;
    const expected = run(fixture('process'));
    // A second argument from an older caller has no effect on the new commitment.
    for (const definition of [undefined, { recipe_time: 1 }, { recipe_time: 2, outputs: [] }]) {
      expect(StarterMission.getProcessFingerprint(processor, definition)).to.equal(expected);
    }
    expect(StarterMission.getProcessFingerprint({
      ...processor,
      version: 99,
      building: { label: 5, id: 123 },
      slot: 7,
      processDefinition: { recipe_time: 3 }
    })).to.equal(expected);
  });

  it('commits each of the twelve processor fields, including raw magnitude low bits', function () {
    const [processor] = fixture('process').args;
    for (const path of [
      ['processor_type'], ['status'], ['running_process'], ['output_product'],
      ['recipes', 'mag'], ['recipes', 'sign'], ['secondary_eff', 'mag'],
      ['secondary_eff', 'sign'], ['destination', 'label'], ['destination', 'id'],
      ['destination_slot'], ['finish_time']
    ]) {
      const changed = structuredClone(processor);
      const parent = path.length === 2 ? changed[path[0]] : changed;
      const field = path.at(-1);
      parent[field] = typeof parent[field] === 'boolean' ? !parent[field] : BigInt(parent[field]) + 1n;
      expect(StarterMission.getProcessFingerprint(changed), path.join('.')).not.to.equal(run(fixture('process')));
    }
  });

  it('rejects unsupported kinds and invalid key inputs', function () {
    const base = fixture('Built').args[0];
    for (const kind of ['Unknown', 'built', '', undefined, null]) {
      expect(() => StarterMission.getActionEvidenceSlot({ ...base, kind })).to.throw(RangeError);
    }
    for (const slot of [-1, 0.5, null, 1n << 64n, Number.MAX_SAFE_INTEGER + 1]) {
      expect(() => StarterMission.getActionEvidenceSlot({ ...base, slot })).to.throw();
    }
    for (const entity of [null, {}, { label: 65536, id: 1 }, { label: 1, id: -1 }]) {
      expect(() => StarterMission.getActionEvidenceSlot({ ...base, entity })).to.throw();
    }
  });

  it('requires every committed field, including nested fields', function () {
    const leaves = (value, prefix = []) => Object.entries(value).flatMap(([key, item]) => {
      const path = [...prefix, key];
      return item && typeof item === 'object' ? [path, ...leaves(item, path)] : [path];
    });
    for (const name of ['building', 'sample', 'extraction', 'process', 'delivery']) {
      const vector = fixture(name);
      for (const path of leaves(vector.args)) {
        if (name === 'delivery' && path.join('.') === '0.status') continue;
        const args = structuredClone(vector.args);
        let parent = args;
        for (const key of path.slice(0, -1)) parent = parent[key];
        delete parent[path.at(-1)];
        expect(() => StarterMission[vector.helper](...args), `${name}: ${path.join('.')}`).to.throw();
      }
    }
  });

  it('rejects lossy fixed values, nonboolean signs and unsafe amounts', function () {
    const [sample] = fixture('sample').args;
    for (const yieldEff of [1.25, null, { mag: 1, sign: 0 }, { mag: 2 ** 53, sign: false }, { mag: -1, sign: false }]) {
      expect(() => StarterMission.getSampleFingerprint({ ...sample, yield_eff: yieldEff })).to.throw();
    }
    const [delivery] = fixture('delivery').args;
    expect(() => StarterMission.getDeliveryFingerprint({ ...delivery, contents: [{ product: 1, amount: 2 ** 53 }] })).to.throw();
    expect(() => StarterMission.getDeliveryFingerprint({ ...delivery, contents: {} })).to.throw();
  });
});
