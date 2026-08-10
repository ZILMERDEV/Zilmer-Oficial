#!/usr/bin/env node
/**
 * Registrador de eventos — alimenta o painel ao vivo (scripts/painel-agentes.js).
 *
 * Chamado por vários hooks com o nome do evento como argumento:
 *   node .claude/hooks/registrar-evento.js PreToolUse
 *
 * Regra de ouro: este script NUNCA pode atrapalhar o trabalho. Qualquer falha
 * é engolida e ele sai com 0. Ele observa, não interfere.
 */
const fs = require('fs')
const path = require('path')

const EVENTO = process.argv[2] || 'Desconhecido'
const LIMITE_LINHAS = 2000

let stdin = ''
process.stdin.on('data', (c) => (stdin += c))
process.stdin.on('error', () => process.exit(0))
process.stdin.on('end', () => {
  try {
    registrar()
  } catch {
    /* observador silencioso */
  }
  process.exit(0)
})

// Se nada chegar em 3s, registra mesmo assim e sai.
setTimeout(() => {
  try {
    registrar()
  } catch {}
  process.exit(0)
}, 3000).unref()

function resumir(entrada) {
  const t = entrada?.tool_name || ''
  const i = entrada?.tool_input || {}
  if (t === 'Bash') return (i.command || '').replace(/\s+/g, ' ').slice(0, 120)
  if (['Edit', 'Write', 'Read', 'NotebookEdit'].includes(t)) {
    return (i.file_path || '').replace(/^.*[\\/]/, '')
  }
  if (t === 'Task' || t === 'Agent') return i.subagent_type || i.description || ''
  if (t === 'Grep' || t === 'Glob') return (i.pattern || '').slice(0, 80)
  if (entrada?.prompt) return String(entrada.prompt).replace(/\s+/g, ' ').slice(0, 120)
  if (entrada?.message) return String(entrada.message).replace(/\s+/g, ' ').slice(0, 120)
  return ''
}

// Classifica o evento para o painel poder destacar o que importa.
function classificar(evento, entrada, resumo) {
  if (evento === 'SubagentStart' || evento === 'SubagentStop') return 'agente'
  if (/^git\s+push/.test(resumo)) return 'deploy'
  if (entrada?.tool_name === 'Task') return 'agente'
  if (['Edit', 'Write'].includes(entrada?.tool_name)) return 'escrita'
  if (evento === 'Notification') return 'atencao'
  if (evento === 'Stop' || evento === 'SessionEnd') return 'fim'
  return 'normal'
}

function registrar() {
  let entrada = {}
  try {
    entrada = JSON.parse(stdin || '{}')
  } catch {}

  const raiz = entrada?.cwd || process.env.CLAUDE_PROJECT_DIR || process.cwd()
  const dir = path.join(raiz, '.claude', 'estado')
  const arquivo = path.join(dir, 'eventos.jsonl')

  const resumo = resumir(entrada)
  const linha = JSON.stringify({
    em: new Date().toISOString(),
    evento: EVENTO,
    ferramenta: entrada?.tool_name || null,
    resumo,
    tipo: classificar(EVENTO, entrada, resumo),
    sessao: (entrada?.session_id || '').slice(0, 8) || null,
  })

  fs.mkdirSync(dir, { recursive: true })
  fs.appendFileSync(arquivo, linha + '\n')

  // Poda: mantém o arquivo pequeno para o painel carregar rápido.
  try {
    const linhas = fs.readFileSync(arquivo, 'utf8').split('\n').filter(Boolean)
    if (linhas.length > LIMITE_LINHAS) {
      fs.writeFileSync(arquivo, linhas.slice(-Math.floor(LIMITE_LINHAS / 2)).join('\n') + '\n')
    }
  } catch {}
}
