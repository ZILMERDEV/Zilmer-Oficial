#!/usr/bin/env node
/**
 * Screenshot the site at mobile (and other) viewports, using the machine's
 * already-installed Chrome/Edge instead of downloading a Playwright browser
 * (useful on networks that block the Playwright CDN).
 *
 * Requires the dev server already running (npm run dev).
 *
 * Usage:
 *   node scripts/mobile-screenshot.js [paths] [options]
 *
 * Options:
 *   --paths <p1,p2>     comma-separated URL paths (default: /pt)
 *   --devices <d1,d2>   comma-separated device keys, see DEVICE_PRESETS below
 *                        (default: iphone-12)
 *   --base <url>        base URL (default: http://localhost:3000)
 *   --out <dir>         output directory (default: scripts/screenshots)
 *   --click <selector>  click this selector before taking the screenshot
 *   --wait <selector>   wait for this selector before taking the screenshot
 *   --viewport-only     screenshot just the viewport instead of the full page
 *
 * Examples:
 *   node scripts/mobile-screenshot.js /pt
 *   node scripts/mobile-screenshot.js --paths /pt,/pt/produtos --devices iphone-se,iphone-12,ipad-mini
 *   node scripts/mobile-screenshot.js /pt --click "[aria-label='Toggle menu']" --wait text=CONTATO
 */
const path = require('path')
const fs = require('fs')
const { chromium, devices } = require('playwright-core')

const DEVICE_PRESETS = {
  'iphone-se': 'iPhone SE',
  'iphone-12': 'iPhone 12',
  'iphone-14-pro-max': 'iPhone 14 Pro Max',
  'pixel-5': 'Pixel 5',
  'ipad-mini': 'iPad Mini',
}

function findSystemBrowser() {
  const candidates = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  ]
  return candidates.find((p) => fs.existsSync(p))
}

function parseArgs(argv) {
  const args = {
    paths: ['/pt'],
    devices: ['iphone-12'],
    base: 'http://localhost:3000',
    out: path.join(__dirname, 'screenshots'),
    fullPage: true,
    clicks: [],
    wait: null,
  }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--paths') args.paths = argv[++i].split(',')
    else if (a === '--devices') args.devices = argv[++i].split(',')
    else if (a === '--base') args.base = argv[++i]
    else if (a === '--out') args.out = argv[++i]
    else if (a === '--click') args.clicks.push(argv[++i])
    else if (a === '--wait') args.wait = argv[++i]
    else if (a === '--viewport-only') args.fullPage = false
    else if (!a.startsWith('--')) args.paths = [a]
  }
  return args
}

function slug(p) {
  return p.replace(/^\//, '').replace(/[^a-z0-9]+/gi, '-').replace(/(^-|-$)/g, '') || 'home'
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const executablePath = findSystemBrowser()
  if (!executablePath) {
    console.error('No system Chrome/Edge found at the usual install paths.')
    console.error('Either install one, or run: npx playwright install chromium')
    process.exit(1)
  }

  fs.mkdirSync(args.out, { recursive: true })

  const browser = await chromium.launch({ executablePath, headless: true })
  let hadErrors = false

  for (const deviceKey of args.devices) {
    const presetName = DEVICE_PRESETS[deviceKey]
    if (!presetName || !devices[presetName]) {
      console.error(`Unknown device "${deviceKey}". Available: ${Object.keys(DEVICE_PRESETS).join(', ')}`)
      continue
    }
    const context = await browser.newContext({ ...devices[presetName] })

    for (const p of args.paths) {
      const page = await context.newPage()
      const consoleErrors = []
      page.on('console', (msg) => { if (msg.type() === 'error') consoleErrors.push(msg.text()) })
      page.on('pageerror', (err) => consoleErrors.push(String(err)))

      const url = args.base.replace(/\/$/, '') + p
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })

      if (args.wait) {
        await page.waitForSelector(args.wait, { timeout: 10000 }).catch((e) => {
          console.warn(`  ! wait for "${args.wait}" failed: ${e.message}`)
        })
      }
      const hasTouch = devices[presetName].hasTouch
      for (const selector of args.clicks) {
        const action = hasTouch
          ? page.tap(selector, { timeout: 5000 })
          : page.click(selector, { timeout: 5000 })
        await action.catch((e) => {
          console.warn(`  ! ${hasTouch ? 'tap' : 'click'} "${selector}" failed: ${e.message}`)
        })
        await page.waitForTimeout(400) // let CSS transitions settle
      }

      const file = path.join(args.out, `${deviceKey}__${slug(p)}${args.clicks.length ? '__clicked' : ''}.png`)
      await page.screenshot({ path: file, fullPage: args.fullPage })

      console.log(`saved ${file}`)
      if (consoleErrors.length) {
        hadErrors = true
        console.log(`  console errors (${consoleErrors.length}):`)
        consoleErrors.forEach((e) => console.log(`    ! ${e}`))
      }
      await page.close()
    }
    await context.close()
  }

  await browser.close()
  if (hadErrors) process.exitCode = 1
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
