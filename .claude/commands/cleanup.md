---
description: Auditoria de limpeza da pasta-mãe — órfãos, CSS morto, assets soltos, docs duplicados.
allowed-tools: Task, Bash, Read, Grep, Glob
---

Rode o agente `faxineiro` para auditar o repositório do site Zilmer.

Foco desta rodada (se vazio, auditoria completa): $ARGUMENTS

Estado do repositório:

- Arquivos rastreados: !`git ls-files | wc -l`
- Não rastreados: !`git status --porcelain --untracked-files=all | grep '^??' | head -30`

Lembre: o agente **audita e reporta**, não apaga. Ao final ele pergunta o que o usuário autoriza remover. Nada é removido antes da resposta.
