import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';

import Building from '../../../src/lib/building.js';
import Product from '../../../src/lib/product.js';
import Ship from '../../../src/lib/ship.js';

const VERSION_DEFAULT = 'v1';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SDK_ROOT = path.resolve(__dirname, '../../..');
const IMAGE_ROOT = path.join(SDK_ROOT, 'assets/images');
const RAW_ROOT = path.join(IMAGE_ROOT, 'raw');
const DEST_ROOT = path.join(SDK_ROOT, 'tmp/ipfs-image-assets/assets/images');
const FLAT_ROOT = path.join(SDK_ROOT, 'tmp/ipfs-image-assets-flat/assets/images');
const MANIFEST_ROOT = path.join(IMAGE_ROOT, 'manifests');
const IPFS_PATH = path.join(SDK_ROOT, 'tmp/ipfs-cid-repo');

const parseArgs = () => {
  const args = process.argv.slice(2);
  const options = {
    clean: false,
    version: VERSION_DEFAULT
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--clean') {
      options.clean = true;
    } else if (arg === '--version') {
      options.version = args[i + 1];
      i += 1;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (!/^v\d+$/.test(options.version)) {
    throw new Error(`Version must look like v1, v2, etc. Received: ${options.version}`);
  }

  return options;
};

const ensureDir = (dir) => fs.mkdirSync(dir, { recursive: true });

const removeDir = (dir) => {
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
};

const walkFiles = (dir, predicate = () => true) => {
  if (!fs.existsSync(dir)) throw new Error(`Missing directory: ${dir}`);

  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walkFiles(full, predicate));
    } else if (entry.isFile() && predicate(full)) {
      out.push(full);
    }
  }
  return out.sort();
};

const writeJson = (file, value) => {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
};

const copyFile = (src, relativeDest, transform) => {
  const dest = path.join(DEST_ROOT, relativeDest);
  ensureDir(path.dirname(dest));
  if (transform) {
    transform(src, dest);
  } else {
    fs.copyFileSync(src, dest);
  }
  return dest;
};

const resizePng = (src, dest, width) => {
  execFileSync('sips', ['--resampleWidth', String(width), src, '--out', dest], {
    stdio: 'ignore'
  });
};

const human = (bytes) => {
  if (bytes > 1024 ** 3) return `${(bytes / 1024 ** 3).toFixed(2)} GiB`;
  if (bytes > 1024 ** 2) return `${(bytes / 1024 ** 2).toFixed(2)} MiB`;
  if (bytes > 1024) return `${(bytes / 1024).toFixed(1)} KiB`;
  return `${bytes} B`;
};

const slug = (assetName) => (assetName || '').replace(/[^a-z]/ig, '');

const sdkEntries = (types) => Object.entries(types)
  .filter(([, value]) => value && value.name)
  .map(([id, value]) => ({ id: Number(value.i ?? id), name: value.name }))
  .sort((a, b) => a.id - b.id);

const insertVersion = (fileName, version) => {
  const ext = path.extname(fileName);
  const base = path.basename(fileName, ext);
  if (base.endsWith(`.${version}`)) return fileName;
  return `${base}.${version}${ext}`;
};

const normalizeSpriteName = (fileName, version) => {
  const ext = path.extname(fileName);
  const base = path.basename(fileName, ext);
  const normalized = base
    .replace(/-v\d+-250w$/, '.250w')
    .replace(/-v\d+-150w$/, '.150w');
  return `${normalized}.${version}${ext}`;
};

const unversionedName = (versionedName, version) => {
  const ext = path.extname(versionedName);
  const base = path.basename(versionedName, ext);
  return `${base.replace(new RegExp(`\\.${version}$`), '')}${ext}`;
};

const relativeKey = (parts) => path.join(...parts).replaceAll(path.sep, '/');

const makeEntry = ({ file, pathFromRoot, key, kind, extra = {} }) => ({
  key: key.replaceAll(path.sep, '/'),
  path: pathFromRoot.replaceAll(path.sep, '/'),
  version: extra.version,
  bytes: fs.statSync(file).size,
  kind,
  ...extra
});

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));

const flatObjectName = (entry) => `${entry.cid}${path.extname(entry.path)}`;

const flatStorageKey = (entry) => relativeKey([
  'assets/images',
  'objects',
  flatObjectName(entry)
]);

const sourceFile = (...parts) => {
  const file = path.join(RAW_ROOT, ...parts);
  if (!fs.existsSync(file)) throw new Error(`Missing raw source: ${file}`);
  return file;
};

const sourceIcon = ({ category, folder, name, append = '' }) => sourceFile(
  category,
  folder,
  `${slug(name)}${append}.png`
);

const buildSpriteAssets = ({ version }) => {
  const entries = [];
  const spriteSheets = [
    {
      family: 'crewmates',
      size: '250w',
      sourceDir: path.join(RAW_ROOT, 'crewmates/sprites/250w'),
      atlasDir: path.join(RAW_ROOT, 'crewmates/atlases')
    },
    {
      family: 'resources',
      size: '250w',
      sourceDir: path.join(RAW_ROOT, 'resources/sprites/250w'),
      atlasDir: path.join(RAW_ROOT, 'resources/atlases')
    },
    {
      family: 'buildings',
      size: '150w',
      sourceDir: path.join(RAW_ROOT, 'buildings/sprites/150w'),
      atlasDir: path.join(RAW_ROOT, 'buildings/atlases')
    },
    {
      family: 'ships',
      size: '150w',
      sourceDir: path.join(RAW_ROOT, 'ships/sprites/150w'),
      atlasDir: path.join(RAW_ROOT, 'ships/atlases')
    }
  ];

  const spriteImageByLegacyName = new Map();
  for (const group of spriteSheets) {
    for (const file of walkFiles(group.sourceDir, (candidate) => candidate.endsWith('.png'))) {
      const name = normalizeSpriteName(path.basename(file), version);
      const relative = relativeKey(['sprites', group.family, group.size, name]);
      const dest = copyFile(file, relative);
      spriteImageByLegacyName.set(path.basename(file), relative);
      entries.push(makeEntry({
        file: dest,
        pathFromRoot: relative,
        key: relativeKey(['sprites', group.family, group.size, unversionedName(name, version)]),
        kind: 'sprite-sheet',
        extra: { version, family: group.family, size: group.size }
      }));
    }

    for (const atlasFile of walkFiles(group.atlasDir, (candidate) => candidate.endsWith('.json'))) {
      const atlas = readJson(atlasFile);
      const imagePath = spriteImageByLegacyName.get(atlas.image);
      if (!imagePath) throw new Error(`No versioned sprite image found for ${atlas.image}`);

      const atlasName = normalizeSpriteName(path.basename(atlasFile), version);
      const outputRelative = relativeKey(['sprites/atlases', group.family, atlasName]);
      const atlasImageName = path.basename(imagePath);
      const dest = copyFile(atlasFile, outputRelative, (_src, output) => writeJson(output, {
        ...atlas,
        name: path.basename(atlasImageName, path.extname(atlasImageName)),
        version,
        image: atlasImageName,
        imagePath,
        legacyImage: atlas.image
      }));

      entries.push(makeEntry({
        file: dest,
        pathFromRoot: outputRelative,
        key: relativeKey(['sprites/atlases', group.family, unversionedName(atlasName, version)]),
        kind: 'atlas',
        extra: { version, imagePath }
      }));
    }
  }

  return entries;
};

const iconJob = ({ kind, id, name, width, source, destPrefix, suffix = '' }) => {
  const fileName = `${id}-${slug(name)}${suffix}.png`;
  return {
    kind,
    id,
    name,
    width,
    source,
    relative: relativeKey([destPrefix, `w${width}`, fileName])
  };
};

const buildIconAssets = ({ version }) => {
  const jobs = [];

  for (const building of sdkEntries(Building.TYPES)) {
    for (const width of [400, 1000]) {
      jobs.push(iconJob({
        kind: 'building-icon',
        id: building.id,
        name: building.name,
        width,
        source: sourceIcon({ category: 'buildings', folder: 'icons', name: building.name }),
        destPrefix: 'icons/buildings'
      }));

      if (building.id > 0) {
        jobs.push(iconJob({
          kind: 'building-site-icon',
          id: building.id,
          name: building.name,
          width,
          source: sourceIcon({ category: 'buildings', folder: 'site-icons', name: building.name, append: '_Site' }),
          destPrefix: 'icons/buildings-site',
          suffix: '-site'
        }));
      }
    }
  }

  for (const ship of sdkEntries(Ship.TYPES)) {
    jobs.push(iconJob({
      kind: 'ship-icon',
      id: ship.id,
      name: ship.name,
      width: 400,
      source: sourceIcon({ category: 'ships', folder: 'icons', name: ship.name }),
      destPrefix: 'icons/ships'
    }));
    jobs.push(iconJob({
      kind: 'ship-holo-icon',
      id: ship.id,
      name: ship.name,
      width: 400,
      source: sourceIcon({ category: 'ships', folder: 'holo-icons', name: ship.name, append: '_Holo' }),
      destPrefix: 'icons/ships-holo',
      suffix: '-holo'
    }));

    const lotShipSource = path.join(RAW_ROOT, 'ships/lot-icons', `${slug(ship.name)}.png`);
    jobs.push(iconJob({
      kind: 'lot-ship-icon',
      id: ship.id,
      name: ship.name,
      width: 400,
      source: fs.existsSync(lotShipSource)
        ? lotShipSource
        : sourceIcon({ category: 'ships', folder: 'icons', name: ship.name }),
      destPrefix: 'icons/lot-ships'
    }));
  }

  for (const product of sdkEntries(Product.TYPES)) {
    jobs.push(iconJob({
      kind: 'resource-icon',
      id: product.id,
      name: product.name,
      width: 400,
      source: sourceIcon({ category: 'resources', folder: 'icons', name: product.name }),
      destPrefix: 'icons/resources'
    }));
  }

  return jobs.map((job) => {
    const versionedRelative = relativeKey([
      path.dirname(job.relative),
      insertVersion(path.basename(job.relative), version)
    ]);
    const dest = copyFile(job.source, versionedRelative, (src, output) => resizePng(src, output, job.width));
    return makeEntry({
      file: dest,
      pathFromRoot: versionedRelative,
      key: job.relative,
      kind: job.kind,
      extra: {
        version,
        id: job.id,
        name: job.name,
        width: job.width
      }
    });
  });
};

const copyTreeVersioned = ({ source, destPrefix, version, kind }) => {
  const entries = [];
  for (const file of walkFiles(source)) {
    const sourceRelative = path.relative(source, file);
    const versionedRelative = relativeKey([
      destPrefix,
      path.dirname(sourceRelative),
      insertVersion(path.basename(sourceRelative), version)
    ]);
    const dest = copyFile(file, versionedRelative);
    const key = relativeKey([
      destPrefix,
      path.dirname(sourceRelative),
      unversionedName(path.basename(versionedRelative), version)
    ]);
    entries.push(makeEntry({
      file: dest,
      pathFromRoot: versionedRelative,
      key,
      kind,
      extra: { version }
    }));
  }
  return entries;
};

const buildCompositorAssets = ({ version }) => {
  const entries = [];
  const crewmateRoot = path.join(RAW_ROOT, 'crewmates/compositor');

  for (const file of walkFiles(crewmateRoot, (candidate) => candidate.endsWith('.png'))) {
    const sourceRelative = path.relative(crewmateRoot, file);
    const versionedRelative = relativeKey([
      'compositor/mid/crewmates/400w',
      path.dirname(sourceRelative),
      insertVersion(path.basename(sourceRelative), version)
    ]);
    const dest = copyFile(file, versionedRelative, (src, output) => resizePng(src, output, 400));
    const key = relativeKey([
      'compositor/mid/crewmates/400w',
      path.dirname(sourceRelative),
      unversionedName(path.basename(versionedRelative), version)
    ]);
    entries.push(makeEntry({
      file: dest,
      pathFromRoot: versionedRelative,
      key,
      kind: 'compositor-mid',
      extra: { version, width: 400 }
    }));
  }

  const compositorSources = [
    ['asteroids/compositor', 'compositor/full/asteroids'],
    ['crewmates/compositor', 'compositor/full/crewmates'],
    ['ships/compositor', 'compositor/full/ships'],
    ['shared/card', 'compositor/full/shared']
  ];

  for (const [source, destPrefix] of compositorSources) {
    entries.push(...copyTreeVersioned({
      source: path.join(RAW_ROOT, source),
      destPrefix,
      version,
      kind: 'compositor-full'
    }));
  }

  return entries;
};

const computeCids = (entries) => {
  ensureIpfsRepo();

  const files = entries.map((entry) => path.join(DEST_ROOT, entry.path));
  const cidByPath = new Map();

  files.forEach((file, index) => {
    const output = execFileSync('ipfs', [
      'add',
      '--only-hash',
      '--cid-version=0',
      '--pin=false',
      '-Q',
      file
    ], {
      encoding: 'utf8',
      env: { ...process.env, IPFS_PATH }
    }).trim();

    if (!output) throw new Error(`Missing CID output for ${file}`);
    cidByPath.set(path.resolve(file), output);
    if ((index + 1) % 250 === 0 || index + 1 === files.length) {
      console.log(`CID ${index + 1}/${files.length}`);
    }
  });

  return entries.map((entry) => {
    const file = path.join(DEST_ROOT, entry.path);
    const cid = cidByPath.get(path.resolve(file));
    if (!cid) throw new Error(`Missing CID for ${file}`);
    return { ...entry, cid };
  });
};

const ensureIpfsRepo = () => {
  if (fs.existsSync(path.join(IPFS_PATH, 'config'))) return;
  ensureDir(IPFS_PATH);
  execFileSync('ipfs', ['init'], {
    encoding: 'utf8',
    env: { ...process.env, IPFS_PATH },
    stdio: 'ignore'
  });
};

const summarize = (entries) => {
  const totalBytes = entries.reduce((sum, entry) => sum + entry.bytes, 0);
  const byKind = entries.reduce((acc, entry) => {
    acc[entry.kind] ||= { files: 0, bytes: 0 };
    acc[entry.kind].files += 1;
    acc[entry.kind].bytes += entry.bytes;
    return acc;
  }, {});

  for (const stats of Object.values(byKind)) {
    stats.size = human(stats.bytes);
  }

  return {
    total: {
      files: entries.length,
      bytes: totalBytes,
      size: human(totalBytes)
    },
    byKind
  };
};

const writeFlatPayload = ({ entries }) => {
  const objectsRoot = path.join(FLAT_ROOT, 'objects');
  ensureDir(objectsRoot);

  const copied = new Set();
  for (const entry of entries) {
    const objectName = flatObjectName(entry);
    if (copied.has(objectName)) continue;

    fs.copyFileSync(
      path.join(DEST_ROOT, entry.path),
      path.join(objectsRoot, objectName)
    );
    copied.add(objectName);
  }

  return {
    objects: copied.size,
    path: path.relative(SDK_ROOT, FLAT_ROOT).replaceAll(path.sep, '/')
  };
};

const main = () => {
  const options = parseArgs();
  if (options.clean) {
    removeDir(DEST_ROOT);
    removeDir(FLAT_ROOT);
  }
  if (fs.existsSync(DEST_ROOT)) {
    throw new Error(`${DEST_ROOT} already exists. Pass --clean to rebuild it.`);
  }
  if (fs.existsSync(FLAT_ROOT)) {
    throw new Error(`${FLAT_ROOT} already exists. Pass --clean to rebuild it.`);
  }

  ensureDir(DEST_ROOT);
  ensureDir(FLAT_ROOT);

  const entriesWithoutCids = [
    ...buildSpriteAssets(options),
    ...buildIconAssets(options),
    ...buildCompositorAssets(options)
  ];
  const entries = computeCids(entriesWithoutCids).map((entry) => ({
    ...entry,
    storageKey: flatStorageKey(entry)
  }));
  const summary = summarize(entries);
  const generatedAt = new Date().toISOString();
  const latest = {
    version: options.version,
    manifest: `manifests/images.${options.version}.json`,
    generatedAt
  };

  const manifest = {
    name: 'influence-images',
    version: options.version,
    uploadPrefix: 'assets/images',
    uploadLayout: {
      type: 'content-addressed-flat',
      prefix: 'assets/images',
      objectsPrefix: 'assets/images/objects',
      manifestsPrefix: 'assets/images/manifests',
      manifest: `assets/images/manifests/images.${options.version}.json`,
      latest: 'assets/images/manifests/latest.json'
    },
    generatedAt,
    generatedBy: 'assets/images/tools/build-images.js',
    cidImporter: {
      command: 'ipfs add',
      onlyHash: true,
      cidVersion: 0
    },
    ...summary,
    assets: Object.fromEntries(entries.map((entry) => [entry.key, entry]))
  };

  writeJson(path.join(MANIFEST_ROOT, `images.${options.version}.json`), manifest);
  writeJson(path.join(MANIFEST_ROOT, 'latest.json'), latest);
  const flat = writeFlatPayload({
    entries
  });

  fs.writeFileSync(path.join(DEST_ROOT, 'README.md'), [
    '# Influence Image Assets',
    '',
    'Generated payload for Filebase/IPFS upload.',
    '',
    'Files in this directory are generated from SDK-owned raw assets. Do not commit this payload; commit the source assets and manifests instead.',
    ''
  ].join('\n'));

  console.log(`Wrote ${DEST_ROOT}`);
  console.log(`Wrote ${flat.objects} upload objects to ${flat.path}`);
  console.log(`${summary.total.files} files, ${summary.total.size}`);
  console.table(summary.byKind);
};

main();
