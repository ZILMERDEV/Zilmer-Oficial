# CHANGELOG.md — Histórico de Sessões

> Atualizado automaticamente pelo agente Context Sync ao final de cada sessão.
> Usar comando `/sync-memory` para disparar a atualização.

---

## Formato

```
### [YYYY-MM-DD] Sessão — Resumo curto
**Duração estimada:** X horas
**Worktree usado:** feature/nome ou main
**O que foi feito:**
- item 1
- item 2
**Arquivos modificados:** lista dos principais
**Commits:** lista de commits da sessão
**Ficou pendente:** o que não foi concluído
```

---

## Histórico

### [2026-08-04] Sessão — Infraestrutura de agentes, hooks e portão de deploy
**Worktree usado:** main (só arquivos de configuração, nenhum código do site alterado)
**O que foi feito:**
- Auditado o repositório real e corrigidas duas afirmações falsas na memória: o projeto usa **CSS Modules**, não Tailwind, e **não tem ESLint** instalado
- Criados 6 agentes em `.claude/agents/`: `pre-deploy`, `corretor-de-erros`, `faxineiro`, `guardiao-i18n`, `design-web`, `memoria`
- Criados 8 comandos em `.claude/commands/`: `/check`, `/preflight`, `/publicar`, `/cleanup`, `/sync-memory`, `/new-template`, `/visual`, `/worktree`
- Substituído o hook de lint quebrado (chamava `npm run lint`, script inexistente, e usava a variável errada `$CLAUDE_PROJECT_ROOT`) por `verificar-tipos.js`, que roda `tsc --noEmit` apenas em `.ts`/`.tsx`
- Criado o **portão de deploy**: `portao-deploy.js` bloqueia `git push` na main sem selo válido de pré-deploy com aprovação visual. Testado com 9 casos, todos passando
- Criados `memory/DESIGN.md` (tokens, contraste medido, checklist visual) e `memory/AUTOMACOES.md` (plano n8n + Flowise)
- `.gitignore` passou a cobrir `tsc_output.txt`, o selo transitório e arquivos `.env`
**Arquivos modificados:** `CLAUDE.md`, `.claude/settings.json`, `.gitignore`, `memory/DECISIONS.md`
**Ficou pendente:**
- `/cleanup` para tratar os ~25 `.md` soltos na raiz
- n8n + Flowise: exige Docker, ausente na máquina

### [2026-08-04] Sessão — Setup inicial do sistema de memória
**O que foi feito:**
- Criado CLAUDE.md com estrutura completa do projeto
- Criado sistema `/memory` com DECISIONS.md, TEMPLATES.md, CHANGELOG.md, BUGS.md
- Criado `.claude/settings.json` com hooks de lint automático
- Definido workflow Git Worktree + Figma MCP + deploy automático
**Ficou pendente:**
- Preencher dados reais do projeto (nome, URL, repositório)
- Configurar paths reais de lint no settings.json

