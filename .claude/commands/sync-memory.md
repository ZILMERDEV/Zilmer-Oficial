---
description: Consolida o contexto da sessão em memory/*.md e no Contexto Atual do CLAUDE.md.
allowed-tools: Task, Bash, Read, Edit, Write, Grep, Glob
---

Rode o agente `memoria` para consolidar esta sessão.

Fatos do git:

- Commits recentes: !`git log --oneline -15`
- Alterado desde o último commit: !`git status --porcelain`
- Volume da última mudança: !`git diff --stat HEAD~1`

Observação adicional do usuário sobre a sessão: $ARGUMENTS

Atualize apenas o que mudou de fato: `memory/CHANGELOG.md` sempre; `DECISIONS.md` só se houve decisão com alternativa descartada; `BUGS.md` se bug foi descoberto ou resolvido; `TEMPLATES.md` se template/componente foi criado ou alterado; `DESIGN.md` se padrão visual mudou; e a seção "Contexto Atual" do `CLAUDE.md`.
