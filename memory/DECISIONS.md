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
