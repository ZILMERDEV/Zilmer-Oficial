#!/usr/bin/env node
/**
 * relate-area-images.js
 *
 * Copies transformer images from a source folder into the correct
 * public/images/areas/<category>/ subfolder.
 *
 * Usage:
 *   node relate-area-images.js <source-folder> [--dry-run]
 *
 * Two input modes (detected automatically):
 *
 *   FOLDER MODE – source contains subfolders named after area slugs:
 *     input/
 *       hidreletrica/   transformer-1.jpg
 *       transporte/     transformer-2.webp
 *     All images inside each area subfolder are copied to the matching
 *     destination category.
 *
 *   FLAT MODE – source is a flat folder of image files:
 *     input/
 *       hidreletrica-transformer.jpg   ← matched by filename keyword
 *       solar-panel-transformer.webp   ← matched by keyword "solar"
 *       unknown.jpg                    ← skipped (no match)
 *     Filenames are scanned for keywords associated with each area.
 *
 * Conflict resolution:
 *   If a file with the same name already exists in the destination,
 *   a numeric suffix is appended automatically: image.jpg → image-2.jpg
 *
 * Options:
 *   --dry-run   Preview what would happen without copying any files.
 */

'use strict';

const fs   = require('fs');
const path = require('path');

// ── Configuration ────────────────────────────────────────────────────────────

const AREAS = {
  'energias-renovaveis': [
    'energias-renovaveis', 'energias_renovaveis', 'renovavel', 'renovaveis',
    'solar', 'eolica', 'eolico', 'renewable', 'wind', 'fotovoltaico', 'pv',
  ],
  'transporte': [
    'transporte', 'transport', 'metro', 'metrô', 'ferroviario', 'trem',
    'ferrovia', 'traction', 'tracao', 'retificador',
  ],
  'hidreletrica': [
    'hidreletrica', 'hidrelétrica', 'hidro', 'hydro', 'usina', 'barragem',
    'excitacao', 'excitação', 'geracao', 'geração',
  ],
  'mineracao': [
    'mineracao', 'mineração', 'minera', 'mining', 'mina', 'britador',
    'britagem', 'ip54', 'ip-54',
  ],
  'subestacoes': [
    'subestacoes', 'subestações', 'subestacao', 'subestação', 'substation',
    'sub', 'zigzag', 'zig-zag', 'aterramento',
  ],
  'controle-medicao': [
    'controle-medicao', 'controle_medicao', 'controle', 'medicao', 'medição',
    'measurement', 'tc', 'tp', 'instrumento',
  ],
};

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif', '.tiff', '.bmp']);

// ── Helpers ──────────────────────────────────────────────────────────────────

function isImage(filename) {
  return IMAGE_EXTS.has(path.extname(filename).toLowerCase());
}

/** Return the area slug whose keywords appear in the filename, or null. */
function matchAreaByFilename(filename) {
  const lower = filename.toLowerCase();
  for (const [area, keywords] of Object.entries(AREAS)) {
    for (const kw of keywords) {
      if (lower.includes(kw)) return area;
    }
  }
  return null;
}

/**
 * Resolve a destination path that does not conflict with existing files.
 * If <destDir>/<filename> exists, tries <base>-2<ext>, <base>-3<ext>, …
 */
function resolveDestPath(destDir, filename) {
  const ext  = path.extname(filename);
  const base = path.basename(filename, ext);
  let candidate = path.join(destDir, filename);
  let suffix = 2;
  while (fs.existsSync(candidate)) {
    candidate = path.join(destDir, `${base}-${suffix}${ext}`);
    suffix++;
  }
  return candidate;
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ── Argument parsing ─────────────────────────────────────────────────────────

const args    = process.argv.slice(2).filter(a => a !== '--dry-run');
const dryRun  = process.argv.includes('--dry-run');
const sourceArg = args[0] || './images-to-add';

const SOURCE_DIR  = path.resolve(sourceArg);
const PROJECT_ROOT = path.resolve(__dirname);
const AREAS_BASE  = path.join(PROJECT_ROOT, 'public', 'images', 'areas');

// ── Validation ───────────────────────────────────────────────────────────────

if (!fs.existsSync(SOURCE_DIR)) {
  console.error(`\n  Error: source folder not found: ${SOURCE_DIR}`);
  console.error(`  Usage: node relate-area-images.js <source-folder> [--dry-run]\n`);
  process.exit(1);
}

if (!fs.existsSync(AREAS_BASE)) {
  console.error(`\n  Error: areas base folder not found: ${AREAS_BASE}`);
  console.error(`  Make sure you are running this script from the project root.\n`);
  process.exit(1);
}

// ── State ────────────────────────────────────────────────────────────────────

/** { [area]: [ { src, dest, renamed } ] } */
const copied  = Object.fromEntries(Object.keys(AREAS).map(a => [a, []]));
/** [ { filename, reason } ] */
const skipped = [];

// ── Main logic ───────────────────────────────────────────────────────────────

console.log(`\n  relate-area-images${dryRun ? ' (DRY RUN)' : ''}`);
console.log(`  Source : ${SOURCE_DIR}`);
console.log(`  Target : ${AREAS_BASE}\n`);

const topEntries = fs.readdirSync(SOURCE_DIR);

// Detect whether any top-level entry is a known area subfolder → FOLDER MODE
const folderModeAreas = topEntries.filter(e => {
  const p = path.join(SOURCE_DIR, e);
  return fs.statSync(p).isDirectory() && AREAS[e];
});

const useFolderMode = folderModeAreas.length > 0;
console.log(`  Mode   : ${useFolderMode ? 'FOLDER (subfolders named by area)' : 'FLAT (keyword matching by filename)'}\n`);

if (useFolderMode) {
  // ── FOLDER MODE ────────────────────────────────────────────────────────────
  for (const areaName of folderModeAreas) {
    const srcAreaDir  = path.join(SOURCE_DIR, areaName);
    const destAreaDir = path.join(AREAS_BASE, areaName);

    const images = fs.readdirSync(srcAreaDir).filter(isImage);
    if (images.length === 0) continue;

    if (!dryRun) fs.mkdirSync(destAreaDir, { recursive: true });

    for (const img of images) {
      const src  = path.join(srcAreaDir, img);
      const dest = resolveDestPath(destAreaDir, img);
      const renamed = path.basename(dest) !== img;

      if (!dryRun) fs.copyFileSync(src, dest);

      const size = fs.statSync(src).size;
      copied[areaName].push({ src, dest, renamed, size });
    }
  }

  // Images in the source root that are NOT in an area folder → skipped
  const rootImages = topEntries.filter(e => {
    const p = path.join(SOURCE_DIR, e);
    return fs.statSync(p).isFile() && isImage(e);
  });
  for (const img of rootImages) {
    skipped.push({ filename: img, reason: 'file in source root (not inside an area subfolder)' });
  }

  // Unknown subfolders → skipped
  const unknownDirs = topEntries.filter(e => {
    const p = path.join(SOURCE_DIR, e);
    return fs.statSync(p).isDirectory() && !AREAS[e];
  });
  for (const dir of unknownDirs) {
    skipped.push({ filename: `${dir}/`, reason: `folder name does not match any area slug` });
  }

} else {
  // ── FLAT MODE ──────────────────────────────────────────────────────────────
  const images = topEntries.filter(e => {
    const p = path.join(SOURCE_DIR, e);
    return fs.statSync(p).isFile() && isImage(e);
  });

  for (const img of images) {
    const area = matchAreaByFilename(img);
    if (!area) {
      skipped.push({ filename: img, reason: 'no keyword match found for any area' });
      continue;
    }

    const src         = path.join(SOURCE_DIR, img);
    const destAreaDir = path.join(AREAS_BASE, area);
    const dest        = resolveDestPath(destAreaDir, img);
    const renamed     = path.basename(dest) !== img;

    if (!dryRun) {
      fs.mkdirSync(destAreaDir, { recursive: true });
      fs.copyFileSync(src, dest);
    }

    const size = fs.statSync(src).size;
    copied[area].push({ src, dest, renamed, size });
  }

  // Non-image files → skipped
  const nonImages = topEntries.filter(e => {
    const p = path.join(SOURCE_DIR, e);
    return fs.statSync(p).isFile() && !isImage(e);
  });
  for (const f of nonImages) {
    skipped.push({ filename: f, reason: 'not a recognised image extension' });
  }

  // Any subdirectories in flat mode → skipped (not area folders)
  const dirs = topEntries.filter(e => {
    const p = path.join(SOURCE_DIR, e);
    return fs.statSync(p).isDirectory();
  });
  for (const d of dirs) {
    skipped.push({ filename: `${d}/`, reason: 'subdirectory ignored in flat mode — use folder mode instead' });
  }
}

// ── Summary ──────────────────────────────────────────────────────────────────

const RESET  = '\x1b[0m';
const BOLD   = '\x1b[1m';
const GREEN  = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED    = '\x1b[31m';
const CYAN   = '\x1b[36m';
const DIM    = '\x1b[2m';

console.log(`${BOLD}════════════════════════════════════════${RESET}`);
console.log(`${BOLD}  Summary${dryRun ? ' (DRY RUN — nothing was written)' : ''}${RESET}`);
console.log(`${BOLD}════════════════════════════════════════${RESET}\n`);

let totalCopied = 0;

for (const [area, files] of Object.entries(copied)) {
  if (files.length === 0) continue;
  const totalSize = files.reduce((s, f) => s + f.size, 0);
  console.log(`${GREEN}${BOLD}  ${area}${RESET}  ${DIM}(${files.length} file${files.length !== 1 ? 's' : ''}, ${formatBytes(totalSize)})${RESET}`);
  for (const { dest, renamed, size } of files) {
    const destRel = path.relative(PROJECT_ROOT, dest);
    const tag     = renamed ? `${YELLOW} [renamed]${RESET}` : '';
    console.log(`    ${GREEN}✓${RESET} ${destRel}${tag}  ${DIM}${formatBytes(size)}${RESET}`);
  }
  console.log();
  totalCopied += files.length;
}

if (totalCopied === 0) {
  console.log(`  ${YELLOW}No images were copied.${RESET}\n`);
}

if (skipped.length > 0) {
  console.log(`${RED}${BOLD}  Skipped (${skipped.length})${RESET}`);
  for (const { filename, reason } of skipped) {
    console.log(`    ${RED}✗${RESET} ${filename}  ${DIM}— ${reason}${RESET}`);
  }
  console.log();
}

console.log(`${BOLD}  Total copied : ${GREEN}${totalCopied}${RESET}`);
console.log(`${BOLD}  Total skipped: ${skipped.length > 0 ? RED : DIM}${skipped.length}${RESET}`);
console.log();
