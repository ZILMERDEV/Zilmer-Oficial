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

  // ------------------------------------------------------------------
  // VERIFICAÇÃO INDEPENDENTE — não confia no que o selo afirma.
  //
  // O selo é escrito pelo Claude. Se ele marcar "tsc ok" sem ter rodado,
  // o selo mente. A partir daqui o portão apura por conta própria, e o
  // resultado destas checagens vence o que estiver escrito no selo.
  // Só roda no push (o hook já é filtrado por `if: Bash(git push*)`).
  // ------------------------------------------------------------------

  // 1. Tipos: prova, não promessa.
  try {
    execSync('npx tsc --noEmit', { cwd: raiz, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
  } catch (e) {
    const erros = `${e.stdout || ''}${e.stderr || ''}`
      .split('\n')
      .filter((l) => l.includes('error TS'))
    console.error(
      `BLOQUEADO: o selo afirma "tsc ${dados.tsc}", mas a verificação no momento do push encontrou ${erros.length} erro(s):\n` +
        erros.slice(0, 10).join('\n') +
        '\n\nO selo estava errado ou o código mudou depois dele. Corrija antes de publicar.'
    )
    process.exit(2)
  }

  // 2. Build: existe e é mais nova que o código-fonte?
  //    Pega o caso "buildou, editou depois, e publicou o que não foi testado".
  const next = path.join(raiz, '.next')
  if (!fs.existsSync(next)) {
    console.error(
      `BLOQUEADO: o selo afirma "build ${dados.build}", mas não existe pasta .next neste projeto.\n` +
        'Rode `npm run build` de verdade antes de publicar.'
    )
    process.exit(2)
  }

  const buildEm = fs.statSync(next).mtimeMs
  const maisNovo = arquivoFonteMaisRecente(raiz)
  if (maisNovo && maisNovo.em > buildEm) {
    console.error(
      'BLOQUEADO: há código-fonte mais novo que a última build.\n' +
        `  build:  ${new Date(buildEm).toLocaleString('pt-BR')}\n` +
        `  ${maisNovo.arquivo}: ${new Date(maisNovo.em).toLocaleString('pt-BR')}\n\n` +
        'Você estaria publicando algo que nunca foi compilado. Rode `npm run build` de novo.'
    )
    process.exit(2)
  }

  console.log(
    `[portão] LIBERADO. tsc verificado agora (0 erros) · build de ${new Date(buildEm).toLocaleTimeString('pt-BR')} ` +
      `mais recente que o código · aprovação visual registrada há ${Math.round(idadeMin)} min.`
  )
  process.exit(0)
})

// Varre o código-fonte do site e devolve o arquivo modificado mais recentemente.
// Ignora build, dependências, git e a própria ferramentaria do Claude.
function arquivoFonteMaisRecente(raiz) {
  const IGNORAR = new Set(['node_modules', '.next', '.git', '.claude', 'memory', 'automacoes', 'scripts'])
  const EXT = /\.(ts|tsx|js|jsx|css|json)$/
  let melhor = null

  const andar = (dir, profundidade = 0) => {
    if (profundidade > 6) return
    let itens
    try {
      itens = fs.readdirSync(dir, { withFileTypes: true })
    } catch {
      return
    }
    for (const item of itens) {
      if (item.name.startsWith('.') && item.name !== '.gitignore') continue
      if (IGNORAR.has(item.name)) continue
      const caminho = path.join(dir, item.name)
      if (item.isDirectory()) {
        andar(caminho, profundidade + 1)
      } else if (EXT.test(item.name)) {
        try {
          const em = fs.statSync(caminho).mtimeMs
          if (!melhor || em > melhor.em) {
            melhor = { arquivo: path.relative(raiz, caminho).replace(/\\/g, '/'), em }
          }
        } catch {}
      }
    }
  }

  andar(raiz)
  return melhor
}
