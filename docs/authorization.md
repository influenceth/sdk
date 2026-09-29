# Authorization contract audit and client migration

Audited on 2026-09-29 against `contracts`, HEAD **d02abf79c47cdd9b2b095a74d88b1c5d2feba1ef**, plus its existing working-tree modifications. [Source fingerprints](../test/fixtures/authorization/contracts.json) identify the exact audited files. No contracts were edited, deployed, or queried. SDK policy tests supply mocked responses.

## Contract-to-SDK mapping

Paths in this table are relative to the contracts checkout. `auth` is `Authorization.create(snapshot)`. Results describe authorization only, not complete transaction executability.

| Contract source / rule | SDK API / behavior |
| --- | --- |
| `src/common/access.cairo::controls` | `auth.controls(permitted, target)`: exact label **and** ID equality first; otherwise load permitted controller's Crew delegate, resolve target controller, compare controller entities, then delegated accounts. A CREW controls itself. Other entities require Control. NFT ownership is irrelevant. |
| `access.cairo::can` | `auth.can(permitted, target, permission)`: public → controls → entity whitelist → controller-delegate account whitelist → prepaid → external policy → deny. Public USE_LOT also grants the primitive; exclusivity is an action rule. |
| `access.cairo::can_until` | `auth.canUntil(permitted, target, permission, until)`: public → controls → entity whitelist → account whitelist → **external policy → prepaid**. External rejection ends evaluation even if prepaid would allow. External `can` receives no completion timestamp. |
| Prepaid validity | `time <= max(endTime, noticeTime + noticePeriod)`, inclusive. `can` uses evaluationTime; `canUntil` uses until. No extra start-time test. Zero noticeTime does not disable noticePeriod. Zero endTime means unset. |
| Contract agreement | Address alone never grants access. Call the agreement's policy address, not today's ContractPolicy. Zero address is unset; missing/pending/failed responses are unresolved. |
| `src/common/lot_access.cairo` | `auth.lotUsage(crew, lot)`: read UseLot tenant; if tenant currently can USE_LOT, only that exact crew qualifies. Otherwise caller's lot OR asteroid USE_LOT. No occupancy checks and no snapshot mutation. |
| `src/systems/ship/undock_ship.cairo` | `auth.forceLaunch(crew, ship)` classifies other controller crew identities, including same-wallet crews. `auth.shipProtection(ship)` uses current controller and immediate location. Surface uses lotUsage; spaceport uses controller OR ship DOCK_SHIP. `auth.shipEviction(crew, ship)` requires force classification and confirmed absence of protection. Bystanders can clean up. |
| `src/systems/ship/dock_ship.cairo` | Ship controls plus `auth.spaceportProtection(callerCrew, ship, spaceport)` for the docking-permission branch. Do not substitute asteroid USE_LOT. Surface landing prerequisites remain separate. |
| `src/systems/crew/eject_crew.cairo` | `auth.crewEviction(caller, guest)`: exact self is allowed; otherwise negate guest STATION_CREW at guest's current immediate location. No station-control assertion in current source; see decision below. |
| `src/systems/control/repossess_building.cairo` | `auth.repossession(crew, building, constructionGracePeriod)`: another active tenant blocks every caller, including planned-site cleanup after grace. Otherwise active exact tenant or asteroid controls grants access; other callers require PLANNED and now >= plannedAt + grace. Reads building's current lot. |
| `src/systems/production/process_products_start.cairo` | `auth.production({kind: 'process', crew, origin, facility, destination, completionTime})`: REMOVE_PRODUCTS now; RUN_PROCESS and destination ADD_PRODUCTS through completion. |
| `src/systems/production/extract_resource_start.cairo` | `kind: 'extract'`: USE_DEPOSIT now (pass deposit); EXTRACT_RESOURCES and destination ADD_PRODUCTS through completion. No extra origin REMOVE_PRODUCTS check. |
| `src/systems/production/assemble_ship_start.cairo` | `kind: 'assemble'`: origin REMOVE_PRODUCTS now and ASSEMBLE_SHIP through completion. No destination ADD_PRODUCTS requirement at start. |
| `src/systems/deliveries/package.cairo`, `accept.cairo` (modified) | `auth.packageDelivery(crew, origin)` = REMOVE_PRODUCTS; `auth.acceptDelivery(crew, destination)` = ADD_PRODUCTS. Neither method authorizes payment. |
| Inventory candidates | `auth.inventoryAccess(crew, targets, permission, completionTime?)` returns every target and its authorization, including unresolved candidates. Capacity, inventory status, distance, and product restrictions remain separate. |

Other inspected call sites use these same primitives: policy/whitelist administration, construction start/abandon/deconstruct, scanning and transit require controls; marketplace, recruitment, food resupply and delivery send/cancel/dump use their individual permission IDs. Production finish checks differ from start: extract/process finish do not repeat start permissions; assemble finish checks ship controls OR facility ASSEMBLE_SHIP and separately checks destination docking. Do not apply the production-start helper to finish actions. This module does not claim to implement every system's readiness and transaction preconditions.

### Evaluation and identity details

Whitelist records with `whitelisted: false` and public policies with `public: false` are unset, matching component `is_set`. Their flags can be omitted in a normalized list containing only existing components, matching existing SDK hydrated entity records. Normalize raw Cairo booleans to JavaScript booleans. Entity and account grant lists represent separate key domains; normalize accounts as felt integers or hex strings. IDs are compared with BigInt, avoiding label collisions and address-padding differences. Supply large values as strings or bigint, never unsafe JavaScript numbers.

Exact identity and controls are deliberately different: two crews with one delegated account can control the same assets, but cannot substitute for an active tenant or the piloting crew. The permitted entity can also be a ship; account grants use that ship's current controlling crew's delegate. `_siblingCrewIds` and NFT owners are never authorization evidence.

Composition is lazy and follows contract order. An unresolved earlier read stops evaluation even if a later branch could grant access: the missing read or external call may revert on chain. Inversion preserves unresolved. A missing required Crew or permitted Control that the contract would unwrap/expect is reported as `contract-component-absent`, never as a permission rejection that could enable eviction.

## Contract decisions and current local baseline

1. **The two reported defects are fixed in the current local code, which is the accepted parity target.** `SampleDepositImprove` now calls `assert_can(USE_DEPOSIT)`. `PackageDelivery` now checks REMOVE_PRODUCTS; `AcceptDelivery` checks ADD_PRODUCTS and reads/writes PrivateSale on the delivery. Existing uncommitted `deliveries/payment_tests.cairo` and its module registration exercise delivery sales. Permission-based delivery helpers match this current local checkout. These changes will stay; they are part of the baseline, not unresolved dependencies. HEAD is recorded for traceability only and is not the parity target.
2. **Payment remains separate.** Acceptance confirms the accepting transaction caller's SWAY receipt, payable to the origin's **current** controller's delegated account, using the delivery as memo and the delivery sale amount. It never spends destination-owner funds merely because the accepting crew has ADD_PRODUCTS. Zero-price sales skip receipt confirmation. SDK delivery methods cover inventory authorization only. The client must separately construct/check payment for the accepting caller, current payee, amount and memo, and simulate the transaction. No alternative seller model is assumed.
3. **can/can_until ordering differs.** This is preserved and explicitly tested. Decide in contracts whether external policy should override a valid prepaid agreement during completion checks. The SDK does not silently unify the order. An allowed canUntil for public/whitelist/control/external access is not a promise those rights cannot later change; it mirrors the check at evaluation time.
4. **EjectCrew has no caller-controls-station assertion.** The comment describes controller eviction, but implementation permits any otherwise eligible caller to eject a different crew with no STATION_CREW. `crewEviction` reflects the executable rule and is explicitly tested. Confirm permissionless cleanup is intended or add a contract assertion before adopting stricter semantics in both layers.
5. **Resolved: active tenants now block every repossession branch.** The current local contract asserts `!blocked_by_tenant` after checking asteroid controls and before selecting privileged repossession or planned-site cleanup. The SDK preserves that order and returns `denied / active-tenant-precedence` for any other crew, including a same-wallet crew or unrelated bystander, even after the construction grace period. The exact active tenant retains repossession rights. Once tenant access expires or is revoked, or tenancy is cleared, other crews may use planned-site cleanup after grace. Unknown tenant access or a required controller read remains unresolved. Regression tests cover the former bypass and these transitions; this issue is no longer an open contract decision.

Readiness remains separate: delegated transaction caller, manned crew, crew busy/emergency state, same asteroid, unpowered eviction, inventory reservations, operational buildings, capacity, station type, occupancy and planning location restrictions still need their existing checks. `allowed` here does not mean “submit without simulation.” Repossession includes planned status/grace because they select its fallback authorization branch, not because the SDK evaluates general building readiness.

## Discrepancies removed from the SDK and client guidance

The previous SDK inferred control from `_siblingCrewIds`, compared grant IDs without labels, excluded public/whitelist USE_LOT, filtered leases using a strict endTime boundary without notice extensions, treated any contract agreement as approval, and caught missing-data failures as false. Those authorization branches now delegate to the shared evaluator. Agreement path validation also now accepts DEPOSIT / USE_DEPOSIT, matching `contracts/src/systems/policies.cairo`.

The inspected client additionally used policy display status for eviction, omitted ship-specific docking grants, and treated server-filtered non-public inventory candidates as permitted. These remain client migration work: the SDK now supplies their reusable replacements; no client or server code was edited as part of this SDK change.

## Snapshot and result API

```js
import { Authorization, Permission } from '@influenceth/sdk';

const auth = Authorization.create({
  entities: [selectedCrew, target, targetControllerCrew],
  evaluationTime: blockTimestamp,
  policyResults: {} // Explicit responses from this same snapshot/block
});
const decision = auth.can(selectedCrew, target, Permission.IDS.ADD_PRODUCTS);
// { status: 'allowed' | 'denied' | 'unresolved', reason, requirements: [...] }
```

Supply one record per entity identity. Records use existing camelCase SDK component names:

- `Control: {controller: {label, id}} | null`; `Crew: {delegatedTo}`.
- `PublicPolicies: [{permission, public?}]`.
- `WhitelistAgreements: [{permission, permitted: {label, id}, whitelisted?}]`.
- `WhitelistAccountAgreements: [{permission, permitted: account, whitelisted?}]`.
- `PrepaidAgreements: [{permission, permitted: {label, id}, endTime, noticeTime, noticePeriod}]`.
- `ContractAgreements: [{permission, permitted: {label, id}, address}]`.
- For lot actions, `UseLot: {label, id} | null` is the **tenant** from Unique at `['UseLot', packedLot]`. Decode the felt; zero/unset becomes null. Do not use the **occupant** from `['LotUse', packedLot]`.
- For located actions, `Location: {location: {label, id}}` is the immediate on-chain location. Client flattened `Location.locations` arrays must be normalized to the actual immediate location, not an arbitrary lot or building ancestor.
- Repossession fallback additionally uses `Building: {status, plannedAt}`, where PLANNED = 1, and the explicit construction grace config.

Undefined/omitted means **not loaded**; null means **confirmed absent**. Empty arrays mean a complete, confirmed empty collection. Lists must be complete for the entity; do not pass a partially loaded page as an empty or complete list. Do not populate absent components with null just to silence requirements. Missing fields within required components are unresolved. These are normalized component snapshots, not arbitrary raw Cairo JSON. Malformed numbers, duplicate grant keys, unsafe numeric values and inconsistent block data are input errors, not fallback authorization modes.

`requirements` contains the first outstanding dependency along contract execution order, with a component/entity, time/config, or policy request. Resolve it and reevaluate to discover subsequent dependencies. For efficient fetching, load the potential component closure up front: subject/controller Crew, target/controller Crew, the five grant/policy collections, then tenant/lot/asteroid and current Location for the relevant action. Snapshot inputs are caller-owned; treat them as immutable during an evaluation and create a fresh evaluator after changes.

External requests include `{type: 'policy', key, address, target, permission, permitted}`. Pass a result under that exact key:

```js
const policyResults = {
  [request.key]: { status: 'resolved', allowed: true }
  // Or {status: 'resolved', allowed: false}, {status: 'pending'}, {status: 'failed'}
};
const updated = Authorization.create({ entities, evaluationTime, policyResults });
```

Use `Authorization.policyKey(request)` to construct keys independently. Keys include address, target label/ID, permission and permitted label/ID. The policy call itself is `can(target, permission, permitted)` even for canUntil. Keys do not encode chain, block, time or state version: clients MUST scope result dictionaries to the snapshot/network/block and discard stale responses. Read failure is not policy rejection. Core code has no fetching, caches, React dependencies, or implicit clock access.

`Authorization.evaluate({entities, evaluationTime, policyResults, permitted, target, permission, until?})` provides a one-call form, also exported as `Permission.evaluate`. `Permission.Authorization` aliases the same module.

## Compatibility and migration

This change preserves resolved boolean signatures, but **is not a drop-in minor release for partially hydrated clients**. Coordinate a major SDK release or a client migration before publishing.

- `Permission.isPermitted(crew, permission, target, blockTime?, options?)` delegates to the evaluator. It returns a boolean only for resolved results. Unresolved results throw `UnresolvedAuthorizationError` with `.evaluation`; this prevents existing `!isPermitted(...)` checks from treating missing data as permission to evict. Optional `options` supplies `entities` (controller/related entities), `policyResults`, and `until`. Positional crew and target records take precedence, so pass fully loaded records there. Its legacy clock default remains for compatibility; new core APIs require explicit time when consulted.
- `Permission.getPolicyDetails` / `Entity.getPolicyDetails` retain policy descriptions, agreements and allowlists. With a crew, `.authorization` contains the evaluator result and `.crewStatus` can now be `unresolved`; resolved status is `controller`, `granted`, `available` or `restricted`. Public checks precede control, so a public controller may display `granted`. Removed the misleading generic `under contract` authorization inference; use lotUsage for tenant precedence. Fifth `options` argument supplies the same snapshot extras.
- Agreement listings are presentation data. A ContractAgreement in the list is not approval. Do not compare `crewStatus` strings to authorize actions; inspect the result or call the action helper.
- `getPrepaidAgreementStatus` remains an auction/lease-payment summary based on endTime; its `isActive` is **not** the authorization validity predicate. Use can/canUntil for inclusive notice-aware permission. Auction helpers, prices and memos remain unchanged.

Inspected client call sites and replacements (relative to `client/src`):

| Client location | Migration |
| --- | --- |
| `contexts/CrewContext.js`, `lib/utils.js`, `.../actionButtons/ActionButton.js`, surface transfer buttons/dialog | Replace generic boolean convenience checks with tri-state can/canUntil; supply the full controller closure. |
| `.../actionButtons/PlanBuilding.js`, `.../hudMenus/components/PolicyPanels.js` | Use lotUsage for use rights, keep planning/occupancy and lease presentation separate. |
| `.../actionButtons/EjectShip.js` | Use forceLaunch/shipProtection/shipEviction; include ship-specific grants and current controller. Never infer permission from wallet-only equality. |
| `.../actionButtons/EjectGuestCrew.js`, `.../actionDialogs/EjectCrew.js` | Use crewEviction per guest; unresolved is not ejectable. |
| `hooks/useAccessibleAsteroidInventories.js`, `.../actionDialogs/components.js` | Treat server permission filters as candidate discovery only. Evaluate every candidate using inventoryAccess, retain unresolved candidates, then separately apply inventory feasibility filters. |
| `hooks/useAsteroidBuildings.js` | Stop querying isPermitted with `{}` as a pretend crew. For public-only display inspect public policy metadata; for authorization supply the actual subject and snapshot. |
| `simulation/useSimulationSteps.js`, policy managers and building list views | Supply explicit complete mocked snapshots in simulation; use crewStatus only for presentation and render unresolved. |

A server query which filters too narrowly can hide valid account, ship, public or external-policy access before SDK evaluation. Broaden candidate queries to a superset of physically relevant entities (or fix the server filter to guarantee that superset). Post-filtering cannot recover omitted candidates. Do not label every non-public inventory “permitted,” as the existing selector does. Keep the returned authorization and reason with each inventory row; derive controller badges using controls only when needed.

Client lifecycle:

1. Fetch a coherent snapshot at an explicit block/time, including current controllers, delegates, tenant and immediate locations. Normalize absent versus unloaded explicitly.
2. Evaluate the appropriate SDK action. Fetch missing component requirements, resolve external policy requests at that snapshot, then reevaluate. No deployment is needed for unit tests; inject mock policy results.
3. Render unresolved as checking/unknown with retry for failed reads. Disable submission and destructive actions until **allowed**. Denied is a confirmed authorization outcome, not a loading indicator.
4. Invalidate/recompute on controller/delegate changes, grants and revocations, public policy changes, agreement/notice edits, tenant clearing/change, location changes, building planned status/time, and external policy state changes. Advance block time across inclusive expiry boundaries and recalculate job completion time. Clear policy results on relevant state or block changes, even if the policy address remains the same.
5. Before submission, refresh the snapshot, resolve policies and reevaluate with the final completion time. Recheck payment separately. Retain transaction simulation and existing readiness/location/inventory checks; chain state can still change between evaluation and execution.

## Validation

`test/lib/authorization.spec.js` derives expected results from the source rules. It mirrors `access.cairo::test_whitelist_account`, `test_can_control`, `test_prepaid_agreement` (13599/13601 around 13600) and mocked `test_contract_agreement` outcomes, also matches the grant matrix in `contracts/src/test/lot_planning_permissions.cairo` and the protection/cleanup cases in `contracts/src/test/ship_eviction.cairo`, then adds equality, notice, missing-data, precedence, mutation, action, and order regression cases. Contract policy responses in SDK tests are always mocked.

The local SDK suite can be run without its unrelated remote asteroid binary test:

```sh
NODE_ENV=test ./node_modules/.bin/mocha --recursive \
  --grep 'should unpack binary asteroid details data' --invert
npm run build
```

Validation performed against the current local code:

- SDK offline unit suite: **297 passed**, including **58 authorization parity tests** and existing permission tests. The unrelated asteroid binary download test is excluded; the unrestricted test command encountered a network failure in that test.
- SDK build: passed; ESM and CommonJS Authorization exports verified.
- Changed authorization modules: ESLint passed. Repository-wide lint remains blocked by 570 existing errors and one warning, including the existing parser failure on import attributes in `src/index.js` (also reproduced against its unchanged baseline).
- Prior full local contract unit suite (before the subsequent repossession fix): **589 passed**, zero failures, using `scarb --offline cairo-test --test-kind unit` in the same temporary source copy. This includes the current delivery payment tests, lot planning and ship eviction cases. That full-suite result predates the repossession fix; see the focused revalidation below. No integration tests or deployed-contract calls were used.
- Focused current-local repossession revalidation: **14 passed**, zero failures, using `scarb --offline cairo-test --test-kind unit --filter repossess` in a fresh copy of the current local code. Includes `contracts/src/test/lot_tenancy.cairo::stranger_cannot_repossess_active_tenant_site_after_grace`, lapsed/cleared-tenancy cleanup, and inclusive expiry/notice tests. Audited source fingerprints match the original working tree and tested copy.
- Core contract authorization unit tests: **5 passed**, using `scarb --offline cairo-test --test-kind unit --filter common::access` in a temporary copy of the current local source.
- All 1,311 tracked/untracked project files and all 9 files in the release package inventory were scanned for machine-specific paths; none found. Paths in this document are project-relative.

This audit establishes parity with the identified local source and unit vectors, not with any deployment. The current local fixes are accepted baseline behavior. Open behavior decisions are called out separately rather than silently changing them in the SDK.
