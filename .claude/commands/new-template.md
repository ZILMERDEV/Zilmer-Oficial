---
description: Cria um template de página novo em worktree isolado e registra em memory/TEMPLATES.md.
allowed-tools: Task, Bash, Read, Edit, Write, Grep, Glob
---

Crie o template **$ARGUMENTS** para o site Zilmer.

Estado atual:

- Branch: !`git rev-parse --abbrev-ref HEAD`
- Worktrees: !`git worktree list`
- Componentes existentes: !`ls components/`

Passos:

1. **Worktree isolado** — nunca trabalhe direto na `main` (push na main publica em produção):
   ```bash
   git worktree add ../zilmer-feature-$ARGUMENTS feature/$ARGUMENTS
   ```

2. **Reaproveite antes de criar** — rode `Grep` em `components/` e nos `*.module.css` existentes. `AreasAtuacao`, `ProjetosRecentes`, `ImageGallery`, `HeroCarousel` e `ContactButton` já cobrem cards, grids e CTA. Só crie componente novo se nenhum padrão servir.

3. **Estrutura** — rota em `app/[locale]/<slug>/page.tsx` + `page.module.css` irmão. CSS Modules, **não Tailwind**. Cores e espaçamentos vindos das variáveis de `app/globals.css`.

4. **Trilíngue desde o início** — toda string via `useTranslations`, chaves nos três arquivos `messages/{pt,en,es}.json`. Se o template consome dados, crie o trio `data/x.json` + `x.en.json` + `x.es.json`. Acione o agente `guardiao-i18n` ao final.

5. **Revisão visual** — acione o agente `design-web`: hierarquia, escala de espaçamento, contraste AA, colapso para uma coluna abaixo de 768px, teste em 375px.

6. **Registro** — acione o agente `memoria` para registrar em `memory/TEMPLATES.md` com arquivo, seções, variantes e data.

Não publique neste comando. Publicar é `/publicar`, depois de `/preflight`.
