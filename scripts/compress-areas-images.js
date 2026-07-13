const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const AREAS_DIR = path.join(__dirname, '..', 'public', 'images', 'areas')
const DATA_FILES = [
  path.join(__dirname, '..', 'data', 'areas.json'),
  path.join(__dirname, '..', 'data', 'areas.en.json'),
]

// Returns all image files recursively
function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const files = []
  for (const e of entries) {
    const full = path.join(dir, e.name)
    if (e.isDirectory()) files.push(...walk(full))
    else if (/\.(png|jpe?g|webp)$/i.test(e.name)) files.push(full)
  }
  return files
}

async function compress(filePath) {
  const ext = path.extname(filePath).toLowerCase()
  const isPng = ext === '.png'
  const isJpeg = ext === '.jpg' || ext === '.jpeg'
  const isWebp = ext === '.webp'

  const before = fs.statSync(filePath).size
  const input = fs.readFileSync(filePath) // read fully before sharp touches anything

  if (isPng) {
    const outPath = filePath.replace(/\.png$/i, '.webp')
    const buf = await sharp(input).webp({ quality: 80 }).toBuffer()
    fs.writeFileSync(outPath, buf)
    fs.unlinkSync(filePath)
    const after = fs.statSync(outPath).size
    return { oldPath: filePath, newPath: outPath, before, after }
  }

  if (isJpeg) {
    const buf = await sharp(input).jpeg({ quality: 80, mozjpeg: true }).toBuffer()
    fs.writeFileSync(filePath, buf)
    const after = fs.statSync(filePath).size
    return { oldPath: filePath, newPath: filePath, before, after }
  }

  if (isWebp) {
    const buf = await sharp(input).webp({ quality: 80 }).toBuffer()
    fs.writeFileSync(filePath, buf)
    const after = fs.statSync(filePath).size
    return { oldPath: filePath, newPath: filePath, before, after }
  }
}

function toRelative(absPath) {
  return '/' + path.relative(path.join(__dirname, '..', 'public'), absPath).replace(/\\/g, '/')
}

async function main() {
  const files = walk(AREAS_DIR)
  console.log(`Found ${files.length} images\n`)

  let totalBefore = 0
  let totalAfter = 0
  const renames = [] // { oldRel, newRel }

  for (const f of files) {
    const result = await compress(f)
    totalBefore += result.before
    totalAfter += result.after
    const saved = result.before - result.after
    const pct = ((saved / result.before) * 100).toFixed(1)
    console.log(`${path.relative(AREAS_DIR, result.newPath || result.oldPath).padEnd(70)} ${(result.before/1024).toFixed(0).padStart(6)}K → ${(result.after/1024).toFixed(0).padStart(6)}K  (-${pct}%)`)
    if (result.oldPath !== result.newPath) {
      renames.push({ oldRel: toRelative(result.oldPath), newRel: toRelative(result.newPath) })
    }
  }

  console.log(`\nTotal: ${(totalBefore/1024/1024).toFixed(2)} MB → ${(totalAfter/1024/1024).toFixed(2)} MB  (saved ${((totalBefore-totalAfter)/1024/1024).toFixed(2)} MB)`)

  if (renames.length === 0) return

  console.log('\nUpdating JSON data files...')
  for (const dataFile of DATA_FILES) {
    if (!fs.existsSync(dataFile)) continue
    let content = fs.readFileSync(dataFile, 'utf8')
    for (const { oldRel, newRel } of renames) {
      content = content.split(oldRel).join(newRel)
    }
    fs.writeFileSync(dataFile, content, 'utf8')
    console.log(`  Updated ${path.basename(dataFile)}`)
  }
}

main().catch(err => { console.error(err); process.exit(1) })
