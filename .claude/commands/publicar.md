---
description: Fluxo completo de publicação — preview, aprovação, commit e push para deploy no Lightsail.
allowed-tools: Task, Bash, Read, Grep, Glob
---

Execute o fluxo completo de publicação do site Zilmer com o agente `pre-deploy`, das três fases, do início ao fim.

Estado atual:

- Branch: !`git rev-parse --abbrev-ref HEAD`
- Pendências: !`git status --porcelain`
- Últimos commits: !`git log --oneline -5`

Descrição do que está sendo publicado (para a mensagem de commit): $ARGUMENTS

Lembretes do fluxo:

1. **Portões automáticos** — `npx tsc --noEmit`, `npm run build`, paridade i18n (agente `guardiao-i18n`), assets, diff limpo. Qualquer falha para tudo.
2. **Aprovação visual** — preview no Figma se houver link; senão `preview_start` em `zilmer-dev`, rotas afetadas em `/pt` (`/en` e `/es` se mexeu em conteúdo), mobile 375px e desktop, console sem erro. **Pergunte e espere o "sim".**
3. **Publicação** — selo (`node .claude/hooks/selo-deploy.js --tsc ok --build ok --i18n ok --visual aprovado`), `git add` com caminhos explícitos (nunca `git add .`), commit no padrão `feat:`/`fix:`/`style:`/`refactor:`/`chore:`, `git push origin main`.

Depois do push, informe que o deploy foi disparado e onde acompanhar:
https://github.com/ZILMERDEV/Zilmer-Oficial/actions

Ao final, acione o agente `memoria` para registrar o deploy no `memory/CHANGELOG.md`.
