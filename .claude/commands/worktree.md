---
description: Cria, lista ou remove worktrees de feature (substitui o fluxo de branches do Cursor).
allowed-tools: Bash, Read, Grep, Glob
---

Gerencie worktrees do projeto Zilmer. Pedido: $ARGUMENTS

Estado atual:

- Worktrees: !`git worktree list`
- Branch atual: !`git rev-parse --abbrev-ref HEAD`
- Branches: !`git branch -a --format='%(refname:short)' | head -20`

**Criar** (padrão `../zilmer-feature-<nome>` com branch `feature/<nome>`):
```bash
git worktree add ../zilmer-feature-<nome> -b feature/<nome>
```
Depois de criar, lembre o usuário de rodar `npm install` no worktree novo — `node_modules` não é compartilhado entre worktrees.

**Remover** (só depois do merge, e nunca com trabalho não commitado):
```bash
git worktree remove ../zilmer-feature-<nome>
```
Antes de remover, confira `git -C ../zilmer-feature-<nome> status --porcelain`. Se houver pendência, pare e avise — não use `--force`.

**Regra do projeto:** a `main` é produção. Push na main dispara o deploy no Lightsail. Toda feature ou fix nasce em worktree; o merge na main é decisão explícita do usuário, sempre precedida de `/preflight`.
