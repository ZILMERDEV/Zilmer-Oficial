---
description: Diagnóstico rápido de saúde — tipos, build, i18n e git, sem tocar em nada.
allowed-tools: Bash, Read, Grep, Glob, Task
---

Rode um diagnóstico de saúde do site Zilmer e reporte. **Não corrija nada** neste comando — apenas apure e apresente.

- Tipos: !`npx tsc --noEmit 2>&1 | tail -20`
- Git: !`git status --short`
- Branch: !`git rev-parse --abbrev-ref HEAD`
- Últimos commits: !`git log --oneline -5`
- Chaves i18n: !`node -e "const f=(o,p='')=>Object.entries(o).flatMap(([k,v])=>v&&typeof v==='object'?f(v,p+k+'.'):[p+k]);const pt=f(require('./messages/pt.json'));for(const l of ['en','es']){const x=f(require('./messages/'+l+'.json'));console.log(l+': '+x.length+'/'+pt.length+' chaves, faltando '+pt.filter(k=>!x.includes(k)).length)}" 2>&1`

Foco extra: $ARGUMENTS

Apresente como semáforo (🟢 ok / 🟡 atenção / 🔴 bloqueia deploy) e, ao final, diga qual agente resolve cada item vermelho: `corretor-de-erros`, `guardiao-i18n`, `faxineiro` ou `design-web`.
