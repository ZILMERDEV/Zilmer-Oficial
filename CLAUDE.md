# CLAUDE.md — Memória do Projeto

> Lido automaticamente pelo Claude Code a cada sessão.
> A seção "Contexto Atual" é atualizada pelo agente `memoria` ao final de cada sessão.

---

## Projeto

- **Nome:** Zilmer — site institucional
- **Empresa:** Zilmer, fabricante de transformadores elétricos
- **Tipo:** Site institucional B2B, trilíngue (pt/en/es)
- **URL de produção:** https://www.zilmer.com.br
- **Repositório:** https://github.com/ZILMERDEV/Zilmer-Oficial
- **Público:** engenheiro, comprador técnico, gestor de utility — tom sóbrio e técnico

---

## Stack real

- **Framework:** Next.js 14 (App Router)
- **Linguagem:** TypeScript, `strict: true`
- **Estilo:** **CSS Modules** (`*.module.css`) + variáveis CSS em `app/globals.css`.
  **Não há Tailwind neste projeto.** Não sugerir classes utilitárias.
- **i18n:** `next-intl` — locales `pt` (padrão), `en`, `es`, `localePrefix: 'always'`
- **Imagens:** CDN S3 via `lib/assets.ts` → `cdnUrl()`. `next.config.js` usa
  `images: { unoptimized: true }` — **nenhuma imagem é redimensionada automaticamente**
- **Lint:** **não há ESLint instalado.** A verificação contínua é `npx tsc --noEmit`
- **Deploy:** push na `main` → GitHub Actions → SSH no Lightsail → `git pull`,
  `npm install`, `rm -rf .next`, `npm run build`, `pm2 restart next-app`.
  **Sem staging. Sem rollback automático.**
- **Controle de versão:** Git Worktree (substitui o fluxo do Cursor)

---

## Estrutura real de pastas

```
/
├── app/
│   ├── globals.css              # variáveis CSS (tokens) + reset
│   ├── layout.tsx · error.tsx · not-found.tsx
│   ├── admin/ · api/
│   └── [locale]/                # pt | en | es
│       ├── page.tsx + page.module.css
│       ├── [slug]/ · areas/[slug]/ · contato/ · projetos/ · sobre/
│       └── produtos/
│           ├── transformadores-oleo/[slug]/
│           ├── transformadores-seco/
│           └── transformadores-instrumentos/   # + tc/tp-*-data.ts
├── components/                  # 9 componentes, cada um com .module.css irmão
├── data/                        # trios de conteúdo: X.json (pt) / X.en.json / X.es.json
├── messages/                    # pt.json · en.json · es.json (strings de UI)
├── i18n/                        # request.ts · routing.ts
├── lib/assets.ts                # cdnUrl()
├── public/                      # imagens e PDFs
├── scripts/                     # ~20 utilitários de imagem + mobile-screenshot.js
├── memory/                      # DECISIONS · TEMPLATES · CHANGELOG · BUGS · DESIGN · AUTOMACOES
└── .claude/
    ├── settings.json            # hooks e permissões
    ├── launch.json              # preview "zilmer-dev" (localhost:3000)
    ├── agents/                  # 6 subagentes
    ├── commands/                # comandos de sessão
    └── hooks/                   # verificar-tipos · portao-deploy · selo-deploy
```

**Nota:** `X.json` sem sufixo **é o português**, não um arquivo neutro.

---

## Convenções de Código

- Componentes em **PascalCase** — `HeroCarousel.tsx`, com `HeroCarousel.module.css` irmão
- Hooks customizados com prefixo `use` — `useScrollPosition.ts`
- Utilitários em **camelCase** — `formatDate.ts`
- Imports absolutos com alias `@/` (raiz do projeto)
- Toda string visível ao usuário vem de `useTranslations` — nunca hardcoded no JSX
- Todo caminho de imagem passa por `cdnUrl()`
- Sem CSS inline (`style={{}}`) exceto valor genuinamente calculado em runtime
- Nunca silenciar erro com `any`, `@ts-ignore` ou `@ts-expect-error`

---

## Agentes

| Agente | Quando usar | O que faz |
|---|---|---|
| `pre-deploy` | **sempre antes de publicar** | tsc, build, i18n, assets, preview visual, aprovação, commit, push |
| `corretor-de-erros` | build quebrou, tsc acusou, página falhou | acha causa raiz e corrige |
| `faxineiro` | `/cleanup`, fim de feature | órfãos, CSS morto, assets soltos, docs duplicados — reporta, não apaga |
| `guardiao-i18n` | mexeu em texto/conteúdo | paridade pt/en/es em `messages/` e `data/` |
| `design-web` | template novo, link do Figma, ajuste visual | tokens, hierarquia, contraste, responsividade |
| `memoria` | fim de sessão, `/sync-memory` | consolida em `memory/*.md` |

### Comandos

| Comando | Ação |
|---|---|
| `/check` | diagnóstico rápido (tipos, i18n, git) — não corrige |
| `/preflight` | bateria de pré-deploy — não publica |
| `/publicar` | fluxo completo: preview → aprovação → commit → push |
| `/cleanup` | auditoria de limpeza |
| `/sync-memory` | consolida a memória |
| `/new-template <nome>` | worktree + template + i18n + registro |
| `/visual [alvo]` | revisão de design |
| `/worktree [ação]` | criar/listar/remover worktrees |

### Hooks ativos

**Exatamente dois.** Cada hook custa ~340ms de processo no Windows, então o
gatilho de cada um é o mais estreito possível.

- **PostToolUse (Edit|Write)** → `verificar-tipos.js`: roda `tsc --noEmit`, e
  só quando o arquivo é `.ts`/`.tsx`
- **PreToolUse (Bash)**, filtrado por `if: Bash(git push*)` → `portao-deploy.js`:
  bloqueia push na main sem selo válido; **verifica `tsc` e a idade da build por
  conta própria**, não confia no que o selo afirma

`selo-deploy.js` não é hook — é chamado pelo agente `pre-deploy` e exige
evidência da aprovação (`--rotas`, `--viewports`, `--disse`).

### Travas de permissão (`.claude/settings.json`)

- `Edit`/`Write` em `.github/**` → **negado**. O workflow de deploy é de terceiro
  e funciona; leitura continua liberada. Ver `memory/DECISIONS.md`
- `git push --force`, `git reset --hard`, `git clean -fd`, `rm -rf` → negados
- `npm run dev` → negado no Bash; usar `preview_start` (`zilmer-dev`)

---

## Painel ao vivo

`scripts/painel-agentes.js` na porta 3100 (só `127.0.0.1`, fora do build do site).
**Não sobe sozinho** — abrir com `preview_start` (`painel-agentes`) ou `npm run painel`.
O auto-start por hook foi removido: no Windows ele abria uma janela de console a
cada sessão.

Mostra ao vivo: estado do portão de deploy, branch (vermelho quando é `main`),
worktrees com pendências por pasta.

**Limitação conhecida:** a seção "Atividade ao vivo" está congelada. Ela era
alimentada por `registrar-evento.js`, removido porque disparava um processo a
cada ferramenta. O que continua ao vivo (git, worktrees, portão) é lido na hora,
a cada 2s.

### Levar o painel para o chat

O usuário acompanha pelo chat, não pelo terminal. **Após cada marco, mostre um
resumo do estado inline** — não mande ele abrir o painel:

| Marco | O que mostrar |
|---|---|
| commit feito | hash, arquivos, branch |
| preview aberto | o que mudou visualmente, mobile e desktop |
| erro corrigido | o que era, o que virou, `tsc` limpo |
| push/deploy | commit publicado e onde acompanhar |
| fim de tarefa longa | portões + pendências que sobraram |

Use `show_widget` quando o estado for melhor lido em painel do que em prosa
(vários números de uma vez, comparação antes/depois). Para uma ou duas
informações, texto corrido é melhor — widget para tudo vira ruído.

---

## Fluxo de trabalho

```
worktree → editar → tsc (hook automático) → i18n → preview → aprovação → selo → commit → push → Lightsail
```

1. Toda feature ou fix nasce em worktree — **nunca editar direto na main**
2. Pré-visualização: **Figma via MCP** quando houver link; senão **localhost** (`preview_start` → `zilmer-dev`)
3. Aprovação visual do usuário é obrigatória e não pode ser presumida
4. Commit no padrão `feat:` · `fix:` · `style:` · `chore:` · `refactor:`
5. `git add` com caminhos explícitos — **nunca `git add .`**
6. Push na main = deploy em produção

### Worktree
```bash
git worktree add ../zilmer-feature-<nome> -b feature/<nome>
cd ../zilmer-feature-<nome> && npm install   # node_modules não é compartilhado
# ... trabalho, commit ...
git worktree remove ../zilmer-feature-<nome>
```

---

## Design

- **Tokens:** `app/globals.css` (`--primary-color` #003366, `--secondary-color` #0066cc,
  `--accent-color` #ff6600, e mais 5). Detalhes em `memory/DESIGN.md`
- **Figma:** quando houver link, extrair tokens via MCP **antes** de codificar e mapear
  para as variáveis existentes — nunca espalhar hex literal nos `.module.css`
- **Mobile é obrigatório:** o site já teve regressão de layout em telas pequenas.
  Testar sempre em 375px antes de aprovar

---

## Contexto Atual

- **Última sessão:** 2026-08-04
- **O que foi feito:** montada a infraestrutura de agentes, hooks, comandos e memória; corrigidos o hook de lint quebrado e a descrição errada da stack (era "Tailwind", é CSS Modules)
- **Em progresso:** nada em aberto
- **Próximos passos:** rodar `/cleanup` para tratar os ~25 `.md` soltos na raiz; avaliar n8n + Flowise (ver `memory/AUTOMACOES.md`, exige Docker, ainda não instalado)

---

## Instruções para o Claude

1. Ler `memory/DECISIONS.md` antes de propor mudança de arquitetura
2. Ler `memory/BUGS.md` antes de criar componente novo
3. Ler `memory/DESIGN.md` antes de mexer em estilo
4. **Nunca** publicar sem o agente `pre-deploy` — push na main vai direto para os clientes
5. **Nunca** commitar na `main` diretamente — usar worktree
6. Toda mudança de texto passa pelo `guardiao-i18n` (pt/en/es)
7. Ao receber link do Figma, extrair tokens via MCP antes de codificar
8. Ao final da sessão, acionar o agente `memoria`
9. Não sugerir Tailwind, ESLint ou bibliotecas de UI sem perguntar — o projeto é deliberadamente enxuto
