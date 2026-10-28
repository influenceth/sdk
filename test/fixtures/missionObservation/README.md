# Observation reference

reference.js is an unchanged copy of influence-starknet/target/missions/missionObservation.js
from the version 2 bundle inspected on 2026-10-22. The zip and directory matched
byte-for-byte. Tests compare felt values (hex and decimal representations are equivalent).
This checks reference-builder compatibility, not on-chain execution. Contract runtime
coverage for shared future-mission evidence and later acceptance belongs in the
influence-starknet mission runtime suite.

`bundle.json` records the rebuilt manifest and SHA-256 hashes of all exported files.
The combined SDK ABI includes the observer and both campaign implementations.
Sepolia metadata verifies the local deployment cache only, not live configuration.

To run the contracts project's existing runtime tests against the built SDK, run
`npm run build` here, then from the contracts project:

```sh
STARKNET_DEVNET_BIN=/path/to/starknet-devnet node \
  --loader /path/to/sdk/test/fixtures/missionObservation/sdk-loader.mjs \
  --test test/missions/runtime.test.js test/missions/colonization.runtime.test.js
```

The loader substitutes the built SDK and its observation helpers only; all contract
artifacts, runtime scenarios, and devnet setup remain those of the contracts project.
The compiled mission runtime fixtures must already exist. Tests use isolated local
chains, not the deployed Sepolia contracts.

Validation on 2026-10-22: all three contract runtime scenarios passed with imports
redirected to SDK 2.8.0: third-party colonization, scan finish/construction start in
one transaction, and starter attribution/gameplay/payout rollback. The SDK suite
passed 317 tests; both built module formats passed the 19 Cairo fingerprint vectors
and observation/colonization export checks. All 13 manifest class hashes and ABIs
matched the compiled target/dev artifacts. Live Sepolia configuration was not checked.
