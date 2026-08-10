#!/usr/bin/env node
/**
 * PreToolUse (Bash) — Portão de Deploy do site Zilmer.
 *
 * Push na `main` dispara o workflow do Lightsail e vai direto para
 * zilmer.com.br, sem staging e sem rollback automático. Este hook bloqueia
 * qualquer `git push` que atinja a main sem que a bateria de pré-deploy
 * tenha rodado nos últimos VALIDADE_MIN minutos.
 *
 * O selo é gravado por `.claude/hooks/selo-deploy.js`, chamado pelo
 * agente `pre-deploy` só depois de tsc + build + i18n + aprovação visual.
 *
 * Saída: exit 2 = bloqueia a chamada e devolve o motivo ao Claude.
 */
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const VALIDADE_MIN = 30

function ler(stdin) {
  try {
    return JSON.parse(stdin || '{}')
  } catch {
    return {}
  }
}

function git(cmd, cwd) {
  try {
    return execSync(`git ${cmd}`, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()
  } catch {
    return ''
  }
}

let stdin = ''
process.stdin.on('data', (c) => (stdin += c))
process.stdin.on('end', () => {
  const entrada = ler(stdin)
  const bruto = entrada?.tool_input?.command || ''
  const raiz = entrada?.cwd || process.env.CLAUDE_PROJECT_DIR || process.cwd()

  // `git push` citado dentro de aspas (echo, mensagem de commit, heredoc de teste)
  // não é um push. Neutraliza os trechos entre aspas antes de analisar.
  const comando = bruto.replace(/'[^']*'/g, "''").replace(/"[^"]*"/g, '""')

  // Só nos interessa git push de verdade: início da linha ou após separador de shell.
  if (!/(^|[;&|(]|&&|\|\|)\s*git\s+push\b/.test(comando)) process.exit(0)

  // --force e afins: barra sempre, independente de selo.
  if (/--force\b|--force-with-lease\b|\+\w|-f\b/.test(comando)) {
    console.error(
      'BLOQUEADO: push forçado na origem do site de produção.\n' +
        'Reescrever histórico da main quebra o `git pull` do servidor Lightsail no próximo deploy.\n' +
        'Se for mesmo necessário, o usuário precisa rodar o comando manualmente no terminal dele.'
    )
    process.exit(2)
  }

  // O push atinge a main?
  const branchAtual = git('rev-parse --abbrev-ref HEAD', raiz)
  const alvoExplicito = comando.match(/git\s+push\s+\S+\s+(\S+)/)
  const alvo = alvoExplicito ? alvoExplicito[1].replace(/^.*:/, '') : branchAtual
  const atingeMain = alvo === 'main' || /:main\b/.test(comando)

  if (!atingeMain) {
    console.log(`[portão] push para "${alvo}" não dispara deploy — liberado.`)
    process.exit(0)
  }

  // Selo de pré-deploy.
  const selo = path.join(raiz, '.claude', '.selo-deploy.json')
  if (!fs.existsSync(selo)) {
    console.error(
      'BLOQUEADO: push na main sem pré-deploy.\n\n' +
        'Este push publica em zilmer.com.br (GitHub Actions → SSH → Lightsail → pm2 restart).\n' +
        'Não há staging nem rollback automático.\n\n' +
        'Rode o agente `pre-deploy` (ou /preflight) primeiro: tsc, build, paridade i18n,\n' +
        'preview visual em /pt /en /es, mobile e desktop, e aprovação explícita do usuário.'
    )
    process.exit(2)
  }

  let dados
  try {
    dados = JSON.parse(fs.readFileSync(selo, 'utf8'))
  } catch {
    console.error('BLOQUEADO: selo de pré-deploy ilegível. Rode /preflight novamente.')
    process.exit(2)
  }

  const idadeMin = (Date.now() - new Date(dados.em).getTime()) / 60000
  if (!Number.isFinite(idadeMin) || idadeMin > VALIDADE_MIN) {
    console.error(
      `BLOQUEADO: pré-deploy vencido (${Math.round(idadeMin)} min atrás, validade ${VALIDADE_MIN} min).\n` +
        'O código pode ter mudado desde a verificação. Rode /preflight de novo.'
    )
    process.exit(2)
  }

  if (!dados.aprovacaoVisual) {
    console.error(
      'BLOQUEADO: os portões automáticos passaram, mas falta a aprovação visual do usuário.\n' +
        'Mostre o preview (localhost ou Figma) e pergunte se ele aprova antes de publicar.'
    )
    process.exit(2)
  }

  console.log(
    `[portão] pré-deploy ok (${Math.round(idadeMin)} min atrás) — tsc:${dados.tsc} build:${dados.build} i18n:${dados.i18n} visual:aprovado. Liberado.`
  )
  process.exit(0)
})
