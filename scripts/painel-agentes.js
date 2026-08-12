#!/usr/bin/env node
/**
 * Painel ao vivo dos agentes do Claude Code — site Zilmer.
 *
 * Servidor mínimo (só Node, zero dependência) que lê os eventos gravados pelos
 * hooks em .claude/estado/eventos.jsonl e mostra num painel que se atualiza sozinho.
 *
 *   node scripts/painel-agentes.js          → http://localhost:3100
 *   node scripts/painel-agentes.js --porta 3200
 *
 * Só escuta em 127.0.0.1. É ferramenta de desenvolvimento — não faz parte do
 * build do site e nunca vai para produção.
 */
const http = require('http')
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const RAIZ = path.resolve(__dirname, '..')
const EVENTOS = path.join(RAIZ, '.claude', 'estado', 'eventos.jsonl')
const SELO = path.join(RAIZ, '.claude', '.selo-deploy.json')
const idx = process.argv.indexOf('--porta')
const PORTA = idx >= 0 ? Number(process.argv[idx + 1]) : 3100

function git(cmd) {
  try {
    return execSync(`git ${cmd}`, { cwd: RAIZ, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()
  } catch {
    return ''
  }
}

function lerEventos(limite = 120) {
  try {
    const linhas = fs.readFileSync(EVENTOS, 'utf8').split('\n').filter(Boolean)
    return linhas
      .slice(-limite)
      .map((l) => {
        try {
          return JSON.parse(l)
        } catch {
          return null
        }
      })
      .filter(Boolean)
      .reverse()
  } catch {
    return []
  }
}

function estadoSelo() {
  if (!fs.existsSync(SELO)) return { estado: 'ausente', texto: 'Push na main bloqueado' }
  try {
    const s = JSON.parse(fs.readFileSync(SELO, 'utf8'))
    const min = (Date.now() - new Date(s.em).getTime()) / 60000
    if (min > 30) return { estado: 'vencido', texto: `Vencido há ${Math.round(min - 30)} min` }
    if (!s.aprovacaoVisual) return { estado: 'parcial', texto: 'Falta aprovação visual' }
    return { estado: 'liberado', texto: `Liberado — expira em ${Math.round(30 - min)} min` }
  } catch {
    return { estado: 'ausente', texto: 'Selo ilegível' }
  }
}

// Worktrees são pastas no disco, não branches. Para cada uma, apura a branch,
// se é a pasta atual, e quantas alterações pendentes tem lá dentro.
function lerWorktrees() {
  const blocos = git('worktree list --porcelain').split(/\n\s*\n/).filter(Boolean)
  const aqui = RAIZ.replace(/\\/g, '/').toLowerCase()
  return blocos.map((b) => {
    const caminho = (b.match(/^worktree (.+)$/m) || [])[1] || ''
    const branch = ((b.match(/^branch (.+)$/m) || [])[1] || '').replace('refs/heads/', '')
    const norm = caminho.replace(/\\/g, '/')
    let sujo = 0
    try {
      sujo = execSync('git status --porcelain', {
        cwd: caminho,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      })
        .split('\n')
        .filter(Boolean).length
    } catch {}
    return {
      pasta: norm.replace(/^.*\//, '') || norm,
      caminho: norm,
      branch: branch || '(destacado)',
      atual: norm.toLowerCase() === aqui,
      producao: branch === 'main',
      pendentes: sujo,
    }
  })
}

function estado() {
  const eventos = lerEventos()
  const pendentes = git('status --porcelain').split('\n').filter(Boolean)
  const worktrees = lerWorktrees()
  const branchesLocais = git("branch --format=%(refname:short)").split('\n').filter(Boolean)
  const desde = Date.now() - 60 * 60 * 1000
  const ultimaHora = eventos.filter((e) => new Date(e.em).getTime() > desde)

  return {
    agora: new Date().toISOString(),
    branch: git('rev-parse --abbrev-ref HEAD') || '—',
    ultimoCommit: git('log -1 --pretty=format:"%h %s"').replace(/^"|"$/g, '') || '—',
    pendentes: pendentes.length,
    arquivosPendentes: pendentes.slice(0, 12),
    worktrees,
    branchesLocais,
    selo: estadoSelo(),
    totalEventos: eventos.length,
    escritasUltimaHora: ultimaHora.filter((e) => e.tipo === 'escrita').length,
    agentesUltimaHora: ultimaHora.filter((e) => e.tipo === 'agente').length,
    eventos: eventos.slice(0, 60),
  }
}

const PAGINA = `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Painel dos agentes — Zilmer</title>
<style>
  :root{--bg:#fbfbfa;--card:#fff;--linha:#e6e4e0;--txt:#1a1a1a;--txt2:#6b6b6b;
        --ok:#1a7f4b;--alerta:#b45309;--erro:#b42318;--acento:#003366;--mono:ui-monospace,SFMono-Regular,Consolas,monospace}
  @media (prefers-color-scheme:dark){
    :root{--bg:#191817;--card:#211f1e;--linha:#332f2d;--txt:#f0eeec;--txt2:#9a9490;
          --ok:#4ade80;--alerta:#fbbf24;--erro:#f87171;--acento:#7aa7d9}}
  *{box-sizing:border-box}
  body{margin:0;background:var(--bg);color:var(--txt);font:14px/1.5 ui-sans-serif,system-ui,'Segoe UI',sans-serif;padding:20px}
  .wrap{max-width:1080px;margin:0 auto}
  header{display:flex;align-items:baseline;justify-content:space-between;gap:12px;margin-bottom:18px;flex-wrap:wrap}
  h1{font-size:17px;margin:0;font-weight:650}
  .vivo{font-size:11.5px;color:var(--txt2);display:flex;align-items:center;gap:6px}
  .pulso{width:7px;height:7px;border-radius:50%;background:var(--ok);animation:p 2s infinite}
  @keyframes p{0%,100%{opacity:1}50%{opacity:.25}}
  h2{font-size:10.5px;text-transform:uppercase;letter-spacing:.07em;color:var(--txt2);margin:0 0 8px;font-weight:600}
  section{margin-bottom:22px}
  .grade{display:grid;grid-template-columns:repeat(auto-fit,minmax(168px,1fr));gap:8px}
  .card{background:var(--card);border:1px solid var(--linha);border-radius:9px;padding:11px 13px}
  .card .rot{font-size:10.5px;text-transform:uppercase;letter-spacing:.06em;color:var(--txt2);margin-bottom:5px}
  .card .val{font-size:19px;font-weight:650;line-height:1.15}
  .card .sub{font-size:11.5px;color:var(--txt2);margin-top:3px}
  .card.ok{border-color:var(--ok)} .card.ok .val{color:var(--ok)}
  .card.alerta{border-color:var(--alerta)} .card.alerta .val{color:var(--alerta)}
  .card.erro{border-color:var(--erro)} .card.erro .val{color:var(--erro)}
  table{width:100%;border-collapse:collapse}
  td{padding:6px 8px;border-bottom:1px solid var(--linha);font-size:12.5px;vertical-align:top}
  tr:last-child td{border-bottom:0}
  .hora{font-family:var(--mono);font-size:11px;color:var(--txt2);white-space:nowrap;width:62px}
  .tag{font-size:10px;font-weight:600;padding:1.5px 6px;border-radius:4px;white-space:nowrap;
       border:1px solid var(--linha);color:var(--txt2)}
  .t-agente{border-color:var(--acento);color:var(--acento)}
  .t-deploy{border-color:var(--erro);color:var(--erro)}
  .t-escrita{border-color:var(--ok);color:var(--ok)}
  .t-atencao{border-color:var(--alerta);color:var(--alerta)}
  .res{font-family:var(--mono);font-size:11.5px;color:var(--txt2);word-break:break-word}
  .vazio{color:var(--txt2);font-size:12.5px;padding:14px 0}
  .aqui{color:var(--ok);font-size:15px;line-height:1}
  .dica{font-size:11.5px;color:var(--txt2);margin-top:7px;line-height:1.45}
  .rodape{font-size:11px;color:var(--txt2);margin-top:22px;border-top:1px solid var(--linha);padding-top:10px}
  code{font-family:var(--mono);font-size:11px}
</style></head>
<body><div class="wrap">
<header>
  <h1>Painel dos agentes — Zilmer</h1>
  <div class="vivo"><span class="pulso"></span><span id="atualizado">conectando…</span></div>
</header>
<section><h2>Portões</h2><div class="grade" id="portoes"></div></section>
<section><h2>Repositório</h2><div class="grade" id="repo"></div></section>
<section><h2>Worktrees — pastas de trabalho no disco</h2><div id="worktrees"></div></section>
<section><h2>Atividade ao vivo</h2><div id="atividade"></div></section>
<div class="rodape">
  Alimentado pelos hooks do Claude Code em <code>.claude/estado/eventos.jsonl</code>.
  Atualiza a cada 2s. Ferramenta local — não faz parte do build do site.
</div>
</div>
<script>
const fmt = (iso) => new Date(iso).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit',second:'2-digit'})
const esc = (s) => String(s??'').replace(/[<>&]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;'}[c]))
const cartao = (rot,val,sub,cls='') =>
  '<div class="card '+cls+'"><div class="rot">'+rot+'</div><div class="val">'+esc(val)+'</div>'+
  (sub?'<div class="sub">'+esc(sub)+'</div>':'')+'</div>'

const CLS_SELO = {liberado:'ok', parcial:'alerta', vencido:'alerta', ausente:'erro'}
const ROT_SELO = {liberado:'Liberado', parcial:'Parcial', vencido:'Vencido', ausente:'Bloqueado'}

async function tick(){
  let d
  try { d = await (await fetch('/api/estado')).json() }
  catch { document.getElementById('atualizado').textContent = 'servidor fora do ar'; return }

  document.getElementById('atualizado').textContent = 'atualizado ' + fmt(d.agora)

  document.getElementById('portoes').innerHTML =
    cartao('Portão de deploy', ROT_SELO[d.selo.estado], d.selo.texto, CLS_SELO[d.selo.estado]) +
    cartao('Escritas na última hora', d.escritasUltimaHora, 'arquivos editados') +
    cartao('Agentes na última hora', d.agentesUltimaHora, 'execuções de subagente') +
    cartao('Eventos registrados', d.totalEventos, 'no arquivo de estado')

  document.getElementById('repo').innerHTML =
    cartao('Branch', d.branch, d.branch === 'main' ? 'produção — cuidado' : 'isolado do deploy',
           d.branch === 'main' ? 'alerta' : 'ok') +
    cartao('Alterações pendentes', d.pendentes,
           d.arquivosPendentes.slice(0,3).map(f=>f.replace(/^\s*\S+\s+/,'').replace(/"/g,'')).join(', ')) +
    cartao('Branches locais', d.branchesLocais.length, d.branchesLocais.join(' · ')) +
    cartao('Último commit', (d.ultimoCommit.split(' ')[0]||'—'), d.ultimoCommit.split(' ').slice(1).join(' '))

  document.getElementById('worktrees').innerHTML = '<div class="card"><table>' + d.worktrees.map(w =>
    '<tr>' +
    '<td style="width:30px">' + (w.atual ? '<span class="aqui" title="voce esta aqui">●</span>' : '') + '</td>' +
    '<td style="width:210px"><b>' + esc(w.pasta) + '</b><div class="res">' + esc(w.caminho) + '</div></td>' +
    '<td style="width:190px"><span class="tag ' + (w.producao ? 't-deploy' : 't-agente') + '">' + esc(w.branch) + '</span>' +
      (w.producao ? '<div class="res">produção — push aqui publica</div>' : '<div class="res">isolado do deploy</div>') + '</td>' +
    '<td>' + (w.pendentes ? '<span class="tag t-atencao">' + w.pendentes + ' pendente(s)</span>' : '<span class="res">limpo</span>') + '</td>' +
    '</tr>').join('') + '</table></div>' +
    (d.worktrees.length === 1
      ? '<div class="dica">Só existe a pasta principal. Um worktree novo aparece aqui como linha adicional — é uma pasta irmã, com <code>node_modules</code> próprio.</div>'
      : '')

  const alvo = document.getElementById('atividade')
  if(!d.eventos.length){
    alvo.innerHTML = '<div class="vazio">Nenhum evento ainda. Os hooks gravam aqui assim que eu executar qualquer ferramenta.</div>'
    return
  }
  alvo.innerHTML = '<div class="card"><table>' + d.eventos.map(e =>
    '<tr><td class="hora">'+fmt(e.em)+'</td>'+
    '<td style="width:86px"><span class="tag t-'+esc(e.tipo)+'">'+esc(e.tipo)+'</span></td>'+
    '<td style="width:118px">'+esc(e.ferramenta||e.evento)+'</td>'+
    '<td class="res">'+esc(e.resumo||'')+'</td></tr>').join('') + '</table></div>'
}
tick(); setInterval(tick, 2000)
</script></body></html>`

http
  .createServer((req, res) => {
    if (req.url.startsWith('/api/estado')) {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' })
      return res.end(JSON.stringify(estado()))
    }
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' })
    res.end(PAGINA)
  })
  .listen(PORTA, '127.0.0.1', () => {
    console.log(`Painel dos agentes em http://localhost:${PORTA}`)
    console.log(`Lendo eventos de ${EVENTOS}`)
  })
