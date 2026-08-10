---
description: Revisão de design — abre o preview, confere mobile/desktop, contraste, hierarquia e consistência.
allowed-tools: Task, Bash, Read, Edit, Write, Grep, Glob
---

Rode o agente `design-web` sobre: $ARGUMENTS

Se o usuário passou um link do Figma, extraia os tokens antes de codificar (`get_variable_defs`, `get_design_context`, `get_screenshot`) e mapeie-os para as variáveis CSS de `app/globals.css` em vez de espalhar hex literal.

Sem Figma, valide no localhost: `preview_start` com `{ "name": "zilmer-dev" }`, depois `resize_window` em mobile (375×812) e desktop (1280×800).

Checklist mínimo: um `h1` por página · níveis de heading sem pular · espaçamentos na escala 4/8/16/24/32/48/64 · contraste AA (4.5:1 corpo, 3:1 texto grande) · `--accent-color` só na ação primária · grid colapsando abaixo de 768px · `alt` em toda imagem · alvo de toque ≥44px · console sem erro.

Atenção ao peso das imagens: `next.config.js` usa `images: { unoptimized: true }`, então nada é redimensionado automaticamente.
