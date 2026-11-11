# Prospecting SDK — 2.9.0 release candidate

This release supplies shared prospecting/claim APIs for the client and server.
It does not activate the production gameplay cutover. Existing legacy sampling
and extraction APIs remain compatible. New campaign calls explicitly target the
compiled **sandbox** protocol, not fictional production systems or addresses.

## Public modules

| Module | Purpose |
| --- | --- |
| `Prospecting` | Rules, probability tables, reach previews, transcript replay, durable sample intents, proof packets and sandbox bindings. |
| `Claim` | One view of legacy/new deposits; versioned rate metadata and exact Cairo storage codecs. |
| `Mining` | Baseline eligibility, constant-rate quotes, per-run limits and extraction blockers. |
| `PrivateData` | Existing wallet key derivation, record encryption, stable peer identity, signatures and recovery. |
| `Extractor` | Existing depletion-time helpers plus new `quote`, `quoteClaim`, `getMaxQuantity`, `getRunningJob` and `isSamplingBlocked` methods. |
| `StarterMission` | Single-campaign prospecting metadata and claim qualification without changing mission IDs/rewards. |

ESM and CommonJS builds expose the same APIs. Pure calculation/record helpers have
no browser storage or network side effects. The client owns IndexedDB, the worker,
wallet connection UI and libp2p connections; the server owns retention/indexing.

## Units and rules

- Deposit balances, campaign proof quantities and new mining quotes use **resource
  units**. Each current raw-resource unit is 1 kg. One tonne is 1,000 units.
- The existing `Extractor.getExtractionTime` helpers take **grams** and retain the
  old depletion calculation. Do not feed them resource units or use their result
  for a new constant-rate job.
- Abundances are integer parts per million, e.g. `600000` is 60%.
- Intrinsic modifiers use basis points, e.g. `12000` is 1.2× reference rate.
  Rates are BigInt nanounits per game second. Combined ordinary bonuses can be
  supplied once as `bonusBps` or exact positive `bonusFixed64` (magnitude, 32
  fractional bits), never both. Time acceleration is applied separately.
- Block timestamps/durations are real seconds. Private-envelope `updatedAt` follows
  the existing protocol's integer JavaScript timestamp convention.
- Rules v7/circuit `fieldwork-r7-volume150-v1` support 1–10 paid samples, a +50%
  quantity adjustment, five depth bands, 1.5 km step reach and 3.5 km origin reach.
  The original integer quantity is floored before multiplying by 3/2 and flooring
  again. `getClaim` already includes this bonus: do not apply it a second time.
- Baseline requires global abundance >= 5%, then mines at 0.25× reference rate.
  Read packed global abundance with `Mining.getGlobalAbundancePpm` so the inclusive
  boundary is not shifted by floating/fixed-point conversion. Positive trace
  materials remain available through claims. Absent materials are not eligible.
- The legacy default is permanently pinned to claim rule 1 at 1.2× reference rate.
  Do not rebalance old missing-metadata claims by editing this historical default.

## Unified claims and extraction

The Cairo `Deposit` component, entity ID, resource, remaining balance, controller,
location, sale references and sampling fields are preserved. A new one-felt `Claim`
component stores `rules_version`, `rate_bps`, `reference_abundance_ppm` and
`campaign_id` in 16/16/20/64 bits. Missing metadata means a historical default claim;
incomplete new metadata is an error, not a default. New finalizations must write
both components atomically. No migration quantity bonus is granted to old deposits.

```js
import { Claim, Mining, Extractor } from '@influenceth/sdk';

const claim = Claim.fromEntity(depositEntity, { localAbundancePpm: 600000 });
const quote = Mining.quote({
  mode: 'claim', claim, resource: claim.resource,
  lotId: extractorLotId, quantity: 10000, // 10 tonnes
  bonusBps: 10000, timeAcceleration: 24
});
// quote: realSeconds, gameSeconds, rateNano, remainingYield, crewLaborSeconds
```

A claim requires an extractor on its own lot, irrespective of campaign origin.
New claims pin their reference abundance in metadata; old claims need the caller's
lot/resource abundance under the historical reference rules. Normal use/sale/lot
permissions remain separate from a calculation quote.

```js
const baseline = Mining.quote({
  mode: 'baseline', resource: 1, globalAbundancePpm: 600000,
  localAbundancePpm: 600000, quantity: 10000, timeAcceleration: 24
});
```

Baseline creates no fake deposit or remaining balance. Quotes enforce reserve and the prototype's 10,000-tonne per-run allowance with
conservative integer rounding. `maxGameSeconds` optionally applies an explicit
duration allowance; the old one-year formula constant is a reference scale, not
a hard duration cap. Splitting jobs cannot speed up extraction through rounding. `getMaxQuantity`
returns the currently allowable amount. Reference-rate arithmetic matches the
sandbox Cubit f64 operation order; geometry previews do not claim Cairo parity.

Existing jobs use `Extractor.getRunningJob(extractor, blockTime)`: output,
destination and finish time are read from their committed job fields. Never recalculate
an existing job from a converted claim or debit its deposit again. Pending legacy
samples/improvements retain their old completion paths and randomness.

`Mining.isSamplingBlocked(allTargetLotExtractorSlots)` returns true if **any** slot
has `RUNNING` status, including a finished job awaiting collection, as agreed.
It checks the investigated lot, including lateral targets. Starting extraction
after an accepted sample does not invalidate that sample. Finalization does not
recheck historic extraction status. No additional extraction-window component is used.

## Campaigns and private records

`getOriginKey` includes chain/game/asteroid/origin, excluding owner/resource: one
campaign occupies a starting lot across all actors/materials. `getScopeKey` also
includes account/material and preserves the client's canonical identity field order
for private-record lookup.

`ORIGIN_PERMISSION` reuses `USE_LOT`; `SAMPLE_COST` is one existing core drill.
Current origin permission is required for new samples, not for finalizing existing
evidence after revocation. Lateral targets need no surface permission. The 24-hour
replacement deadline starts from the last sample's scheduled ready time, or creation
when empty, and is not accelerated. Expiry alone does not invalidate a campaign;
replacement must change the active ID. Cancellation retains the deadline.

Local simulation records keep schema 1 for recovery compatibility. Chain records
use schema 2 because a pending commitment may have no randomness or receipt yet.
Neither record format stores a plaintext encryption key.

The chain adapter should follow this ordering:

1. Start the campaign and obtain its authoritative ID/context. Use `createRecord`
   with `mode: 'chain'` and the account/chain/game identity.
2. Obtain canonical metadata and approach mask from `client.previewSample(id, lot)`.
   These are public abundance/geography checks, not private vein outcomes.
3. Generate an action salt with `generateSalt`, then call `prepareSample`. Encrypt
   and save the returned record **before broadcasting** the commitment. `getCommitCall` takes the saved
   `index` and uses `commit_checked`, which atomically rejects a stale device index
   before charging a drill. The old unguarded fixture call is not used by the SDK.
4. `markSubmitted` records the transaction hash. `acceptSample` checks the observed
   core against the saved commitment, target metadata and mask. It can also recover
   an uncertain broadcast directly from a matching core when no hash was returned.
5. Wait for both work readiness and the future block hash's availability, then use
   `resolveSample` with authoritative randomness and save before accepting the result.
   Only a confirmed reverted transaction permits `retryRejectedSample`; it retains
   the same salt/action. A timeout alone does not permit a reroll.
6. `finalizeRecord` selects a productive section without new entropy. `getProofPacket`
   supplies the witness and expected public digest for the existing browser worker.

The contract resolves samples lazily: storage can still say `pending` after the
client has read its mature randomness. `getCampaignReadiness` accounts for this when
checking whether another sample can start. Final transcript checks include the
unresolved last core and its authenticated previewed randomness.

`Contracts.prepareFinalizeCall` reads and validates the chain transcript, encodes
Groth16 hints and builds a call using the compiled ABI. An optional pinned
`blockIdentifier` keeps its reads at one snapshot; the contract rechecks authority
atomically at execution. Its finalization calldata contains the verifier span length
exactly once. It does not broadcast or claim a proof is verified by generating hints.

## Private-data compatibility

`PrivateData.getUnlockMessage`, `deriveKey` and `recoverKey` preserve the existing
inbox message and signature encoding. Enrollment uses `deriveKey`; recovery checks
the published public key. The shared player key remains memory-only. The client
continues to manage its existing recovery-seed API and wallet reconnection.

`encryptRecord`, `signRecord`, `verifyRecord` and `decryptRecord` preserve the deployed
local prototype envelope protocol. Stable peer/signing keys and opaque per-scope IDs
are derived with separate domains. A retention server can use `verifySignedRecord`
with the authenticated peer public key; it needs no player encryption private key.

Remote storage still needs durable acknowledgments, revision compare-and-swap,
account isolation and operated WSS retention peers. Signatures prove authorship,
not that a disconnected peer holds the latest revision. Key rotation, conflict
resolution UI, backup discovery and passkey wrapping are subsequent integration work.

## Starter mission

`PROSPECT_THE_SURFACE` retains its ID/reward and now describes **one completed
prospecting campaign yielding a claim of at least 1,000 tonnes**. That is
`minInitialYieldKg: 1000000`. `getProspectingDefinition()` returns the shared default;
a different deployment can pass `minimumClaimQuantity` explicitly.

`isProspectingClaimQualified` checks new-claim provenance, campaign ID and initial
quantity, so later extraction does not undo qualification. Old deposits are not new
campaign completions. The mission observer still provides crew authorization,
provenance and exactly-once credit; this helper does not grant rewards. Historic
`sampleCount` progress decoding remains available and is not reinterpreted.

## Generated artifacts and release boundary

The package exports `./prospecting/artifacts`, `./prospecting/contracts`,
`./prospecting/verifiers`, `./prospecting/proof-assets`,
`./prospecting/claim-component` and `./contracts/components` JSON subpaths.

Artifacts include the genuine Cairo Claim schema, compiled TypeComponent class
provenance, the compiled sandbox campaign ABI, ten verifier ABIs/verification keys,
class hashes and hashed proof-asset descriptors. WASM, proving keys and full
Sierra/CASM programs are not bundled into npm. Host the development assets separately.
All proof setup keys and campaign bindings are explicitly development-only.
The sandbox campaign fixes sampling quality at 10000 BPS; the transition kernel
supports up to 15000 BPS for circuit experiments, not a claim of production crew
quality integration.
Production setup remains deferred. Existing deployed addresses are not changed.

Regenerate from the two compiled repositories:

```sh
npm run export-prospecting -- /path/to/mining-prototype /path/to/influence-starknet
npm test
npm run build:release
npm run test:prospecting-build
```

Remaining contract implementation: production campaign systems, real crew/drill
accounting, baseline/new extraction starts, atomic claim creation, old-start cutover
and updated mission observer policy. Client/server must adopt those ABIs and events
when that code exists. The release does not fabricate production entrypoints or
claim that changing SDK mission text already changes on-chain mission qualification.
