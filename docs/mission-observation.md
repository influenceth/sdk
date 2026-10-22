# Mission observation — SDK 2.8.0

This release removes `System.Systems.MissionAction`. Rebuild wrapper transactions
as native calls enclosed by observation; old wrapper calls fail after contract cutover.
Campaign IDs and deployed addresses remain deployment configuration. The artifact
manifest's class hashes are not addresses.

```js
import { MissionObservation, ColonizationMission } from '@influenceth/sdk';

const candidates = [ColonizationMission.getAssignment({
  campaign, asteroidId, missionId: ColonizationMission.IDS.BUILD_A_HABITAT
})];
const calls = MissionObservation.getObservedSystemCalls({
  dispatcher, account: account.address, system: 'ConstructionStart',
  input: { building, caller_crew: crew }, candidates
});
await account.execute(calls);
```

`getObservedSystemCalls` serializes the native call once and hashes that exact
argument array. It returns begin/native/end calls. Keep all three in the same
account transaction. Multiple actions use sequential begin/action/end groups.
Do not nest observation groups. `end_observation` is required: an unmatched hash
or immediate caller must revert the transaction rather than silently miss evidence.

## Coverage and candidates

Observe actions that establish current or future campaign progress, even when
they cannot immediately complete a mission. Evidence is shared within the campaign;
candidate mission IDs select which completion checks run.

For example, a refinery action nominated for starter mission 4 also records
applicable production-chain evidence for mission 7. Mission 7 need not be nominated
or accepted for that evidence to persist. Acceptance later evaluates accumulated
evidence. Observation does not complete unaccepted missions. Campaign enrollment
(mission 0 accepted) is required before observation.

The server/client must discover relevant enrolled campaigns and subjects. Do not
skip observation merely because no accepted mission can complete immediately.
The SDK does not discover campaigns or filter candidates by acceptance. Duplicate
assignments are merged into one mask per campaign/subject. Up to eight groups are
encoded as `[campaign, packedSubject + (missionMask << 80)]`; observer indices are
0–31, while generic mission assignments retain their u32 range. Actual campaign
mission counts and subject validity are enforced on-chain.

Starter observation covers ConstructionPlan/Start/Finish, SampleDepositStart/Finish,
ExtractResourceStart/Finish, ProcessProductsStart/Finish, SendDelivery,
ReceiveDelivery, ResupplyFood, and FillSellOrder. Colonization covers
ScanSurfaceStart/Finish, ConstructionStart/Finish, StationCrew, DockShip,
FillBuyOrder, and FillSellOrder. A shared action may include both a crew starter
candidate and an asteroid colony candidate. Nominate additional missions when
their completion should be checked immediately; this does not gate shared evidence.

## Escrow and payment callbacks

Use `observeMissionAction({ dispatcher, account, system, calldata, executionCalls,
candidates, expectedCaller })` around existing native execution calls. `calldata`
is the exact flattened native argument array, including caller crew and callback
fields, excluding the `run_system` name/length header and Dispatcher Context.
Execution calls retain their original payment and authorization mechanisms.

For buy fills, construct `calldata` with:

```js
const calldata = MissionObservation.escrowWithdrawalArguments({
  nativeArguments, // fixed order fields plus fill fields, including caller crew
  caller, token: swayAddress, withdrawals
});
const calls = MissionObservation.observeMissionAction({
  dispatcher, account: account.address, system: 'FillBuyOrder', calldata,
  executionCalls: [withdrawCall], candidates, expectedCaller: escrowAddress
});
```

This appends `caller, 2, token, withdrawal_count, (recipient, low, high)...`.
Use the actual Escrow callback caller data, not an inferred crew/address value.
For `run_system_with_payment`, the expected immediate caller is the SWAY callback
contract. The default is the account and is appropriate for direct calls only.
Integers must be exact safe numbers, decimal/hex strings, or bigint. No approximate
conversion of unsafe numbers is provided.

## Colonization state

`ColonizationMission` exports IDS, TYPES, REWARD_SCALE, EVIDENCE_SLOTS,
getAssignment, getRewardAmount, unpackEarned, getActionEvidenceSlot,
getBuildingFingerprint, and getRewardPath. Rewards are whole SWAY in TYPES and
bigint base units from getRewardAmount. Total reward is 1,500,000 SWAY.

Enroll an unscanned asteroid before starting its first surface scan. Both scan
start and finish must be observed and performed by the original colonizer while
they own it. Construction starts must be observed after recorded scan completion
(equal timestamps are allowed); plans may predate enrollment. Anyone can build or
use eligible buildings, including crews without starter eligibility. Construction
finish observation is optional for colony-only work because qualifying use checks
current operational state and construction provenance.

After scan completion, missions 1–4 may be accepted independently. Habitat stationing,
Spaceport docking, and a Marketplace positive-quantity fill earn their branch
progress. Commerce counts at fill time, including partial fills, with no value
floor; cancellation does not count. Unobserved history cannot be recovered by
MissionValidate. Use `MissionValidate(assignment, [])` to evaluate recorded evidence.

Claims require the original colonizer to currently own the NFT. Transfers do not
reset enrollment or transfer rewards. Branch entitlements survive building removal;
the capstone rechecks all three selected buildings at claim time even after its
completed flag is set. `unpackEarned` represents historical branch evidence, not
claim readiness. A valid selected building is retained; another qualifying use
replaces it only when the existing selection no longer qualifies.

Evidence uses the existing campaign/subject namespace. Numeric slots 1–3 contain
selected building IDs; Colonizer, ScanStarted, ScanFinished, and Earned are encoded
short-string slots. Built/Used keys share the exact construction fingerprint
algorithm used by StarterMission. Reward paths are ColonyReward/campaign/mission.

## Deployment and indexing

Upgrade Dispatcher and register MissionObserver and the new systems. For original
wrapper deployments use MigrateStarterObserver; it preserves starter progress and
pending fingerprints and retires the wrapper. For already-observed deployments use
UpgradeMissionCampaign with the expected old class and replacement registry name.
Do not re-enroll players or rerun configuration. Fresh colonization deployments
register a distinct five-mission campaign and configure it once. Coordinate SDK
rollout with contract cutover; this SDK has no legacy wrapper fallback.

Lifecycle event payloads remain unchanged and are emitted at Dispatcher; their
source ABI is now ClaimMissionReward. ExecutionLock no longer emits component
updates. Index persistent mission evidence and native events together; native events
alone are not proof of observation. Refresh deployment metadata after migration
because its direct registry writes do not emit SystemRegistered. Third-party
clients need colony candidates resolved from the affected building/exchange asteroid.
