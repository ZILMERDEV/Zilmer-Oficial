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
  // Prova da aprovação, não apenas a afirmação dela.
  // O Git Bash no Windows converte argumentos que começam com "/" em caminho
  // (POSIX path conversion): "/pt" vira "C:/.../PortableGit/pt". Desfaz isso.
  rotasMostradas: (val('rotas') || '').replace(/[A-Za-z]:[\\/].*?PortableGit[\\/]/g, '/'),
  viewports: val('viewports') || '',
  palavrasDoUsuario: val('disse') || '',
  nota: val('nota') || '',
}

if (selo.tsc !== 'ok' || selo.build !== 'ok') {
  console.error('Recusado: selo exige --tsc ok e --build ok. Corrija os erros antes.')
  process.exit(1)
}

// A aprovação visual precisa vir acompanhada da evidência: o que foi mostrado
// e o que o usuário respondeu, nas palavras dele. Sem isso, não é aprovação —
// é alegação. Nenhum código prova que o humano olhou a tela; o que dá para
// fazer é deixar a alegação registrada, datada e conferível contra a conversa.
if (selo.aprovacaoVisual) {
  const faltando = []
  if (!selo.rotasMostradas) faltando.push('--rotas (ex.: /pt,/en,/es)')
  if (!selo.viewports) faltando.push('--viewports (ex.: 375px,1280px)')
  if (!selo.palavrasDoUsuario) faltando.push('--disse "<o que o usuário respondeu, literal>"')
  if (faltando.length) {
    console.error(
      'Recusado: --visual aprovado exige a evidência da aprovação.\n' +
        'Faltando: ' + faltando.join(' · ') + '\n\n' +
        'Se você não mostrou o preview e não obteve resposta do usuário, não grave o selo.'
    )
    process.exit(1)
  }
}

fs.mkdirSync(path.dirname(destino), { recursive: true })
fs.writeFileSync(destino, JSON.stringify(selo, null, 2))

// Registro permanente e append-only: o selo é apagado a cada publicação,
// este histórico não. É por aqui que o usuário audita.
try {
  const historico = path.join(raiz, '.claude', 'estado', 'aprovacoes.jsonl')
  fs.mkdirSync(path.dirname(historico), { recursive: true })
  fs.appendFileSync(historico, JSON.stringify(selo) + '\n')
} catch {}

console.log(`Selo gravado — válido por 30 min. Registrado em .claude/estado/aprovacoes.jsonl`)
