#!/usr/bin/env node
/**
 * Grava o selo de pré-deploy consumido por `portao-deploy.js`.
 * Só deve ser chamado pelo agente `pre-deploy`, DEPOIS de:
 *   tsc limpo · build ok · paridade i18n ok · preview visto e APROVADO pelo usuário.
 *
 * Uso:
 *   node .claude/hooks/selo-deploy.js --tsc ok --build ok --i18n ok --visual aprovado
 *
 * Marcar visual como aprovado sem o usuário ter dito sim é falsificar a
 * única barreira humana antes de zilmer.com.br. Não faça isso.
 */
const fs = require('fs')
const path = require('path')

const args = process.argv.slice(2)
const val = (nome) => {
  const i = args.indexOf(`--${nome}`)
  return i >= 0 ? args[i + 1] : null
}

const raiz = process.env.CLAUDE_PROJECT_DIR || process.cwd()
const destino = path.join(raiz, '.claude', '.selo-deploy.json')

const selo = {
  em: new Date().toISOString(),
  tsc: val('tsc') || 'nao-verificado',
  build: val('build') || 'nao-verificado',
  i18n: val('i18n') || 'nao-verificado',
  aprovacaoVisual: (val('visual') || '') === 'aprovado',
  nota: val('nota') || '',
}

if (selo.tsc !== 'ok' || selo.build !== 'ok') {
  console.error('Recusado: selo exige --tsc ok e --build ok. Corrija os erros antes.')
  process.exit(1)
}

fs.mkdirSync(path.dirname(destino), { recursive: true })
fs.writeFileSync(destino, JSON.stringify(selo, null, 2))
console.log(`Selo gravado em ${destino} — válido por 30 min.`)
