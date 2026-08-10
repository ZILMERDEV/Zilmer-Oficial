---
description: Bateria obrigatória de pré-deploy — tsc, build, i18n, assets e preview visual. Não publica.
allowed-tools: Task, Bash, Read, Grep, Glob
---

Rode a verificação completa de pré-deploy do site Zilmer usando o agente `pre-deploy`, **parando na Fase 2** (aprovação visual). Não faça commit nem push neste comando.

Contexto atual do repositório:

- Branch: !`git rev-parse --abbrev-ref HEAD`
- Alterações pendentes: !`git status --porcelain`
- Diff resumido: !`git diff --stat HEAD`

Escopo extra pedido pelo usuário: $ARGUMENTS

Ao final, se tudo passou e o usuário aprovou o visual, grave o selo:

```bash
node .claude/hooks/selo-deploy.js --tsc ok --build ok --i18n ok --visual aprovado
```

Só grave `--visual aprovado` se o usuário tiver dito sim depois de ver o preview. O selo vale 30 minutos e é o que libera o `git push` na main.
