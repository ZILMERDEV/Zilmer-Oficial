# DECISIONS.md — Decisões de Arquitetura

> Registra o **porquê** de cada decisão técnica importante.
> Consultar antes de propor mudanças estruturais.

---

## Formato

```
### [YYYY-MM-DD] Título da Decisão
**Decisão:** o que foi decidido
**Motivo:** por que foi escolhido
**Alternativas consideradas:** o que foi descartado e por quê
**Impacto:** quais arquivos/áreas afetados
```

---

## Decisões

### [2026-08-04] CSS Modules como estratégia de estilo — CORREÇÃO
**Decisão:** CSS Modules (`*.module.css`) + variáveis CSS em `app/globals.css`  
**Motivo:** é o que o projeto **de fato** usa — cada componente tem seu `.module.css` irmão, e os tokens vivem como custom properties no `:root`. Escopo automático sem build extra, e nenhuma dependência adicional.  
**Alternativas consideradas:** Tailwind (exigiria migrar 9 componentes + ~15 páginas e adicionar postcss/tailwind ao build, sem ganho para um site institucional de porte pequeno)  
**Impacto:** todos os arquivos de estilo  
**Nota:** a versão anterior desta entrada afirmava que o projeto usava Tailwind. Era falso — não há `tailwind.config`, `postcss.config` nem `tailwindcss` no `package.json`. Corrigido em 2026-08-04 junto com o `CLAUDE.md`.

### [2026-08-04] Sem ESLint; verificação contínua por `tsc`
**Decisão:** a checagem automática após cada edição é `npx tsc --noEmit`, restrita a arquivos `.ts`/`.tsx`  
**Motivo:** não há ESLint instalado no projeto. O hook original chamava `npm run lint`, script inexistente, e falhava em toda edição — barulho sem sinal. `tsc` com `strict: true` já captura a classe de erro que realmente derruba a build no Lightsail.  
**Alternativas consideradas:** instalar `eslint` + `eslint-config-next` (adiciona dependências e ruído de configuração inicial; pode ser revisto se o time crescer)  
**Impacto:** `.claude/settings.json`, `.claude/hooks/verificar-tipos.js`

### [2026-08-10] `.github/workflows/` é intocável — trava por permissão
**Decisão:** `Edit` e `Write` em `.github/**` são **negados** em `.claude/settings.json`. Leitura continua liberada.
**Motivo:** o workflow de deploy foi escrito por um desenvolvedor terceiro e **funciona** — 6 de 6 execuções recentes com sucesso, ~1 min cada. Ele já tem `script_stop: true` + `set -e`, então build quebrada **não** reinicia o `pm2`: o site continua servindo a versão anterior em vez de subir código quebrado. Mexer em deploy sem staging é risco sem contrapartida.
**Alternativas consideradas:** deixar a proteção como instrução no `CLAUDE.md` (ignorável — foi por isso que o portão de deploy também virou hook em vez de texto)
**Impacto:** `.claude/settings.json`; qualquer manutenção futura no deploy exige remover a trava conscientemente ou editar o arquivo à mão
**Custo aceito:** a melhor melhoria possível seria um job de CI rodando `tsc` + build **antes** do deploy. Isso mora em `.github/` e está fora de alcance. Consequência: **a única verificação de qualidade que existe é a máquina do Rocco.** Publicar de outro computador contorna tudo.
**Nota factual:** o gatilho é `on: push: branches: [main]` — só **push na `main`** publica. Commit e push em outras branches não disparam nada. Verificado em 2026-08-10: push de 31 arquivos em `chore/infra-agentes` não gerou execução.
**Pendente:** ativar notificação de falha de Actions em `github.com/settings/notifications`. Hoje, se a build quebrar no Lightsail, ninguém é avisado.

### [2026-08-10] O portão verifica, não confia no selo
**Decisão:** no momento do `git push`, `portao-deploy.js` roda `npx tsc --noEmit` por conta própria e confere se `.next` é mais recente que o código-fonte. O resultado dessas checagens **vence** o que estiver escrito no selo.
**Motivo:** o selo é gravado pelo Claude. Na versão anterior o portão apenas lia o arquivo e acreditava — bastava o Claude escrever `--tsc ok` sem ter rodado para o portão abrir. Verificação feita pelo próprio portão não depende da honestidade nem da atenção de quem escreveu o selo.
**Alternativas consideradas:** confiar no selo e reforçar a instrução no agente (mesmo problema de sempre: instrução não é garantia)
**Impacto:** `.claude/hooks/portao-deploy.js`. Custo de ~10s por push; só roda em push, graças ao filtro `if: Bash(git push*)`
**Verificado em 2026-08-10:** selo afirmando `tsc ok` com erro de tipo real no projeto → bloqueado, com arquivo e linha. Selo afirmando `build ok` com `.next` de 17/07 e código de 04/08 → bloqueado.

### [2026-08-10] A aprovação visual é humana e não tem como ser automatizada
**Decisão:** a aprovação visual continua sendo do usuário, no chat. O selo passou a exigir **evidência** junto: `--rotas`, `--viewports` e `--disse` (as palavras literais do usuário). Toda aprovação é registrada em `.claude/estado/aprovacoes.jsonl`, que é append-only.
**Motivo:** nenhum código prova que um humano olhou a tela e gostou. É a única etapa do processo que permanece sob julgamento do Claude, e isso é estrutural, não preguiça de implementação. O que dá para fazer é tirar do escuro: exigir evidência transforma "aprovado" de afirmação em registro datado e conferível contra a conversa.
**Alternativas consideradas:** um token que só o usuário produz (o Claude também poderia forjá-lo — não há como provar autoria de dentro do próprio processo)
**Impacto:** `.claude/hooks/selo-deploy.js`
**Como auditar:** se houve push e você não se lembra de ter aprovado, houve falha. `aprovacoes.jsonl` e `git log` têm data e hora; o registro deve bater com a conversa.

### [2026-08-04] Portão de deploy obrigatório por hook
**Decisão:** `git push` que atinge a `main` é **bloqueado por hook** sem selo de pré-deploy válido (30 min) contendo aprovação visual explícita do usuário  
**Motivo:** push na main dispara GitHub Actions → SSH no Lightsail → build → `pm2 restart`, direto em `zilmer.com.br`. Não há staging nem rollback automático. Depender da disciplina do modelo ou do usuário para rodar a checagem não é garantia; hook é.  
**Alternativas consideradas:** apenas instruir no `CLAUDE.md` (ignorável); exigir PR e review no GitHub (mais seguro, porém lento demais para operação de uma pessoa só)  
**Impacto:** `.claude/hooks/portao-deploy.js`, `.claude/hooks/selo-deploy.js`, `.claude/settings.json`, fluxo de publicação

### [2026-08-04] Git Worktree como estratégia de branches
**Decisão:** Cada feature/fix em worktree isolado, nunca editar diretamente na main  
**Motivo:** Deploy automático na main; worktree evita commits acidentais em produção  
**Alternativas consideradas:** branches normais com checkout (mais lento, sem isolamento de ambiente)  
**Impacto:** todo fluxo de desenvolvimento

### [2026-08-04] Figma como fonte da verdade visual
**Decisão:** Design sempre parte do Figma, Claude Code lê via MCP  
**Motivo:** Evita divergência entre design e código; tokens extraídos automaticamente  
**Alternativas consideradas:** design direto no código (sem fonte única de verdade)  
**Impacto:** todos os componentes visuais

---

<!-- Novas decisões acima desta linha -->
