# Influence Image Assets

This tree contains the SDK-owned source inputs and release manifests for generated image payloads.

- `raw/`: type-first raw source assets used by the image build.
- `tools/`: local build tooling. Run `npm run images:build` from the SDK root.
- `manifests/`: checked-in release manifests with per-file IPFS CIDs.

Generated QA payloads are written to `tmp/ipfs-image-assets/assets/images`.
Filebase upload payloads are written to `tmp/ipfs-image-assets-flat/assets/images`.
Both generated payloads are intentionally ignored by git and npm packaging.
