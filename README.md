[![npm version](https://badge.fury.io/js/@influenceth%2Fsdk.svg)](https://badge.fury.io/js/@influenceth%2Fsdk)

# Influence SDK
Utilities / SDK / API docs for interacting with Influence. The SDK is licensed under permissive open source licenses to encourage its use.
More information can be found in the LICENSE files.

## Contracts

### Ethereum Mainnet Addresses
- Asteroid NFT: 0x6e4c6D9B0930073e958ABd2ABa516b885260b8Ff
- CrewmateV1 NFT: 0x746Db7B1728aF413C4e2b98216C6171B2FC9D00e
- CrewmateV2 NFT: 0xB5CC57cD1f9a9bE85a50604b0591A53d89Bd4884
- Crew NFT: 0x3F83184227663E6B6Fa1B0e7Ea64FcA505C2bA6a
- Ship NFT: 0xE1791C021261FAFbE095b843cdA40A2F9812D233
- SWAY Token: 0x9DE7f7a6c0B00902983c6f0658E157A8a684Cfd5

### Starknet Mainnet Addresses
- Influence Dispatcher: 0x0422d33a3638dcc4c62e72e1d6942cd31eb643ef596ccac2351e0e21f6cd4bf4
- Asteroid NFT: 0x0603cf837055c64d026a3c5a9e3a83036cea6c4a3f68a9e19f7a687d726fe817
- Crewmate NFT: 0x0241b9c4ce12c06f49fee2ec7c16337386fa5185168f538a7631aacecdf3df74
- Crew NFT: 0x07280a807c8b79379bec87919433b7b836b93a92e6d71b24ee99f4ffe33dd337
- Ship NFT: 0x04369e47e647ab5fc4d36cee26590276b99a89a83fc3306462d21d366611fde3
- SWAY Token: 0x004878d1148318a31829523ee9c6a5ee563af6cd87f90a30809e5b0d27db8a9b

### ABIs
Smart contract ABIs can be included with `import { starknetContracts, ethereumContracts } from '@influenceth/sdk'` and utilized with Starknetjs, Ethers, Web3js.

### Components
All state in Influence is stored as components on the Dispatcher contract and can be accessed via a special system action `ReadComponent`.
Components are addressed by a key, typically the entity, and component name. For some components, the key is complex and includes multiple fields.
For example, the `Crew` component is addressed by the crew's packed entity UUID:
```js
Dispatcher.call('run_system', Dispatcher.callData.compile('run_system', {
  name: 'ReadComponent', calldata: [ 'Crew', 1, Entity.packEntity({ label: Entity.IDS.CREW, id: 4938 }) ]
}));
```

ABI types / schemas for all components can be found in `./contracts/starknet_components.json`.

## Install

Requires Node.js 22 or later and uses starknet.js v10. Applications using the SDK's
Starknet calls should also use starknet.js v10.

```sh
npm install @influenceth/sdk
```

## Usage

```js
import * as InfluenceSDK from '@influenceth/sdk';

// Access game assets data and logic
const resourcesClassification = InfluenceSDK.Product.CLASSIFICATIONS.RAW_MATERIAL;
const allResourcesIds = InfluenceSDK.Product.getListByClassification(resourcesClassification);

const resourcesBySpectralId = {};
const spectralTypesData = InfluenceSDK.Asteroid.SPECTRAL_TYPES;
for (const [spectralId, spectralData] of Object.entries(spectralTypesData)) {
  resourcesBySpectralId[spectralId] = spectralData.resources;
}
```

## API
1. The API is whitelist only, please request access to the #community-devs channel in the Influence Discord: https://discord.gg/influenceth to receive an API key.
2. If possible, prefer using the exports here: https://www.dropbox.com/sh/5g3ww8wi9n0p4s6/AADcR0lgL8iKTQrpiWUC37Oxa?dl=0 rather than adding additional load to the API.
3. These endpoints are located at https://api.influenceth.io (or https://api-prerelease.influenceth.io for Sepolia testnet)

### Authenticating
1. Once you have a client_id and client_secret retrieve a JWT token by sending a `POST` request to `/v1/auth/token` with the following JSON body:
```json
{
  "grant_type": "client_credentials",
  "client_id": "[client_id]",
  "client_secret": "[client_secret]"
}
```
2. You'll receive back a JSON object with the token which does not expire (you can always request a new one if needed):
```json
{
  "access_token": "[access_token]",
  "token_type": "bearer"
}
```
3. Include the token in the header for any requests to the API as: `Authorization: Bearer [access_token]`

## Starknet Migration Information
Prior to the launch of Influence: Exploitation, a snapshot was taken of the asteroid and crewmate collections which
have lived on Ethereum since the "Arrival" sale. As of block number `17794088` the asteroid ownership and names, and
the crewmate names were saved, to be seeded into the initial Influence state on Starknet. Additionally, the asteroid
bonuses, purchase order, spectral type, radius, and orbital elements were saved to support a Merkle-tree driven seed
of the information on Starknet.

Copies of both snapshots and the asteroid Merkle tree are preserved on IPFS here:
- Asteroids snapshot: https://developed-white-hedgehog.myfilebase.com/ipfs/QmdJ7kY74efg8PvcbZ7AzuVdfZAksUiAVUL7koznvYWUq4
- Crewmate snapshot: https://developed-white-hedgehog.myfilebase.com/ipfs/QmPjtFx2b8gx4kBEX3xZmCafmyWdfDj8UkNqfQGmFvtg4U

A utility is available at `utils/generateAsteroidMerkle.js` to generate the Merkle tree from the snapshot.

## Snapshot Details
At the time of the snapshot:
- 8,650 asteroids had been used to mint an Arvad Crewmate
- an additional 13 Arvad Department heads had been minted
- The last crewmate minted on L1 was ID: 8663
- 11,468 asteroids had been minted
- 2,450 of the first 11,100 minted can still be used to mint an Arvad Crewmate
- The last 368 asteroids are eligible to claim an Adalian Crewmate on L2
- The first 1,859 asteroids are eligible to claim an Arrival Starter Pack on L2

### Starter missions

`StarterMission.IDS` and `StarterMission.TYPES` describe the eight zero-based
missions. Rewards and cumulative rewards are in whole SWAY;
`StarterMission.getRewardAmount(missionId)` returns micro-SWAY as a `bigint`.
Requirement fields name their units explicitly. Building and processor types use
separate namespaces. All native processes for the required processor qualify;
use `Process.getListByProcessorType` to list them.

```js
import { StarterMission, System } from '@influenceth/sdk';

const assignment = StarterMission.getAssignment({
  campaign: configuredStarterMissionCampaign,
  crewId,
  missionId: StarterMission.IDS.MAKE_LANDFALL
});
const call = System.getRunSystemCall('AcceptMission', { assignment }, dispatcherAddress);
```

`Mission.getAssignment({ campaign, subject, mission })` also supports generic
campaigns. Campaign IDs and the starter crew cutoff are deployment configuration,
not universal SDK constants. `MissionAction` takes `assignment`, `action`, and an
`arguments` array; `MissionValidate` takes `assignment` and `arguments`.
`ClaimMissionReward` takes `assignment`; `ReadMissionState` takes `assignment` and
`slot`. The ABI marks `ReadMissionState` external, not view. The SDK does not assign
meanings to its returned tuple or application-specific state slots.

Completion is authoritative on-chain. The same Crew participates throughout;
it must be manned, not invalidated, and have an ID strictly above the configured
cutoff. Acceptance is explicit and sequential: the previous mission must be
completed but need not be claimed. Early evidence captured through the campaign
wrapper persists; ordinary historical gameplay is not automatically credited.
Production buildings require campaign construction evidence and crew control at
qualifying use. Purchased inputs count.

Make Landfall records a Warehouse plan; construction need not have started.
Prospecting requires three distinct initial sampling start/finish sequences with
at least 500,000 kg initial yield each. Extraction requires one completed run of
at least 100,000 kg of raw product (IDs 1–22); neither the qualifying samples nor
the campaign Warehouse are required as its source or destination. Storage requires
the recorded Warehouse to be constructed and operational: after a qualifying
receipt, slot 2 must hold at least 100,000 kg of current inventory. Mixed and
purchased goods count; reserved/incoming mass and cumulative throughput do not.
Refining, biological, and manufacturing runs require at least one full recipe or
batch, even when native scheduling rounds a fractional batch's duration upward.

`StarterMission.ROUTE_IDS` and `ROUTE_TYPES` describe the five approved capstone
routes. Stage 1 must finish before stage 2 starts, producing a positive amount of
the intermediate that stage 2 consumes. Both stages require at least one full
recipe/batch. The same building may perform both stages where supported; Silica
Fusing uses a Factory. Purchased intermediates and replacement goods count;
there is no batch tracing. `getRouteOutputProductIds(routeId)` lists possible
second-stage outputs for previews, including secondary products. Eligibility
requires a recorded positive actual output, not merely appearing in this list.

Economic use requires a positive amount of an eligible output: consumption by
`ProcessProductsStart`, actual materials consumed by `ConstructionStart`, actual
inventory FOOD consumed by `ResupplyFood`, or a completed delivery to a different
entity. Allowance-only construction/resupply, in-flight deliveries, and market
transactions (including listings, `FillSellOrder`, and `FillBuyOrder`) do not count. Delivery
completion can be credited by `ReceiveDelivery` or `MissionValidate` reconciliation.

Claims are once per mission and paid to the crew's current delegate. Completed
entitlements survive later invalidation. Membership exchanges can invalidate
participating crews and propagate invalidity to recipients; clean, unused crews
can exchange members. Fresh Adalian recruitment and roster reordering are allowed;
Arvadian initialization invalidates eligibility.

### Mission storage decoding

`Mission.getLifecyclePath(assignment)` and
`Mission.getEvidencePath({ campaign, subject }, slot)` return unhashed `Mission`
component paths as arrays of `bigint`, suitable for `ReadComponent`. Evidence is
shared by the campaign and subject, independent of the assignment's mission ID.

`Mission.getPath({ type, ...fields })` also builds these explicit path shapes:

| Type | Fields |
| --- | --- |
| `Lifecycle` | `campaign`, `subject`, `page` |
| `Evidence` | `campaign`, `subject`, `slot` |
| `Definition`, `DefinitionCount` | `campaign` |
| `ExecutionLock` | None |
| `StarterInvalid`, `StarterParticipated` | `subject` |

`Mission.parsePath(path)` reverses those paths. It returns `null` for an unknown
prefix and throws for a malformed known path. Campaigns, slots, and subject IDs
remain `bigint`; subject labels and lifecycle page numbers are numbers.
It accepts numeric, decimal-string, or hex-string path elements. Large values
must be strings or `bigint`; unsafe JavaScript numbers are rejected.

```js
const lifecyclePath = Mission.getLifecyclePath(assignment);
const lifecycle = Mission.unpackLifecycle(lifecycleValue, assignment.mission);
// { accepted: boolean, completed: boolean, claimed: boolean }

const progressPath = Mission.getEvidencePath(
  assignment, StarterMission.EVIDENCE_SLOTS.PROGRESS
);
const progress = StarterMission.unpackProgress(progressValue);
// { earned: boolean[8], sampleCount: number, upstreamRoutes: boolean[5] }

const foodSlot = StarterMission.getFinalProductSlot(Product.IDS.FOOD); // 101n
const recordedProducts = StarterMission.unpackFinalProducts(foodBitmapValue, foodSlot);
// bigint product IDs from this word only, including any recorded secondary outputs
```

Lifecycle pages cover 32 missions: accepted bits 0–31, completed bits 32–63,
claimed bits 64–95. Pass the word from the mission's page to `unpackLifecycle`.
Starter progress uses evidence slot 0: earned bits 0–7, sample count bits 8–9,
and upstream-route bits 10–14. Earned flags are evidence, not lifecycle completion;
upstream-route flags indicate stage 1 evidence, not completion of both stages.
Slot 1 contains the campaign Warehouse ID. Final-product slots start at 100,
with 128 product IDs per word (`100 + floor(productId / 128)`).
Decoders accept unsigned 128-bit words and ignore unrelated bits. Supply zero
explicitly when a component is absent; missing data is not silently treated as zero.

`StarterMission.getInvalidPath(crewId)` and `getParticipatedPath(crewId)` build
crew-global paths, which have no campaign element. Eligibility can be checked
against explicitly supplied configuration and current crew state:

```js
const eligible = StarterMission.isEligible({
  campaign: config.STARTER_MISSION_CAMPAIGN,
  cutoff: config.STARTER_MISSION_CUTOFF,
  crewId,
  roster: crew.roster,
  invalidated: invalidationValue // boolean or raw component value; any nonzero value invalidates
});
```

An enabled campaign, crew ID strictly above the cutoff, nonempty roster, and no
invalidation are all required. This helper does not infer contamination from
roster history or check caller authorization. Do not use current eligibility to
gate claiming an already-completed entitlement: those survive invalidation.
The server remains responsible for fetching state, event ordering, and persistence.
