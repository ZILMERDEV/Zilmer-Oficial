#!/usr/bin/env node
/**
 * Auditoria automática de layout — acha o que o olho deixa passar.
 *
 * Detecta os três defeitos que mais aparecem neste site:
 *   1. elementos vazando para fora da viewport (texto cortado na borda)
 *   2. elementos clicáveis sobrepostos (um cobrindo o outro)
 *   3. conteúdo cortado pelo overflow:hidden do container
 *
 * Requer o dev server rodando.
 *
 * Uso:
 *   node scripts/auditar-layout.js /pt/ --viewports 375,768,1280,1920
 *   node scripts/auditar-layout.js /pt/ /pt/contato/ --viewports 375,1280
 */
const path = require('path')
const fs = require('fs')
const { chromium } = require('playwright-core')

function acharNavegador() {
  return [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  ].find((p) => fs.existsSync(p))
}

const argv = process.argv.slice(2)
const iV = argv.indexOf('--viewports')
const larguras = iV >= 0 ? argv[iV + 1].split(',').map(Number) : [375, 768, 1280, 1920]
const iB = argv.indexOf('--base')
const base = iB >= 0 ? argv[iB + 1] : 'http://localhost:3000'
const caminhos = argv.filter((a, i) => a.startsWith('/') && argv[i - 1] !== '--base')
if (!caminhos.length) caminhos.push('/pt/')

// Roda dentro da página. Só olha o que é visível e tem tamanho.
function auditar() {
  const visivel = (el) => {
    const cs = getComputedStyle(el)
    if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0) return false
    const r = el.getBoundingClientRect()
    return r.width > 1 && r.height > 1
  }
  // Imagem decorativa de fundo (aria-hidden, alt vazio, object-fit:cover) TEM
  // que extrapolar o container — e o overflow:hidden do pai apara o excedente.
  // Sem esta exceção a auditoria acusava fundo normal como defeito, e alarme
  // falso faz a ferramenta perder credibilidade.
  const decorativa = (el) => {
    if (el.tagName !== 'IMG') return false
    const semTexto = el.getAttribute('alt') === '' || el.getAttribute('aria-hidden') !== null
    const cobre = getComputedStyle(el).objectFit === 'cover'
    const paiOculta = el.closest('[aria-hidden]') !== null
    return semTexto && (cobre || paiOculta)
  }
  const rotulo = (el) => {
    const cls = typeof el.className === 'string' ? el.className.split(/\s+/)[0] : ''
    const txt = (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 32)
    return `${el.tagName.toLowerCase()}${cls ? '.' + cls : ''}${txt ? ` "${txt}"` : ''}`
  }

  const L = document.documentElement.clientWidth
  const vazando = []
  const cortados = []

  document.querySelectorAll('body *').forEach((el) => {
    if (!visivel(el)) return
    const r = el.getBoundingClientRect()
    // 1. vaza para fora da viewport na horizontal
    if (r.right > L + 1 || r.left < -1) {
      const temTexto = el.children.length === 0 && (el.textContent || '').trim()
      if ((temTexto || el.tagName === 'IMG') && !decorativa(el)) {
        vazando.push({ el: rotulo(el), esquerda: Math.round(r.left), direita: Math.round(r.right), viewport: L })
      }
    }
    // 3. cortado por um ancestral com overflow hidden
    let pai = el.parentElement
    while (pai && pai !== document.body) {
      const ov = getComputedStyle(pai).overflow
      if (ov === 'hidden') {
        const rp = pai.getBoundingClientRect()
        const perdaBaixo = Math.round(r.bottom - rp.bottom)
        if (perdaBaixo > 8 && r.height > 40 && !decorativa(el)) {
          cortados.push({ el: rotulo(el), cortado_embaixo_px: perdaBaixo, dentro_de: rotulo(pai) })
        }
        break
      }
      pai = pai.parentElement
    }
  })

  // 2. sobreposição entre elementos clicáveis
  const clicaveis = [...document.querySelectorAll('a, button, [role="button"]')].filter(visivel)
  const sobrepostos = []
  for (let i = 0; i < clicaveis.length; i++) {
    for (let j = i + 1; j < clicaveis.length; j++) {
      const a = clicaveis[i], b = clicaveis[j]
      if (a.contains(b) || b.contains(a)) continue
      const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect()
      const ow = Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left)
      const oh = Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top)
      if (ow > 4 && oh > 4) {
        sobrepostos.push({ a: rotulo(a), b: rotulo(b), area_px: Math.round(ow * oh) })
      }
    }
  }

  // alvo de toque pequeno demais
  const alvosPequenos = clicaveis
    .map((el) => ({ el: rotulo(el), r: el.getBoundingClientRect() }))
    .filter((x) => x.r.height < 44 || x.r.width < 44)
    .map((x) => ({ el: x.el, tamanho: `${Math.round(x.r.width)}x${Math.round(x.r.height)}` }))

  return {
    scrollHorizontal: document.documentElement.scrollWidth > L + 1,
    vazando: vazando.slice(0, 12),
    cortados: cortados.slice(0, 12),
    sobrepostos: sobrepostos.slice(0, 12),
    alvosPequenos: alvosPequenos.slice(0, 8),
  }
}

;(async () => {
  const exe = acharNavegador()
  if (!exe) { console.error('Nenhum Chrome/Edge encontrado.'); process.exit(1) }

  const browser = await chromium.launch({ executablePath: exe, headless: true })
  let problemas = 0

  for (const caminho of caminhos) {
    for (const largura of larguras) {
      const ctx = await browser.newContext({ viewport: { width: largura, height: Math.round(largura * 0.66) } })
      const page = await ctx.newPage()
      try {
        await page.goto(base.replace(/\/$/, '') + caminho, { waitUntil: 'networkidle', timeout: 30000 })
      } catch (e) {
        console.log(`\n${caminho} @ ${largura}px — FALHOU: ${e.message.split('\n')[0]}`)
        await ctx.close(); continue
      }
      await page.waitForTimeout(400)
      const r = await page.evaluate(auditar)

      const total = r.vazando.length + r.cortados.length + r.sobrepostos.length + (r.scrollHorizontal ? 1 : 0)
      problemas += total
      console.log(`\n${'─'.repeat(58)}\n${caminho}  @  ${largura}px   ${total ? '⚠ ' + total + ' problema(s)' : '✅ limpo'}`)

      if (r.scrollHorizontal) console.log('  🔴 a página tem scroll horizontal')
      if (r.vazando.length) {
        console.log('  🔴 vazando para fora da tela:')
        r.vazando.forEach((v) => console.log(`     ${v.el}  →  direita ${v.direita}px (tela ${v.viewport}px)`))
      }
      if (r.cortados.length) {
        console.log('  🟡 cortado por overflow:hidden:')
        r.cortados.forEach((c) => console.log(`     ${c.el}  →  perde ${c.cortado_embaixo_px}px embaixo`))
      }
      if (r.sobrepostos.length) {
        console.log('  🟡 clicáveis sobrepostos:')
        r.sobrepostos.forEach((s) => console.log(`     ${s.a}  ✕  ${s.b}`))
      }
      if (r.alvosPequenos.length) {
        console.log('  ⓘ alvos de toque abaixo de 44px:')
        r.alvosPequenos.forEach((a) => console.log(`     ${a.el}  ${a.tamanho}`))
      }
      await ctx.close()
    }
  }

  console.log(`\n${'═'.repeat(58)}\nTotal: ${problemas} problema(s)\n`)
  await browser.close()
  process.exit(problemas ? 1 : 0)
})().catch((e) => { console.error('falhou:', e.message); process.exit(1) })
