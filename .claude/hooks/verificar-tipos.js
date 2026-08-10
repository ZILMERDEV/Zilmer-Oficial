#!/usr/bin/env node
/**
 * PostToolUse (Edit|Write) — checagem contínua de tipos.
 *
 * Só roda quando o arquivo tocado é .ts/.tsx (editar CSS ou JSON não precisa
 * pagar 10s de tsc). O projeto NÃO tem ESLint instalado — o hook antigo
 * chamava `npm run lint`, script que não existe, e falhava toda vez.
 *
 * Saída: exit 2 devolve os erros ao Claude para correção imediata.
 */
const { execSync } = require('child_process')

let stdin = ''
process.stdin.on('data', (c) => (stdin += c))
process.stdin.on('end', () => {
  let entrada = {}
  try {
    entrada = JSON.parse(stdin || '{}')
  } catch {
    process.exit(0)
  }

  const arquivo = entrada?.tool_input?.file_path || ''
  const raiz = entrada?.cwd || process.env.CLAUDE_PROJECT_DIR || process.cwd()

  if (!/\.(ts|tsx)$/.test(arquivo)) process.exit(0)
  if (/[\\/]node_modules[\\/]/.test(arquivo)) process.exit(0)

  try {
    execSync('npx tsc --noEmit', { cwd: raiz, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
    process.exit(0)
  } catch (e) {
    const saida = `${e.stdout || ''}${e.stderr || ''}`.trim()
    const linhas = saida.split('\n').filter((l) => l.includes('error TS'))
    console.error(
      `tsc --noEmit falhou (${linhas.length} erro(s)):\n` +
        linhas.slice(0, 20).join('\n') +
        (linhas.length > 20 ? `\n... e mais ${linhas.length - 20}` : '') +
        '\n\nCorrija antes de seguir. Não silencie com any nem @ts-ignore.'
    )
    process.exit(2)
  }
})
