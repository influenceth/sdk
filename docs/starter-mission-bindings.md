# Starter mission action bindings (SDK 2.6.3)

All six helpers are exported on `StarterMission`, in both ESM and CommonJS.
They are pure and return `bigint`. A matching commitment establishes only that
this action data was bound: it does not establish ownership, eligibility,
readiness, completion, or transaction success. Cleared evidence is zero.

```js
import { Mission, StarterMission } from '@influenceth/sdk';

const slot = StarterMission.getActionEvidenceSlot({
  kind: 'Process', entity: { label: 5, id: 42 }, slot: 1
});
const path = Mission.getEvidencePath(assignment, slot);
```

`getActionEvidenceSlot({ kind, entity, slot = 0 })` accepts exactly `Built`,
`Sample`, `Extraction`, `Process`, `Downstream`, `Delivery`, `EconomicDelivery`.
It hashes `[encodedKind, packedEntity, slot]`; campaign and mission ID are not
included. `slot` is a u64. Packed entity labels are u16 and IDs are u64.
Built, Sample, Delivery and EconomicDelivery use slot 0 in the contract;
Extraction, Process and Downstream use the action's extractor/processor slot.
Downstream is a route mask and EconomicDelivery is a flag, not a fingerprint.

## Exact fingerprint inputs

Fields use Cairo names and order, not the server's camelCase names. Every listed
field is required. Integer values accept safe integer numbers, decimal/hex strings,
or bigint; negatives, fractions, unsafe numbers and missing fields are rejected.
Booleans must be `true` or `false`. Extra fields are ignored. Entities in Serde
inputs are `{ label, id }` (two u64s), not packed UUIDs. Arrays must preserve order.
An empty array must be supplied explicitly. Zero entities are `{ label: 0, id: 0 }`,
not null. Inventory items are `{ product, amount }`, both u64.

```js
const entity = { label: 5, id: 42 };
const destination = { label: 5, id: 77 };

StarterMission.getBuildingFingerprint(entity, {
  building_type: 5, planned_at: 1700000000, finish_time: 1700001000
});
StarterMission.getSampleFingerprint({
  status: 1, resource: 6, initial_yield: 0, remaining_yield: 0,
  finish_time: 1700001000, yield_eff: { mag: '5368709121', sign: false }
});
StarterMission.getExtractionFingerprint({
  extractor_type: 1, status: 1, output_product: 6, yield: 100000,
  destination, destination_slot: 2, finish_time: 1700001000
});
StarterMission.getProcessFingerprint({
  processor_type: 1, status: 1, running_process: 23, output_product: 2,
  recipes: { mag: '4294967297', sign: false },
  secondary_eff: { mag: '5368709121', sign: false },
  destination, destination_slot: 2, finish_time: 1700001000
}, {
  setup_time: 7200, recipe_time: 56160, batched: false, processor_type: 1,
  inputs: [{ product: 24, amount: 1800 }],
  outputs: [{ product: 2, amount: 200 }, { product: 23, amount: 1600 }]
});
StarterMission.getDeliveryFingerprint({
  origin: entity, origin_slot: 2, dest: destination, dest_slot: 2,
  finish_time: 1700001000,
  contents: [{ product: 129, amount: 100 }, { product: 2, amount: 200 }]
});
```

Fixed values are Cubit f64 Serde `{ mag: u64, sign: boolean }`; magnitude is
already scaled by 2^32. Do not pass real numbers or call `Fixed.realToFixed64`
on indexed floating-point values. Exact sign is retained, including signed zero.
The helper uses Starknet `CallData.compile` for ordered structs, spans and booleans,
and Starknet Poseidon for hashing; it does not encode storage-packed components.

Building excludes status. Sample and Extraction include the entire component.
Process includes the entire Processor and the **supplied on-chain ProcessType**.
Delivery excludes status and preserves contents order. Callers must supply the
component snapshot at the relevant start/finish stage, not a post-reset snapshot.

## Mapping from the indexed server

Reviewed server revision `4227ccc129c6e2fe87f1ed25dceb72cdf117d872`, specifically
`src/common/lib/events/handlers/starknet/Dispatcher/components/`, its `Processor/v1.js`,
`src/common/lib/events/handlers/starknet/utils.js`, and the matching Mongoose models.

| Component | Indexed field → helper field |
| --- | --- |
| Building | `buildingType` → `building_type`, `plannedAt` → `planned_at`, `finishTime` → `finish_time` |
| Deposit | `initialYield` → `initial_yield`, `remainingYield` → `remaining_yield`, `finishTime` → `finish_time`, raw `yieldEff` → `yield_eff` |
| Extractor | `extractorType` → `extractor_type`, `outputProduct` → `output_product`, `destinationSlot` → `destination_slot`, `finishTime` → `finish_time` |
| Processor | `processorType` → `processor_type`, `runningProcess` → `running_process`, `outputProduct` → `output_product`, raw `secondaryEff` → `secondary_eff`, `destinationSlot` → `destination_slot`, `finishTime` → `finish_time`; `recipes` must also be raw fixed |
| Delivery | `originSlot` → `origin_slot`, `destSlot` → `dest_slot`, `finishTime` → `finish_time`; preserve `contents` order |

Other listed fields retain their names. Component `entity` and action `slot` are
path metadata, not part of Deposit/Extractor/Processor fingerprints. Building
also needs its entity as the first argument. Delivery's own entity is not hashed.

### Required server data preservation

* `Deposit.yieldEff`, `Processor.recipes`, and `Processor.secondaryEff` currently
  pass through `Fixed.valueOf()` into Mongoose Number fields. Conversion divides
  the magnitude by 2^32 using IEEE-754 numbers. For example magnitudes
  `9007199254740992` and `9007199254740993` become the same value. Exact fingerprints
  cannot generally be recovered. Retain raw magnitude decimal strings and sign
  booleans alongside the display values in event transformation, persistence and
  API data. Backfill from retained raw `StarknetEvent.data` (or original chain data).
* Integer component fields, inventory product/amount values, and entity IDs also
  undergo `Number` conversions. Values above Number.MAX_SAFE_INTEGER need raw
  strings through decoding and Mongoose schemas. Safe integer values map directly.
* `Handler._entityFromData` replaces an entity with null when either member is
  zero. Preserve both raw members for commitments; do not guess them from null.
* ProcessType has no indexed component handler/model in the reviewed server.
  Supply its exact ordered on-chain definition. SDK `Process.TYPES` is display/
  calculation metadata: `recipeTime` is seconds while Cairo `recipe_time` is
  milliseconds; inputs/outputs are product-keyed objects, not ordered spans.
  The deployment script converts recipe time with `Math.round(recipeTime * 1000)`
  and iterates those objects, but deployed definitions can change. Consequently
  the fingerprint helper requires an explicit definition and does not substitute
  SDK metadata or infer array order. Track definitions and their relevant state
  in the server when computing historical bindings.

These SDK additions do not modify the server. No approximate fallback is provided.

## Cairo compatibility fixtures

See `test/fixtures/starterMissionBindings/` for the generator, inputs, serialized
felt arrays, hashes, source revisions, and reproduction instructions. The generator
uses the actual Cairo component types and Serde, not JavaScript-generated hashes.

Validation: `nvm use && npm test` (237 passing);
`npm run test:mission-bindings-build` builds both formats and checks all Cairo
vectors through both public exports. Changed helper/test files pass ESLint.
